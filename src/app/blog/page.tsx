import type { Metadata } from "next";

import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { blogTopics } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Coming soon backend deep-dive blog topics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-12 md:px-8 md:py-16">
      <SectionHeader
        title="Writing Queue"
        description="아직 글이 공개되지 않았으므로 허위 링크를 만들지 않고, 면접 질문을 유도할 예정 주제만 보여줍니다."
      />
      <div className="grid gap-4">
        {blogTopics.map((topic) => (
          <article
            key={topic.title}
            className="border-border flex flex-col gap-4 border p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <topic.icon aria-hidden="true" />
              <Badge variant="outline" className="rounded-md">
                Coming soon
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
    </div>
  );
}
