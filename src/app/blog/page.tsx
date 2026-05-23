import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { comingSoonBlogTopics, publishedBlogTopics } from "@/content/blog";

export const metadata: Metadata = {
  title: "글",
  description: "백엔드 문제 해결 사례를 더 깊게 풀어낸 기술 글.",
  ...(publishedBlogTopics.length === 0
    ? {
        robots: {
          index: false,
          follow: false,
        },
      }
    : {}),
};

export default function BlogPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-12 md:px-8 md:py-16">
      <SectionHeader
        title="기술 글"
        description="포트폴리오 대표 사례에서 반복되는 설계 판단을 글로 확장합니다."
      />

      <div className="grid gap-4">
        {publishedBlogTopics.map((topic) => (
          <article
            key={topic.slug}
            className="border-border flex flex-col gap-4 border p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <topic.icon aria-hidden="true" />
              <Badge variant="outline" className="rounded-md">
                공개
              </Badge>
            </div>
            <h2 className="text-foreground text-xl leading-7 font-semibold">
              <Link href={`/blog/${topic.slug}`}>{topic.title}</Link>
            </h2>
            <p className="text-muted-foreground text-sm leading-7">
              {topic.summary}
            </p>
            <p className="text-muted-foreground text-xs font-semibold">
              {[topic.publishedAt, topic.readingTime]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </article>
        ))}
      </div>

      {comingSoonBlogTopics.length > 0 ? (
        <section className="flex flex-col gap-4">
          <SectionHeader
            title="다음 글"
            description="아직 공개하지 않은 글은 링크를 만들지 않고 예정 주제로만 둡니다."
          />
          <div className="grid gap-4">
            {comingSoonBlogTopics.map((topic) => (
              <article
                key={topic.slug}
                className="border-border flex flex-col gap-4 border p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <topic.icon aria-hidden="true" />
                  <Badge variant="outline" className="rounded-md">
                    공개 예정
                  </Badge>
                </div>
                <h2 className="text-foreground text-xl leading-7 font-semibold">
                  {topic.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-7">
                  {topic.summary}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
