import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { SectionHeader } from "@/components/section-header";
import { comingSoonBlogTopics, publishedBlogTopics } from "@/content/blog";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "기술 글",
  description: "대표 사례에서 반복된 백엔드 설계 판단을 정리한 기술 글.",
  path: "/blog",
  noIndex: publishedBlogTopics.length === 0,
});

export default function BlogPage() {
  return (
    <div className="page-shell py-10 md:py-16">
      <SectionHeader
        as="h1"
        eyebrow="Writing"
        title="사례 사이에 반복되는 설계 판단"
        description="프로젝트별 구현 나열보다, 여러 도메인에서 다시 사용한 경계와 복구 원칙을 글로 정리합니다."
      />

      <section aria-labelledby="published-title" className="mt-12">
        <h2 id="published-title" className="sr-only">
          공개한 글
        </h2>
        <div className="border-border border-t">
          {publishedBlogTopics.map((topic, index) => (
            <article
              key={topic.slug}
              className="project-band border-border grid gap-5 border-b py-7 md:grid-cols-[3rem_1fr_auto] md:items-center md:gap-8"
            >
              <span className="text-primary font-mono text-xs font-semibold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-muted-foreground font-mono text-[0.7rem] font-semibold tracking-[0.1em] uppercase">
                  {topic.publishedAt} / {topic.readingTime}
                </p>
                <h2 className="text-foreground mt-2 text-xl leading-8 font-bold tracking-tight md:text-2xl">
                  <Link
                    href={`/blog/${topic.slug}`}
                    prefetch={false}
                    className="hover:text-primary"
                  >
                    {topic.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-6">
                  {topic.summary}
                </p>
              </div>
              <Link
                href={`/blog/${topic.slug}`}
                prefetch={false}
                className="text-primary flex min-h-11 items-center text-sm font-semibold hover:underline"
              >
                읽기
                <ArrowRight className="ml-1 size-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {comingSoonBlogTopics.length > 0 ? (
        <details className="group border-border mt-12 border-t">
          <summary className="text-foreground flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:hidden">
            다음에 다룰 주제
            <span
              aria-hidden="true"
              className="text-primary font-mono text-xl transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <ul className="border-border border-t">
            {comingSoonBlogTopics.map((topic) => (
              <li
                key={topic.slug}
                className="border-border grid gap-1 border-b py-4"
              >
                <p className="text-foreground font-semibold">{topic.title}</p>
                <p className="text-muted-foreground text-sm leading-6">
                  {topic.summary}
                </p>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
