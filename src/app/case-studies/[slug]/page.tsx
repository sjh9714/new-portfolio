import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CaseStudyArticle } from "@/components/case-study-article";
import {
  featuredPortfolioCases,
  getPortfolioCaseBySlug,
  legacyCaseStudyAliases,
} from "@/content/portfolio-cases";
import { getProjectBySlug } from "@/content/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return featuredPortfolioCases.map((portfolioCase) => ({
    slug: portfolioCase.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSlug = legacyCaseStudyAliases[slug] ?? slug;
  const portfolioCase = resolvedSlug.startsWith("/")
    ? undefined
    : getPortfolioCaseBySlug(resolvedSlug);

  if (!portfolioCase) {
    return {
      title: "문제 해결 사례",
    };
  }

  return {
    title: portfolioCase.displayTitle,
    description: portfolioCase.resumeLine,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const alias = legacyCaseStudyAliases[slug];

  if (alias?.startsWith("/")) {
    redirect(alias);
  }

  if (alias) {
    redirect(`/case-studies/${alias}`);
  }

  const portfolioCase = getPortfolioCaseBySlug(slug);

  if (!portfolioCase) {
    notFound();
  }

  const project = getProjectBySlug(portfolioCase.projectSlug);

  if (!project) {
    notFound();
  }

  return <CaseStudyArticle portfolioCase={portfolioCase} project={project} />;
}
