import { ArchitectureFigure } from "@/components/architecture/architecture-figure";
import type { PortfolioCase } from "@/content/portfolio-cases";

export function PortfolioCaseDiagram({
  portfolioCase,
}: {
  portfolioCase: PortfolioCase;
}) {
  return (
    <section className="border-border bg-card flex flex-col gap-5 rounded-md border p-4 md:p-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-foreground text-xl font-semibold tracking-tight">
          문제 구간 아키텍처
        </h2>
      </div>

      <ArchitectureFigure architecture={portfolioCase.problemArchitecture} />

      <KeyArchitectureDecisions
        decisions={portfolioCase.keyArchitectureDecisions}
      />
    </section>
  );
}

function KeyArchitectureDecisions({ decisions }: { decisions?: string[] }) {
  if (!decisions?.length) {
    return null;
  }

  return (
    <section className="border-border bg-background flex flex-col gap-3 rounded-md border p-4">
      <h3 className="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
        핵심 설계 판단
      </h3>
      <ul className="grid gap-2 text-sm leading-6">
        {decisions.map((decision) => (
          <li key={decision} className="flex gap-2 [overflow-wrap:anywhere]">
            <span
              aria-hidden="true"
              className="bg-primary mt-2 size-1.5 shrink-0 rounded-full"
            />
            <span className="text-foreground">{decision}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
