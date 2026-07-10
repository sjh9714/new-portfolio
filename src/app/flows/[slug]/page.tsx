import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { FlowPlayer } from "@/components/flow-player";
import { SourceList } from "@/components/source-list";
import { flows, getFlow } from "@/content/flows";
import { getProject } from "@/content/projects";

export function generateStaticParams() {
  return flows.map((flow) => ({ slug: flow.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const flow = getFlow(slug);
  if (!flow) return {};
  const path = `/flows/${flow.slug}`;
  return {
    title: flow.title,
    description: flow.summary,
    alternates: { canonical: path },
    openGraph: { title: flow.title, description: flow.summary, url: path },
    twitter: {
      card: "summary_large_image",
      title: flow.title,
      description: flow.summary,
    },
  };
}

export default async function FlowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const flow = getFlow(slug);
  if (!flow) notFound();
  const project = getProject(flow.projectSlug);
  if (!project) notFound();
  const sourceIds = [
    ...new Set(
      flow.variants.flatMap((variant) =>
        variant.steps.flatMap((step) => step.sourceIds),
      ),
    ),
  ];
  return (
    <article className="flow-detail page-shell">
      <header className="flow-detail-header">
        <Breadcrumbs
          items={[
            { label: "Flows", href: "/flows" },
            { label: project.title, href: `/projects/${project.slug}` },
            { label: flow.title },
          ]}
        />
        <p className="eyebrow">{project.title} / Interactive flow</p>
        <h1>{flow.title}</h1>
        <p>{flow.summary}</p>
      </header>
      <Suspense
        fallback={<div className="flow-loading">Flow를 준비하고 있습니다.</div>}
      >
        <FlowPlayer flow={flow} />
      </Suspense>
      <section className="flow-sources">
        <div>
          <p className="eyebrow">Source-backed</p>
          <h2>각 단계의 근거</h2>
          <p>
            재생에 쓰인 상태와 전이는 공개 테스트·코드 범위를 넘지 않습니다.
          </p>
        </div>
        <SourceList sourceIds={sourceIds} />
      </section>
      <div className="back-row">
        <Link className="text-link" href="/flows" prefetch={false}>
          <ArrowLeft aria-hidden="true" size={18} /> 모든 Flow
        </Link>
      </div>
    </article>
  );
}
