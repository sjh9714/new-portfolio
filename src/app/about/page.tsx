import type { Metadata } from "next";

import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "About",
  description: "Contact and profile summary for SJH backend portfolio.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-5 py-12 md:px-8 md:py-16">
      <SectionHeader title="About / Contact" description={profile.summary} />
      <div className="grid gap-5 md:grid-cols-2">
        <section className="flex flex-col gap-3 border border-border p-5">
          <h2 className="text-lg font-semibold text-foreground">Positioning</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Java/Spring 기반으로 동시성, 이벤트 정합성, 실시간 메시징, 과금/정산 흐름을 테스트와 수치로 설명하는 백엔드 포트폴리오입니다.
          </p>
        </section>
        <section className="flex flex-col gap-3 border border-border p-5">
          <h2 className="text-lg font-semibold text-foreground">Links</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
            <Button disabled variant="outline">
              Email 미설정
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
