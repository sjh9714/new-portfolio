import { StatusBadge } from "@/components/status-badge";
import type { Evidence } from "@/content/projects";

const rows: {
  status: Evidence["status"];
  definition: string;
  standard: string;
}[] = [
  {
    status: "measured",
    definition: "날짜·환경·시나리오를 함께 남긴 부하 또는 성능 측정",
    standard: "측정 명령과 결과 artifact를 정확한 저장소 permalink로 연결",
  },
  {
    status: "verified",
    definition: "반복 가능한 테스트로 정합성·복구 경로를 확인한 항목",
    standard: "테스트 파일과 실행 방법을 정확한 저장소 permalink로 연결",
  },
];

export function EvidenceMatrix() {
  return (
    <div className="border-border grid border-y md:grid-cols-2">
      {rows.map((row, index) => (
        <article
          key={row.status}
          className="border-border grid gap-5 border-b py-5 last:border-b-0 md:border-b-0 md:px-6 md:first:pl-0 md:last:pr-0"
          style={index > 0 ? { borderInlineStartWidth: 1 } : undefined}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-foreground font-semibold">
              {row.status === "measured" ? "측정 근거" : "검증 근거"}
            </h3>
            <StatusBadge status={row.status} />
          </div>
          <dl className="grid gap-3 text-sm leading-6">
            <div>
              <dt className="text-muted-foreground font-mono text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
                정의
              </dt>
              <dd className="text-foreground mt-1">{row.definition}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-mono text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
                공개 기준
              </dt>
              <dd className="text-foreground mt-1">{row.standard}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
