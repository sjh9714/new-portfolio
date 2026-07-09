import type { LucideIcon } from "lucide-react";
import { Cable, DatabaseZap, RotateCcw } from "lucide-react";

export type BlogTopic = {
  slug: string;
  title: string;
  summary: string;
  icon: LucideIcon;
} & (
  | {
      status: "published";
      publishedAt: string;
      readingTime: string;
      sections: {
        title: string;
        paragraphs: string[];
      }[];
    }
  | {
      status: "coming-soon";
    }
);

export const blogTopics: BlogTopic[] = [
  {
    slug: "redis-queue-lock-presence-reconciliation",
    title:
      "Redis를 캐시로만 쓰지 않기 위해 구현한 대기열, 분산 락, Presence, 정합성 복구",
    summary:
      "Concert Booking의 queue/stock, Realtime Chat의 presence, TimeDeal의 캐시, PostgreSQL 기준 reconciliation을 한 문서로 연결합니다.",
    status: "published",
    publishedAt: "2026-05-23",
    readingTime: "약 7분",
    sections: [
      {
        title: "핵심 관점",
        paragraphs: [
          "Redis는 빠른 상태 조회와 경합 완화에는 강하지만, 장애 이후 무엇이 맞는 상태인지 설명해야 하는 순간에는 최종 기준 데이터가 되기 어렵습니다. 그래서 이 포트폴리오에서는 Redis를 캐시, 대기열, presence, reconciliation 대상으로 쓰되 최종 기준 데이터는 PostgreSQL과 도메인 DB에 둡니다.",
          "이 글은 Redis를 많이 썼다는 주장이 아니라, Redis가 맡은 역할과 맡기지 않은 역할을 분리한 기록입니다. 수치가 있는 항목은 각 프로젝트의 evidence로 남기고, 운영 성능 주장은 별도로 하지 않습니다.",
        ],
      },
      {
        title: "Concert Booking: 대기열과 좌석 경합",
        paragraphs: [
          "Concert Booking에서는 Redis가 대기열 token과 빠른 stock 조회를 돕지만, 좌석과 예약의 최종 기준 데이터는 PostgreSQL에 둡니다. 동일 좌석 Testcontainers 시나리오에서는 10개 thread를 동시에 시작해 성공 1건, 실패 9건, HELD 좌석 1건으로 수렴하는지 검증했습니다.",
          "대기열 진입 권한, 좌석 변경의 직렬화, client retry 중복을 한 장치에 몰지 않았습니다. Queue Token, DB lock, Idempotency-Key가 각각 다른 경쟁 조건을 책임지며 세 예약 전략에 동일한 token policy test를 적용했습니다.",
          "Redis stock과 DB 상태가 어긋날 수 있다는 전제를 버리지 않았기 때문에 reconciliation은 Redis 값을 기준으로 DB를 고치는 방식이 아니라, PostgreSQL 기준으로 Redis 보조 상태를 복구하는 방향으로 설계했습니다.",
        ],
      },
      {
        title: "Realtime Chat: presence는 최종 상태가 아니다",
        paragraphs: [
          "Realtime Chat에서 Redis presence는 지금 연결되어 있을 가능성이 높은 사용자를 빠르게 표현하는 ephemeral state입니다. heartbeat와 TTL이 어긋나면 실제 접속 상태와 다를 수 있으므로, 메시지 복구는 Redis presence가 아니라 Message DB와 reconnect sync API 기준으로 처리합니다.",
          "WebSocket receiver matrix evidence도 presence 자체를 delivery completeness로 착각하지 않기 위해 분리했습니다. ACK, persisted message id, receiver delivery는 서로 다른 관찰 지점입니다.",
        ],
      },
      {
        title: "TimeDeal과 AI Billing에서의 경계",
        paragraphs: [
          "TimeDeal Service에서는 Redis/Caffeine 캐시와 Resilience4j를 commerce resilience 관점으로 정리했습니다. 캐시는 응답 속도와 장애 전파 완화에 도움이 되지만, 가격·주문·재고의 최종 판정은 도메인 저장소와 트랜잭션 경계에서 설명되어야 합니다.",
          "AI Usage Billing Gateway는 Redis 사례라기보다 같은 원칙의 반대편에 있는 기준점입니다. 과금의 최종 설명은 Usage Event, Invoice, Append-only Ledger, Audit Log가 담당하고, webhook 재전송이나 duplicate usage는 캐시로 숨길 문제가 아니라 idempotency와 ledger invariant로 드러내야 하는 입력입니다.",
        ],
      },
      {
        title: "면접에서 설명할 문장",
        paragraphs: [
          "Redis는 빠른 판단을 돕는 도구로 쓰고, 장애 후 복구 기준은 도메인 DB와 ledger에 둡니다. 그래서 대기열, presence, cache, stock 같은 Redis 상태는 모두 유용하지만, 최종 기준 데이터와 reconciliation 방향을 먼저 정해두지 않으면 장애 상황에서 무엇을 고쳐야 하는지 설명하기 어렵습니다.",
        ],
      },
    ],
    icon: DatabaseZap,
  },
  {
    slug: "idempotency-key-normal-input",
    title:
      "중복 요청은 버그가 아니라 정상 입력이다: 예매, 결제, 사용량 과금에서 Idempotency-Key를 다룬 방식",
    summary:
      "예약/결제/usage/webhook 중복 입력을 request hash와 idempotency key로 흡수한 방식을 정리합니다.",
    status: "coming-soon",
    icon: RotateCcw,
  },
  {
    slug: "outbox-dlt-replay-idempotency",
    title:
      "DB commit 이후 Kafka publish 실패를 어떻게 줄였나: Outbox, DLT, Replay, Consumer Idempotency",
    summary:
      "Outbox가 exactly-once가 아닌 이유, consumer idempotency, DEAD 상태와 manual replay 기준을 다룹니다.",
    status: "coming-soon",
    icon: Cable,
  },
];

export const publishedBlogTopics = blogTopics.filter(
  (topic): topic is Extract<BlogTopic, { status: "published" }> =>
    topic.status === "published",
);

export const comingSoonBlogTopics = blogTopics.filter(
  (topic): topic is Extract<BlogTopic, { status: "coming-soon" }> =>
    topic.status === "coming-soon",
);

export function getBlogTopicBySlug(slug: string) {
  return blogTopics.find((topic) => topic.slug === slug);
}
