import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { getBlogTopicBySlug, publishedBlogTopics } from "@/content/blog";
import { createPageMetadata } from "@/lib/site";

type BlogArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return publishedBlogTopics.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const topic = getBlogTopicBySlug(slug);

  if (!topic || topic.status !== "published") {
    return createPageMetadata({
      title: "기술 글",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: topic.title,
    description: topic.summary,
    path: `/blog/${topic.slug}`,
  });
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const topic = getBlogTopicBySlug(slug);

  if (!topic || topic.status !== "published") {
    notFound();
  }

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-10 md:px-8 md:py-16">
      <header className="border-border flex flex-col gap-4 border-b pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="rounded-md">
            기술 글
          </Badge>
          {topic.publishedAt ? (
            <span className="text-muted-foreground text-sm">
              {topic.publishedAt}
            </span>
          ) : null}
          {topic.readingTime ? (
            <span className="text-muted-foreground text-sm">
              {topic.readingTime}
            </span>
          ) : null}
        </div>
        <h1 className="heading-wrap text-foreground text-4xl leading-tight font-bold tracking-[-0.04em] md:text-5xl">
          {topic.title}
        </h1>
        <p className="text-muted-foreground text-lg leading-8">
          {topic.summary}
        </p>
      </header>

      <div className="flex flex-col gap-9">
        {topic.sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-3">
            <h2 className="text-foreground text-2xl font-semibold tracking-tight">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-muted-foreground text-base leading-8"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
