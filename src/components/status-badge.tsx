import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EvidenceStatus } from "@/content/projects";

const statusCopy: Record<EvidenceStatus, string> = {
  measured: "측정 완료",
  verified: "시나리오 검증",
  pending: "추가 측정 예정",
};

const statusClasses: Record<EvidenceStatus, string> = {
  measured:
    "border-[var(--status-measured-border)] bg-[var(--status-measured-bg)] text-[var(--status-measured)]",
  verified:
    "border-[var(--status-verified-border)] bg-[var(--status-verified-bg)] text-[var(--status-verified)]",
  pending:
    "border-[var(--status-pending-border)] bg-[var(--status-pending-bg)] text-[var(--status-pending)]",
};

export function StatusBadge({
  status,
  className,
}: {
  status: EvidenceStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 rounded-md font-semibold",
        statusClasses[status],
        className,
      )}
    >
      {statusCopy[status]}
    </Badge>
  );
}
