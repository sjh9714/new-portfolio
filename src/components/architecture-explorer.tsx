"use client";

import { Expand, X } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/content/portfolio-cases";

export function ArchitectureExplorer({
  architecture,
}: {
  architecture: CaseStudy["architecture"];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function openDiagram() {
    dialogRef.current?.showModal();
  }

  function closeDiagram() {
    dialogRef.current?.close();
    triggerRef.current?.focus();
  }

  return (
    <section aria-labelledby="architecture-title" className="grid gap-6">
      <div className="grid gap-2">
        <p className="section-kicker">Structure</p>
        <h2
          id="architecture-title"
          className="text-foreground text-2xl font-bold tracking-tight md:text-3xl"
        >
          구조와 흐름
        </h2>
      </div>

      <figure className="border-border bg-card hidden border-y py-6 md:block">
        <div className="mx-auto w-fit max-w-full overflow-auto">
          {/* Static generated SVGs contain their own intrinsic dimensions and accessible title/description. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={architecture.imageSrc}
            alt={architecture.alt}
            className="h-auto w-auto max-w-full"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption className="text-muted-foreground mt-4 max-w-3xl text-sm leading-6">
          {architecture.caption}
        </figcaption>
      </figure>

      <div className="grid gap-5 md:hidden">
        <ol className="border-border grid border-t">
          {architecture.mobileSteps.map((step, index) => (
            <li
              key={step}
              className="border-border grid grid-cols-[2.5rem_1fr] gap-3 border-b py-4 text-sm leading-6"
            >
              <span className="text-primary font-mono text-xs font-semibold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-foreground">{step}</span>
            </li>
          ))}
        </ol>
        <Button
          ref={triggerRef}
          type="button"
          variant="outline"
          onClick={openDiagram}
        >
          <Expand aria-hidden="true" />
          전체 구조도 보기
        </Button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="diagram-dialog-title"
        className="bg-background text-foreground m-0 h-dvh max-h-none w-screen max-w-none p-0 backdrop:bg-slate-950/50"
      >
        <div className="flex h-full flex-col">
          <header className="border-border bg-card flex min-h-16 items-center justify-between gap-4 border-b px-5">
            <h3 id="diagram-dialog-title" className="font-semibold">
              전체 구조도
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="구조도 닫기"
              onClick={closeDiagram}
            >
              <X aria-hidden="true" />
            </Button>
          </header>
          <div className="min-h-0 flex-1 overflow-auto p-5">
            <div className="border-border bg-card mx-auto w-max max-w-none border p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={architecture.imageSrc}
                alt={architecture.alt}
                className="h-auto w-auto max-w-none"
                decoding="async"
              />
            </div>
            <p className="text-muted-foreground mt-4 max-w-3xl text-sm leading-6">
              {architecture.caption}
            </p>
          </div>
        </div>
      </dialog>
    </section>
  );
}
