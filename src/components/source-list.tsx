import { CheckCircle2, UserRoundCheck } from "lucide-react";

import { getSources } from "@/content/sources";

export function SourceList({ sourceIds }: { sourceIds: readonly string[] }) {
  const unique = [...new Set(sourceIds)];
  const sourceList = getSources(unique);

  return (
    <ul className="source-list">
      {sourceList.map((source) => (
        <li key={source.id}>
          <span className={`source-icon source-${source.verification}`}>
            {source.verification === "public" ? (
              <CheckCircle2 aria-hidden="true" />
            ) : (
              <UserRoundCheck aria-hidden="true" />
            )}
          </span>
          <div>
            <p>{source.label}</p>
            <span>
              {source.verification === "public"
                ? "공개 저장소에서 확인"
                : "프로젝트 소유자 확인"}
            </span>
          </div>
          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${source.label} 근거 (새 창)`}
            >
              근거 ↗
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
