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
      <section className="border-border border-b">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-12 md:px-8 md:py-20">
          <div className="flex max-w-4xl flex-col gap-6">
            <h1 className="text-foreground text-5xl font-bold tracking-tight md:text-7xl">
              Backend Engineer
            </h1>
            <p className="text-muted-foreground max-w-3xl text-xl leading-9">
              {profile.headline}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/resume">
                  <BookOpen data-icon="inline-start" aria-hidden="true" />
                  Web Resume
                </Link>
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
              <Button asChild variant="outline">
                <a href={`mailto:${profile.email}`}>
                  <Mail data-icon="inline-start" aria-hidden="true" />
                  Email
                </a>
              </Button>
            </div>
          </div>

          <div className="border-border grid border md:grid-cols-4">
            {proofItems.map((item) => (
              <div
                key={item.title}
                className="border-border flex gap-4 border-b p-5 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
              >
                <span className="border-border bg-card flex size-11 shrink-0 items-center justify-center rounded-md border">
                  <item.icon aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-foreground text-sm font-semibold [overflow-wrap:anywhere]">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-6">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-12 md:px-8 md:py-16">
        <section className="border-border bg-border grid gap-px overflow-hidden border md:grid-cols-4">
          {focusCards.map((card) => (
            <FocusCard key={card.title} {...card} />
          ))}
        </section>

        <section className="flex flex-col gap-6">
          <SectionHeader
            title="Featured Case Studies"
            description="면접 질문을 유도할 4개 문제 해결 사례를 먼저 읽히도록 구성했습니다."
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
            description="대표 사례를 보완하는 팀 협업, 제품 구현, 캐싱, AI 서비스 경험을 짧게 정리합니다."
            action={
              <Button asChild variant="ghost">
                <Link href="/projects">모든 프로젝트 보기</Link>
              </Button>
            }
          />
          <div className="border-border border-y">
            {additionalProjects.map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <section className="border-border bg-card flex flex-col gap-6 border p-6">
          <SectionHeader
            title="Writing Queue"
            description="Redis, Idempotency, Outbox 주제를 프로젝트 근거와 연결해 깊게 정리할 예정입니다."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {blogTopics.map((topic) => (
              <article
                key={topic.title}
                className="border-border flex flex-col gap-3 border p-4"
              >
                <topic.icon aria-hidden="true" />
                <h3 className="text-foreground leading-6 font-semibold">
                  {topic.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-6">
                  {topic.summary}
                </p>
                <span className="text-primary mt-auto text-xs font-semibold tracking-[0.16em] uppercase">
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
