import { ExternalLink, Mail } from "lucide-react";

import { ExpertiseMap } from "@/components/expertise-map";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "연락처",
  description: "성진혁 Java/Spring 백엔드 포트폴리오 연락처와 관심 문제.",
  path: "/about",
});

const focusAreas = [
  "동시성 제어와 데이터 정합성",
  "이벤트 발행 실패와 재처리 경계",
  "실시간 메시징 구독 인가와 재연결 복구",
  "사용량·Webhook·Ledger 중복 처리",
] as const;

export default function AboutPage() {
  return (
    <div className="page-shell py-10 md:py-16">
      <SectionHeader
        as="h1"
        eyebrow="About / Contact"
        title="문제를 재현하고, 선택의 근거를 설명하는 백엔드 개발자"
        description={profile.summary}
      />

      <div className="border-border mt-12 grid gap-10 border-y py-8 md:grid-cols-[1fr_1fr] md:gap-14 md:py-10">
        <section aria-labelledby="focus-title">
          <h2 id="focus-title" className="text-foreground text-xl font-bold">
            관심 문제
          </h2>
          <ul className="mt-5 grid gap-3">
            {focusAreas.map((area, index) => (
              <li
                key={area}
                className="grid grid-cols-[2.5rem_1fr] gap-3 text-sm leading-6"
              >
                <span className="text-primary font-mono text-xs font-semibold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-foreground">{area}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="position-title">
          <h2 id="position-title" className="text-foreground text-xl font-bold">
            관심 포지션
          </h2>
          <p className="text-muted-foreground mt-5 text-base leading-7">
            Java/Spring 백엔드와 예약·커머스·결제·정산·플랫폼 메시징 도메인에서,
            장애 이후에도 설명 가능한 데이터 경계를 만드는 일에 관심이 있습니다.
          </p>
        </section>
      </div>

      <section className="mt-14">
        <ExpertiseMap />
      </section>

      <section className="border-border mt-14 flex flex-col gap-6 border-t pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">Let&apos;s talk</p>
          <h2 className="text-foreground mt-2 text-2xl font-bold tracking-tight">
            사례의 전제와 트레이드오프를 더 자세히 설명드리겠습니다.
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a href={`mailto:${profile.email}`}>
              이메일
              <Mail aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub (새 창)"
            >
              GitHub
              <ExternalLink aria-hidden="true" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
