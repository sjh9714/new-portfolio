import type { LucideIcon } from "lucide-react";
import { Cable, DatabaseZap, RotateCcw } from "lucide-react";

export type BlogTopic = {
  title: string;
  summary: string;
  status: "coming-soon" | "published";
  url?: string;
  icon: LucideIcon;
};

export const blogTopics: BlogTopic[] = [
  {
    title:
      "Redis를 캐시로만 쓰지 않기 위해 구현한 대기열, 분산 락, Rate Limit, Presence, Reconciliation",
    summary:
      "Concert Booking의 Sorted Set queue, Realtime Chat의 presence, Redis를 최종 진실로 두지 않은 이유를 연결합니다.",
    status: "coming-soon",
    icon: DatabaseZap,
  },
  {
    title:
      "중복 요청은 버그가 아니라 정상 입력이다: 예매, 결제, 사용량 과금에서 Idempotency-Key를 다룬 방식",
    summary:
      "예약/결제/usage/webhook 중복 입력을 request hash와 idempotency key로 흡수한 방식을 정리합니다.",
    status: "coming-soon",
    icon: RotateCcw,
  },
  {
    title:
      "DB commit 이후 Kafka publish 실패를 어떻게 줄였나: Outbox, DLT, Replay, Consumer Idempotency",
    summary:
      "Outbox가 exactly-once가 아닌 이유, consumer idempotency, DEAD 상태와 manual replay 기준을 다룹니다.",
    status: "coming-soon",
    icon: Cable,
  },
];

export const publishedBlogTopics = blogTopics.filter(
  (topic) => topic.status === "published",
);
