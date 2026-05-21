import {
  BarChart3,
  BookOpen,
  Boxes,
  Database,
  ExternalLink,
  LockKeyhole,
  Mail,
  MessageSquare,
  ShieldCheck,
  TicketCheck,
} from "lucide-react";
import Link from "next/link";

import { EvidenceMatrix } from "@/components/evidence-matrix";
import { FocusCard } from "@/components/focus-card";
import { ProjectCard, ProjectRow } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { additionalProjects, featuredProjects } from "@/content/projects";
import { blogTopics } from "@/content/blog";
import { profile } from "@/content/profile";

const focusCards = [
  {
    title: "Concurrency & Consistency",
    icon: LockKeyhole,
    items: [
      "동시성 제어(락, 낙관적 락, 버전)",
      "중복 요청 방지(Idempotency)",
      "정합성 보장(트랜잭션 경계)",
      "잔여/좌석/재고 일관성 유지",
    ],
  },
  {
    title: "Event-driven Architecture",
    icon: Boxes,
    items: [
      "도메인 이벤트 설계",
      "Outbox 패턴과 이벤트 발행",
      "Kafka/RabbitMQ 기반 비동기 처리",
      "DLT 기반 장애 격리",
    ],
  },
  {
    title: "Realtime Messaging",
    icon: MessageSquare,
    items: [
      "WebSocket + STOMP",
      "Presence와 reconnect sync",
      "Redis Pub/Sub / Streams",
      "메시지 순서와 유실 최소화",
    ],
  },
  {
    title: "Billing & Tenant Security",
    icon: ShieldCheck,
    items: [
      "사용량 수집과 과금 집계",
      "멀티테넌트 데이터 격리",
      "API Key hash 저장",
      "정산/환불/조정 흐름",
    ],
  },
];

const proofItems = [
  {
    title: "k6 부하 테스트",
    description: "시나리오 기반 부하 검증, 임계점 탐색 및 회귀 방지",
    icon: BarChart3,
  },
  {
    title: "Testcontainers 통합 테스트",
    description: "실제 의존성 환경 기반 재현 가능한 통합 테스트",
    icon: Boxes,
  },
  {
    title: "Redis/Kafka/PostgreSQL 정합성",
    description: "트랜잭션 경계와 메시지 정합성 지표/로그 지속 검증",
    icon: Database,
  },
  {
    title: "Outbox / DLT / Idempotency",
    description: "실패를 전제로 설계하고 복구 가능성을 확보",
    icon: TicketCheck,
  },
];

export default function Home() {
  return (
    <div className="bg-background">
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-12 md:px-8 md:py-20">
          <div className="flex max-w-4xl flex-col gap-6">
            <h1 className="text-5xl font-bold tracking-tight text-foreground md:text-7xl">
              Backend Engineer
            </h1>
            <p className="max-w-3xl text-xl leading-9 text-muted-foreground">
              {profile.headline}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button disabled aria-label="이력서 PDF는 아직 준비 중입니다">
                <BookOpen data-icon="inline-start" aria-hidden="true" />
                이력서 PDF
              </Button>
              <Button asChild variant="outline">
                <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                  <ExternalLink data-icon="inline-start" aria-hidden="true" />
                  GitHub
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/case-studies/concert-booking">Case Studies</Link>
              </Button>
              <Button disabled variant="outline" aria-label="Email is not configured">
                <Mail data-icon="inline-start" aria-hidden="true" />
                Email
              </Button>
            </div>
          </div>

          <div className="grid border border-border md:grid-cols-4">
            {proofItems.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 border-b border-border p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-card">
                  <item.icon aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-sm font-semibold text-foreground [overflow-wrap:anywhere]">
                    {item.title}
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-12 md:px-8 md:py-16">
        <section className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-4">
          {focusCards.map((card) => (
            <FocusCard key={card.title} {...card} />
          ))}
        </section>

        <section className="flex flex-col gap-6">
          <SectionHeader
            title="Featured Case Studies"
            description="9개 프로젝트를 전시장처럼 늘어놓지 않고, 면접 질문을 유도할 4개 문제 해결 사례만 깊게 보여줍니다."
            action={
              <Button asChild variant="ghost">
                <Link href="/projects">전체 프로젝트 보기</Link>
              </Button>
            }
          />
          <div className="grid gap-4 lg:grid-cols-4">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} compact />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <SectionHeader
            title="Evidence Matrix"
            description="측정한 수치, 재현 가능한 검증, 아직 채워야 하는 항목을 같은 색으로 뭉개지 않습니다."
          />
          <EvidenceMatrix />
        </section>

        <section className="flex flex-col gap-5">
          <SectionHeader
            title="Additional Projects"
            description="메인 주제와 겹치거나 보조 서사가 강한 프로젝트는 짧게 정리합니다."
            action={
              <Button asChild variant="ghost">
                <Link href="/projects">모든 프로젝트 보기</Link>
              </Button>
            }
          />
          <div className="border-y border-border">
            {additionalProjects.map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6 border border-border bg-card p-6">
          <SectionHeader
            title="Blog Weapon"
            description="블로그는 양보다 한 번 클릭했을 때 기대를 충족하는 깊이로 준비합니다. 아직 공개 링크가 없으므로 Coming soon으로만 표시합니다."
            action={
              <Button asChild variant="outline">
                <Link href="/blog">Blog Topics</Link>
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            {blogTopics.map((topic) => (
              <article key={topic.title} className="flex flex-col gap-3 border border-border p-4">
                <topic.icon aria-hidden="true" />
                <h3 className="font-semibold leading-6 text-foreground">
                  {topic.title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {topic.summary}
                </p>
                <span className="mt-auto text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Coming soon
                </span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
