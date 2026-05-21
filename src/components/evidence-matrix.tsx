import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EvidenceStatus } from "@/content/projects";

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
    expression: '{ "status": "Measured", "evidence": "k6 test result" }',
  },
  {
    status: "verified",
    definition:
      "통합/정합성/복구 시나리오를 반복 실행하여 기대 결과를 검증한 항목",
    standard:
      "Testcontainers 통합 테스트, 재현 가능한 시나리오, 로그/지표 검증",
    expression: '{ "status": "Verified", "evidence": "integration test" }',
  },
  {
    status: "pending",
    definition:
      "설계/구현 진행 중이거나 운영 데이터 축적으로 검증이 예정된 항목",
    standard: "운영 지표 축적 필요, 추가 실험/데이터 수집 예정",
    expression: '{ "status": "Pending", "evidence": "in progress" }',
  },
];

export function EvidenceMatrix() {
  return (
    <div className="border-border bg-card border">
      <div className="grid gap-0 md:hidden">
        {rows.map((row) => (
          <article
            key={row.status}
            className="border-border flex flex-col gap-4 border-b p-4 last:border-b-0"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-foreground font-semibold">{row.status}</h3>
              <StatusBadge status={row.status} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
                정의
              </p>
              <p className="text-foreground text-sm leading-6">
                {row.definition}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
                기준
              </p>
              <p className="text-foreground text-sm leading-6">
                {row.standard}
              </p>
            </div>
            <code className="border-border bg-muted text-foreground block rounded-md border p-3 font-mono text-xs leading-5 [overflow-wrap:anywhere]">
              {row.expression}
            </code>
          </article>
        ))}
      </div>
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>정의</TableHead>
            <TableHead>기준</TableHead>
            <TableHead>표현</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.status}>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell className="leading-6 whitespace-normal">
                {row.definition}
              </TableCell>
              <TableCell className="leading-6 whitespace-normal">
                {row.standard}
              </TableCell>
              <TableCell className="whitespace-normal">
                <code className="border-border bg-muted text-foreground block rounded-md border p-3 font-mono text-xs leading-5">
                  {row.expression}
                </code>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
