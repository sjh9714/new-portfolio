import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyArticle } from "@/components/case-study-article";
import { featuredProjects, getProjectBySlug } from "@/content/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.category !== "featured") {
    return {
      title: "문제 해결 사례",
    };
  }

  return {
    title: project.title,
    description: project.result,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.category !== "featured") {
    notFound();
  }

  const mdxSource = await readFile(
    path.join(process.cwd(), "src", "content", "case-studies", `${slug}.mdx`),
    "utf8",
  );

  return <CaseStudyArticle project={project} mdxSource={mdxSource} />;
}
