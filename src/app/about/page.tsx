import type { Metadata } from "next";

import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/content/projects";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "연락처",
  description: "성진혁 백엔드 포트폴리오 연락처와 관심 문제.",
};

export default function AboutPage() {
  const representativeEvidence = [
    {
      project: "Concert Booking",
      evidence: getProjectBySlug("concert-booking")?.evidence.find(
        (item) => item.label === "동일 좌석 경합",
      ),
    },
    {
      project: "Realtime Chat",
      evidence: getProjectBySlug("realtime-chat")?.evidence.find(
        (item) => item.label === "채팅방 조회 API RPS",
      ),
    },
    {
      project: "AI Usage Billing Gateway",
      evidence: getProjectBySlug("ai-usage-billing-gateway")?.evidence.find(
        (item) => item.label === "사용량 중복 처리",
      ),
    },
  ].filter((item) => item.evidence);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-5 py-12 md:px-8 md:py-16">
      <SectionHeader title="연락처" description={profile.summary} />
      <div className="grid gap-5 md:grid-cols-2">
        <section className="border-border flex flex-col gap-3 border p-5">
          <h2 className="text-foreground text-lg font-semibold">관심 문제</h2>
          <p className="text-muted-foreground text-sm leading-7">
            Java/Spring 기반으로 동시성, 이벤트 정합성, 실시간 메시징, 과금/정산
            흐름을 테스트와 수치로 설명하는 백엔드 포트폴리오입니다.
          </p>
          <ul className="text-muted-foreground flex flex-col gap-2 text-sm leading-6">
            <li>동시성 제어와 데이터 정합성</li>
            <li>이벤트 기반 장애 복구</li>
            <li>실시간 메시징과 reconnect 복구</li>
            <li>과금/정산/감사 로그</li>
          </ul>
        </section>
        <section className="border-border flex flex-col gap-3 border p-5">
          <h2 className="text-foreground text-lg font-semibold">관심 포지션</h2>
          <p className="text-muted-foreground text-sm leading-7">
            Java/Spring 백엔드, 커머스/예약/결제/정산 도메인, 플랫폼/메시징
            백엔드 포지션에 관심이 있습니다.
          </p>
        </section>
      </div>

      <section className="border-border flex flex-col gap-4 border p-5">
        <h2 className="text-foreground text-lg font-semibold">대표 근거</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {representativeEvidence.map((item) =>
            item.evidence ? (
              <div
                key={item.project}
                className="border-border bg-card flex flex-col gap-2 rounded-md border p-3"
              >
                <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
                  {item.project}
                </p>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-foreground text-sm font-semibold [overflow-wrap:anywhere]">
                    {item.evidence.label}
                  </h3>
                  <StatusBadge status={item.evidence.status} />
                </div>
                <p className="text-muted-foreground text-xs leading-5 [overflow-wrap:anywhere]">
                  {item.evidence.value}
                </p>
              </div>
            ) : null,
          )}
        </div>
      </section>

      <section className="border-border flex flex-col gap-3 border p-5">
        <h2 className="text-foreground text-lg font-semibold">링크</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <a href={profile.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={`mailto:${profile.email}`}>이메일</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
