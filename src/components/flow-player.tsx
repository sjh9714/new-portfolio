"use client";

import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import type { FlowPlayback, FlowVariant } from "@/content/types";

function FlowStage({
  variant,
  stepIndex,
}: {
  variant: FlowVariant;
  stepIndex: number;
}) {
  const step = variant.steps[stepIndex];
  const actorMap = new Map(variant.actors.map((actor) => [actor.id, actor]));

  return (
    <div className="flow-stage" aria-hidden="true">
      <svg viewBox="0 0 1000 480" className="flow-stage-edges">
        <defs>
          <marker
            id="flow-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="currentColor" />
          </marker>
        </defs>
        {variant.edges.map((edge) => {
          const from = actorMap.get(edge.from);
          const to = actorMap.get(edge.to);
          if (!from || !to) return null;
          const active = step.activeEdgeIds.includes(edge.id);
          const x1 = from.x * 10;
          const y1 = from.y * 4.8;
          const x2 = to.x * 10;
          const y2 = to.y * 4.8;
          const bend = Math.max(35, Math.abs(x2 - x1) * 0.36);
          return (
            <g key={edge.id} className={active ? "active" : ""}>
              <path
                d={`M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`}
                markerEnd="url(#flow-arrow)"
              />
              {active ? (
                <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 10}>
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      {variant.actors.map((actor) => {
        const active = step.activeNodeIds.includes(actor.id);
        const state = step.visibleState[actor.id];
        return (
          <div
            key={actor.id}
            className={`flow-actor ${active ? "active" : ""}`}
            style={{ left: `${actor.x}%`, top: `${actor.y}%` }}
          >
            <span>{actor.label}</span>
            <small>{actor.detail}</small>
            {state ? <b>{state}</b> : null}
          </div>
        );
      })}
    </div>
  );
}

export function FlowPlayer({ flow }: { flow: FlowPlayback }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const requestedVariant = searchParams.get("variant");
  const initialVariant = flow.variants.some(
    (variant) => variant.id === requestedVariant,
  )
    ? requestedVariant!
    : flow.initialVariant;
  const [variantId, setVariantId] = useState(initialVariant);
  const variant = useMemo(
    () =>
      flow.variants.find((candidate) => candidate.id === variantId) ??
      flow.variants[0],
    [flow.variants, variantId],
  );
  const requestedStep = Number(searchParams.get("step") ?? 1) - 1;
  const [stepIndex, setStepIndex] = useState(
    Number.isInteger(requestedStep) &&
      requestedStep >= 0 &&
      requestedStep < variant.steps.length
      ? requestedStep
      : 0,
  );
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const updateUrl = (nextVariant: string, nextStep: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", nextVariant);
    params.set("step", String(nextStep + 1));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const moveTo = (next: number) => {
    const bounded = Math.max(0, Math.min(next, variant.steps.length - 1));
    setStepIndex(bounded);
    updateUrl(variant.id, bounded);
  };

  const changeVariant = (nextVariant: string) => {
    setPlaying(false);
    setVariantId(nextVariant);
    setStepIndex(0);
    updateUrl(nextVariant, 0);
  };

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setPlaying(false);
    };
    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= variant.steps.length - 1) {
          setPlaying(false);
          return current;
        }
        const next = current + 1;
        const params = new URLSearchParams(window.location.search);
        params.set("variant", variant.id);
        params.set("step", String(next + 1));
        window.history.replaceState(
          null,
          "",
          `${pathname}?${params.toString()}`,
        );
        return next;
      });
    }, 2500);
    return () => window.clearInterval(timer);
  }, [pathname, playing, reducedMotion, variant]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (
      ["INPUT", "BUTTON", "A"].includes((event.target as HTMLElement).tagName)
    )
      return;
    if (event.key === " " && !reducedMotion) {
      event.preventDefault();
      setPlaying((value) => !value);
    } else if (event.key === "ArrowLeft") moveTo(stepIndex - 1);
    else if (event.key === "ArrowRight") moveTo(stepIndex + 1);
    else if (event.key === "Home") moveTo(0);
    else if (event.key === "End") moveTo(variant.steps.length - 1);
  };

  const step = variant.steps[stepIndex];

  return (
    <section
      className="flow-player"
      aria-label={`${flow.title} 흐름 재생기`}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <div className="flow-player-topbar">
        <div className="variant-tabs" role="group" aria-label="흐름 선택">
          {flow.variants.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              aria-pressed={candidate.id === variant.id}
              onClick={() => changeVariant(candidate.id)}
            >
              {candidate.label}
            </button>
          ))}
        </div>
        <button
          className="flow-expand"
          type="button"
          onClick={() => dialogRef.current?.showModal()}
        >
          <Maximize2 aria-hidden="true" size={16} /> 크게 보기
        </button>
      </div>

      <div className="flow-workspace">
        <div className="flow-stage-wrap">
          <FlowStage variant={variant} stepIndex={stepIndex} />
        </div>
        <aside className="flow-narrative">
          <span>
            {String(stepIndex + 1).padStart(2, "0")} /{" "}
            {String(variant.steps.length).padStart(2, "0")}
          </span>
          <h2>{step.title}</h2>
          <p>{step.narrative}</p>
          <dl>
            {Object.entries(step.visibleState).map(([key, value]) => (
              <div key={key}>
                <dt>
                  {variant.actors.find((actor) => actor.id === key)?.label ??
                    key}
                </dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <div className="flow-mobile-summary">
        <span>
          {stepIndex + 1} / {variant.steps.length}
        </span>
        <h2>{step.title}</h2>
        <p>{step.narrative}</p>
        <ol>
          {variant.actors.map((actor) => (
            <li
              key={actor.id}
              className={step.activeNodeIds.includes(actor.id) ? "active" : ""}
            >
              <strong>{actor.label}</strong>
              <span>{step.visibleState[actor.id] ?? actor.detail}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flow-controls">
        <button
          type="button"
          onClick={() => moveTo(stepIndex - 1)}
          disabled={stepIndex === 0}
          aria-label="이전 단계"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          className="play-button"
          type="button"
          disabled={reducedMotion}
          onClick={() =>
            stepIndex === variant.steps.length - 1
              ? moveTo(0)
              : setPlaying((value) => !value)
          }
          aria-label={
            reducedMotion
              ? "동작 줄이기 설정으로 자동 재생 사용 안 함"
              : stepIndex === variant.steps.length - 1
                ? "처음부터 다시 보기"
                : playing
                  ? "일시정지"
                  : "재생"
          }
        >
          {stepIndex === variant.steps.length - 1 ? (
            <RotateCcw aria-hidden="true" />
          ) : playing ? (
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
        <div className="step-timeline" aria-label="단계 선택">
          {variant.steps.map((candidate, index) => (
            <button
              key={candidate.id}
              type="button"
              aria-label={`${index + 1}단계 ${candidate.title}`}
              aria-current={index === stepIndex ? "step" : undefined}
              onClick={() => moveTo(index)}
            >
              <span>{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {step.title}. {step.narrative}
      </p>

      <details className="flow-transcript">
        <summary>전체 흐름 텍스트로 읽기</summary>
        <ol>
          {variant.steps.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <p>{item.narrative}</p>
            </li>
          ))}
        </ol>
      </details>

      <dialog
        className="flow-dialog"
        ref={dialogRef}
        aria-label={`${flow.title} 전체 흐름`}
      >
        <div className="dialog-toolbar">
          <strong>{flow.title}</strong>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="전체 흐름 닫기"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="dialog-flow-stage">
          <FlowStage variant={variant} stepIndex={stepIndex} />
        </div>
      </dialog>
    </section>
  );
}
