import type { Metadata } from "next";
import { Play } from "lucide-react";
import Link from "next/link";

import { flows } from "@/content/flows";
import { getProject } from "@/content/projects";
import { createTopLevelMetadata } from "@/lib/site";

const description = "동시성·이벤트 복구·메시지 재연결을 단계별로 재생합니다.";
const socialDescription = "시스템의 실패와 복구를 단계별로 재생합니다.";

export const metadata: Metadata = {
  title: "Flows",
  description,
  ...createTopLevelMetadata({
    title: "Flows",
    description: socialDescription,
    path: "/flows",
  }),
};

export default function FlowsPage() {
  return (
    <>
      <header className="inner-hero flow-index-hero page-shell">
        <p className="eyebrow">Interactive flows</p>
        <h1>
          시스템의 순간을
          <br />
          재생합니다.
        </h1>
        <p>
          노드가 움직이는 장식 대신, 각 단계에서 어떤 상태가 바뀌고 왜 다음
          단계로 넘어가는지 직접 따라갈 수 있습니다.
        </p>
      </header>
      <section className="page-shell flow-index" aria-label="흐름 재생 목록">
        {flows.map((flow, index) => {
          const project = getProject(flow.projectSlug);
          return (
            <Link
              key={flow.slug}
              href={`/flows/${flow.slug}?variant=${flow.initialVariant}&step=1`}
              prefetch={false}
            >
              <div className="flow-index-number">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Play aria-hidden="true" />
              </div>
              <p>{project?.title}</p>
              <h2>{flow.title}</h2>
              <small>{flow.summary}</small>
              <div className="flow-index-steps">
                {flow.variants
                  .find((variant) => variant.id === flow.initialVariant)
                  ?.steps.map((step) => (
                    <i key={step.id} />
                  ))}
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
}
