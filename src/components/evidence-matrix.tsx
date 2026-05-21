import { StatusBadge } from "@/components/status-badge";
import type { EvidenceStatus } from "@/content/projects";

const statusLabels: Record<EvidenceStatus, string> = {
  measured: "측정 완료",
  verified: "시나리오 검증",
  pending: "추가 측정 예정",
};

const rows: {
  status: EvidenceStatus;
  definition: string;
  standard: string;
  expression: string;
}[] = [
  {
    status: "measured",
    definition: "부하/성능/용량을 도구로 측정하여 수치로 확인한 항목",
    standard: "k6 부하 테스트, RPS/latency 측정, 리소스 사용량, 임계점 도출",
    expression: '{ "status": "measured", "evidence": "k6 test result" }',
  },
  {
    status: "verified",
    definition:
      "통합/정합성/복구 시나리오를 반복 실행하여 기대 결과를 검증한 항목",
    standard:
      "Testcontainers 통합 테스트, 재현 가능한 시나리오, 로그/지표 검증",
    expression: '{ "status": "verified", "evidence": "integration test" }',
  },
  {
    status: "pending",
    definition:
      "설계/구현 진행 중이거나 운영 데이터 축적으로 검증이 예정된 항목",
    standard: "운영 지표 축적 필요, 추가 실험/데이터 수집 예정",
    expression: '{ "status": "pending", "evidence": "in progress" }',
  },
];

export function EvidenceMatrix() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {rows.map((row) => (
        <article
          key={row.status}
          className="border-border bg-card flex min-w-0 flex-col gap-4 border p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-foreground font-semibold">
              {statusLabels[row.status]}
            </h3>
            <StatusBadge status={row.status} />
          </div>
          <EvidenceText label="정의" value={row.definition} />
          <EvidenceText label="기준" value={row.standard} />
          <code className="border-border bg-muted text-foreground block rounded-md border p-3 font-mono text-xs leading-5 [overflow-wrap:anywhere]">
            {row.expression}
          </code>
        </article>
      ))}
    </div>
  );
}

function EvidenceText({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
        {label}
      </p>
      <p className="text-foreground text-sm leading-6">{value}</p>
    </div>
  );
}
