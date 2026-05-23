/* eslint-disable @next/next/no-img-element -- Architecture SVG files are static documentation assets with DOM-readable alt text. */
import type { PortfolioProblemArchitecture } from "@/content/portfolio-cases";

export function ArchitectureFigure({
  architecture,
}: {
  architecture: PortfolioProblemArchitecture;
}) {
  return (
    <figure className="border-border bg-background flex flex-col gap-3 rounded-md border p-3">
      <div className="overflow-x-auto">
        <img
          src={architecture.imageSrc}
          alt={architecture.alt}
          className="min-w-[900px] rounded-sm md:w-full md:min-w-0"
          loading="lazy"
        />
      </div>
      <figcaption className="text-muted-foreground text-sm leading-6 [overflow-wrap:anywhere]">
        {architecture.caption}
        <span className="mt-1 block text-xs">
          파일: {architecture.sourceFile}
        </span>
      </figcaption>
    </figure>
  );
}
