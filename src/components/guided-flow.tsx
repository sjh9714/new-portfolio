"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { GuidedFlow as GuidedFlowType } from "@/content/types";
import { getVisual } from "@/content/visuals";

const interactiveSelector =
  'a, button, input, select, textarea, summary, [contenteditable="true"]';

export function GuidedFlow({ flow }: { flow: GuidedFlowType }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const regionRef = useRef<HTMLElement>(null);
  const activeFlow = searchParams.get("flow");
  const requestedVariant =
    activeFlow === flow.id ? searchParams.get("variant") : null;
  const initialVariant = flow.variants.some(
    (variant) => variant.id === requestedVariant,
  )
    ? requestedVariant!
    : flow.initialVariant;
  const [variantId, setVariantId] = useState(initialVariant);
  const variant = useMemo(
    () =>
      flow.variants.find((item) => item.id === variantId) ?? flow.variants[0],
    [flow.variants, variantId],
  );
  const requestedStep =
    activeFlow === flow.id ? Number(searchParams.get("step") ?? 1) - 1 : 0;
  const [stepIndex, setStepIndex] = useState(
    Number.isInteger(requestedStep) &&
      requestedStep >= 0 &&
      requestedStep < variant.steps.length
      ? requestedStep
      : 0,
  );
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobile, setMobile] = useState(false);
  const step = variant.steps[stepIndex];
  const visual = step.visualId ? getVisual(step.visualId) : undefined;

  const replaceUrl = useCallback(
    (nextStep: number, nextVariant: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("flow", flow.id);
      params.set("variant", nextVariant);
      params.set("step", String(nextStep + 1));
      router.replace(`${pathname}?${params.toString()}#${flow.id}`, {
        scroll: false,
      });
    },
    [flow.id, pathname, router, searchParams],
  );

  const moveTo = useCallback(
    (next: number) => {
      const bounded = Math.max(0, Math.min(next, variant.steps.length - 1));
      setStepIndex(bounded);
      replaceUrl(bounded, variant.id);
      if (bounded === variant.steps.length - 1) setPlaying(false);
    },
    [replaceUrl, variant.id, variant.steps.length],
  );

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setPlaying(false);
    };
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(max-width: 720px)");
    const sync = () => {
      setMobile(preference.matches);
      if (preference.matches) setPlaying(false);
    };
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (
      !playing ||
      reducedMotion ||
      mobile ||
      stepIndex >= variant.steps.length - 1
    )
      return;
    const timer = window.setTimeout(() => moveTo(stepIndex + 1), 2500);
    return () => window.clearTimeout(timer);
  }, [mobile, moveTo, playing, reducedMotion, stepIndex, variant.steps.length]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (
      event.target instanceof Element &&
      event.target.closest(interactiveSelector)
    )
      return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveTo(stepIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveTo(stepIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveTo(variant.steps.length - 1);
    } else if (event.key === " " && !reducedMotion && !mobile) {
      event.preventDefault();
      if (stepIndex === variant.steps.length - 1) moveTo(0);
      setPlaying((value) => !value);
    }
  };

  return (
    <section
      id={flow.id}
      className="guided-flow"
      aria-labelledby={`${flow.id}-title`}
      aria-label={`${flow.title} 흐름 재생기`}
      tabIndex={0}
      ref={regionRef}
      onKeyDown={onKeyDown}
    >
      <header className="guided-flow-heading">
        <div>
          <p className="eyebrow">단계별 흐름</p>
          <h2 id={`${flow.id}-title`}>{flow.title}</h2>
          <p>{flow.summary}</p>
        </div>
        {flow.variants.length > 1 ? (
          <label>
            흐름 선택
            <select
              value={variantId}
              onChange={(event) => {
                setPlaying(false);
                setVariantId(event.target.value);
                setStepIndex(0);
                replaceUrl(0, event.target.value);
              }}
            >
              {flow.variants.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <span className="flow-variant-label">{variant.label}</span>
        )}
      </header>

      <div className="guided-flow-layout">
        <div className="flow-stage-sticky">
          <div className="flow-stage-card">
            {visual ? (
              <Image
                src={visual.src}
                alt=""
                width={visual.width}
                height={visual.height}
                sizes="(max-width: 860px) calc(100vw - 40px), 520px"
              />
            ) : null}
            <div className="flow-stage-state">
              <span>
                {String(stepIndex + 1).padStart(2, "0")} /{" "}
                {String(variant.steps.length).padStart(2, "0")}
              </span>
              <strong>{step.state}</strong>
              <p aria-live="polite">{step.title}</p>
            </div>
          </div>
          <div className="flow-controls" aria-label="흐름 제어">
            <button
              type="button"
              onClick={() => moveTo(stepIndex - 1)}
              disabled={stepIndex === 0}
              aria-label="이전 단계"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (stepIndex === variant.steps.length - 1) moveTo(0);
                setPlaying((value) => !value);
              }}
              disabled={reducedMotion || mobile}
              aria-label={
                reducedMotion || mobile
                  ? mobile
                    ? "모바일에서 자동 재생 사용 안 함"
                    : "동작 줄이기 설정으로 자동 재생 사용 안 함"
                  : playing
                    ? "일시정지"
                    : "재생"
              }
            >
              {playing ? (
                <Pause aria-hidden="true" />
              ) : (
                <Play aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => moveTo(stepIndex + 1)}
              disabled={stepIndex === variant.steps.length - 1}
              aria-label="다음 단계"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>

        <ol className="flow-step-list">
          {variant.steps.map((item, index) => (
            <li
              key={item.id}
              className={index === stepIndex ? "is-active" : ""}
            >
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  moveTo(index);
                }}
                aria-current={index === stepIndex ? "step" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                  <small>{item.state}</small>
                </div>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <details className="flow-transcript">
        <summary>전체 흐름 텍스트로 읽기</summary>
        <ol>
          {variant.steps.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}
