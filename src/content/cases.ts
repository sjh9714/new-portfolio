import type { EngineeringCase } from "./types";

export const engineeringCases = [
  {
    slug: "concert-seat-contention",
    projectSlug: "concert-booking",
    title: "같은 좌석을 누른 두 사람에게 다음 행동까지 돌려주기",
    summary:
      "대기열 입장, 동일 요청 재시도, 좌석 상태 변경을 한 장치에 몰지 않고 각각의 경계가 책임지게 했습니다.",
    userImpact:
      "한 사용자가 좌석을 먼저 확정해도 다른 사용자는 모호한 실패 화면이 아니라 최신 좌석표로 돌아가 다시 선택할 수 있어야 합니다.",
    failureMode: [
      "두 요청이 같은 AVAILABLE 상태를 읽으면 예약이 두 건 생성될 수 있습니다.",
      "입장 토큰 응답을 잃은 재시도가 이미 queue에서 제거된 사용자를 복구하지 못할 수 있습니다.",
      "동일 버튼의 중복 클릭이 새로운 예약 의도로 처리될 수 있습니다.",
    ],
    constraints: [
      "Queue Token은 일정과 사용자에 묶여야 합니다.",
      "좌석의 최종 기준은 Redis가 아니라 DB transaction입니다.",
      "같은 key의 다른 payload는 정상 재시도가 아니라 conflict입니다.",
    ],
    decisions: [
      "Redis Lua에서 기존 token 확인·rank 검증·token 저장·queue 제거를 한 번에 처리합니다.",
      "DB lock과 unique constraint가 최종 좌석 변경을 한 건으로 수렴시킵니다.",
      "클라이언트는 예약 의도 하나에 같은 Idempotency-Key를 유지합니다.",
    ],
    tradeoffs: [
      "DB를 최종 기준으로 두어 write 경합 비용을 감수하지만 복구 기준이 명확합니다.",
      "Queue와 reservation의 책임이 나뉘어 상태가 늘지만 실패 원인을 구분할 수 있습니다.",
    ],
    verification: [
      "동일 좌석 10개 동시 요청이 성공 1건으로 수렴합니다.",
      "동일 key replay는 기존 예약을 반환하고 Queue Token 응답 유실 뒤 재발급도 같은 token으로 복구됩니다.",
      "브라우저 E2E에서 패자는 최신 좌석표로 돌아갑니다.",
    ],
    sourceIds: [
      "concert-seat-contention-test",
      "concert-idempotency-test",
      "concert-queue-token-test",
      "concert-product-journey-e2e",
    ],
    diagramId: "concert-seat-contention",
    flowSlugs: ["concert-seat-contention"],
    limitations: [
      "공개 검증은 로컬 Testcontainers와 브라우저 E2E 범위입니다.",
      "세 가지 lock 전략의 production 처리량 비교를 주장하지 않습니다.",
    ],
  },
  {
    slug: "concert-event-recovery",
    projectSlug: "concert-booking",
    title: "commit 이후의 실패를 사라진 사건으로 만들지 않기",
    summary:
      "Outbox는 발행 실패를 DB에 남기고, DLT는 처리 실패를 정상 흐름에서 격리해 다시 시작할 위치를 제공합니다.",
    userImpact:
      "예약 취소가 완료됐다는 응답 뒤에도 좌석 반환 이벤트가 사라지면 다른 사용자는 계속 좌석을 선택할 수 없습니다.",
    failureMode: [
      "DB commit 직후 process가 종료되면 Kafka 발행 여부를 알 수 없습니다.",
      "poison message를 무한 재시도하면 정상 이벤트도 함께 막힙니다.",
    ],
    constraints: [
      "도메인 변경과 이벤트 기록 사이에 틈이 없어야 합니다.",
      "중복 replay는 허용하되 좌석 재고가 두 번 늘면 안 됩니다.",
    ],
    decisions: [
      "도메인 변경과 Outbox insert를 같은 transaction에 묶습니다.",
      "relay가 실패 횟수와 다음 시각을 기록하고 terminal DEAD 상태를 구분합니다.",
      "consumer 실패는 DLT에 격리하고 원인을 확인한 뒤 replay합니다.",
    ],
    tradeoffs: [
      "즉시 일관성 대신 eventual release를 받아들이고 UI에 반영 중 상태를 표시합니다.",
      "운영 상태가 늘지만 실패를 관찰하고 수동 복구할 수 있습니다.",
    ],
    verification: [
      "강제 Kafka 실패 뒤 FAILED로 남고 다음 retry에서 PUBLISHED가 됩니다.",
      "DLT replay를 두 번 실행해도 좌석 반환은 한 번만 반영됩니다.",
      "브라우저 E2E에서 취소와 만료 뒤 좌석이 AVAILABLE로 돌아옵니다.",
    ],
    sourceIds: [
      "concert-outbox-test",
      "concert-dlt-test",
      "concert-seat-release-e2e",
    ],
    diagramId: "concert-event-recovery",
    flowSlugs: ["concert-event-recovery"],
    limitations: [
      "exactly-once를 주장하지 않고 중복을 흡수할 상태와 키를 제공합니다.",
      "장시간 broker 장애의 운영 복구 시간을 측정하지 않았습니다.",
    ],
  },
  {
    slug: "realtime-message-lifecycle",
    projectSlug: "realtime-chat",
    title: "상대가 본 메시지는 먼저 저장돼 있어야 한다",
    summary:
      "accepted와 persisted를 구분하고 DB commit 뒤에만 broadcast해 실시간 화면과 복구 가능한 기록을 같은 순서로 맞췄습니다.",
    userImpact:
      "상대 화면에는 도착했지만 새로고침하면 사라지는 메시지는 연결 성공보다 더 나쁜 경험입니다.",
    failureMode: [
      "persistence와 broadcast consumer가 독립이면 DB 실패보다 broadcast가 먼저 끝날 수 있습니다.",
      "연결이 끊긴 동안의 메시지는 WebSocket만으로 복구할 수 없습니다.",
      "실시간 payload에 DB ID가 없으면 history와 중복 없이 합치기 어렵습니다.",
    ],
    constraints: [
      "같은 room의 저장 순서를 진단할 수 있어야 합니다.",
      "Redis publish 실패는 성공으로 삼키지 않아야 합니다.",
      "비멤버는 CONNECT 이후 SUBSCRIBE에서도 차단돼야 합니다.",
    ],
    decisions: [
      "Kafka consumer가 persistence service commit을 마친 뒤 Redis에 publish합니다.",
      "clientMessageId는 optimistic row를, DB ID는 persisted message dedupe를 맡습니다.",
      "재연결 시 마지막 DB ID 이후를 sync API로 반복 조회합니다.",
    ],
    tradeoffs: [
      "DB commit 뒤 broadcast라 실시간 지연이 조금 늘 수 있지만 phantom delivery를 제거합니다.",
      "at-least-once redelivery를 받아들이고 저장·수신 양쪽에서 dedupe합니다.",
    ],
    verification: [
      "DB 실패를 주입한 동안 receiver에는 노출되지 않고, 재시도 뒤 DB와 수신이 한 건으로 수렴합니다.",
      "Redis publish 실패 뒤 기존 DB ID로 재전달돼 저장과 수신이 모두 한 건으로 유지됩니다.",
      "재연결 sync가 누락 메시지를 보충하고 비멤버 REST·STOMP 접근은 거부됩니다.",
    ],
    sourceIds: [
      "realtime-lifecycle-refactor-commit",
      "realtime-subscribe-auth-test",
      "realtime-ordering-test",
      "realtime-sync-api-test",
      "realtime-client-state-test",
      "realtime-persistence-boundary-test",
      "realtime-redelivery-test",
      "realtime-persisted-ack-test",
      "realtime-lifecycle-e2e",
    ],
    diagramId: "realtime-message-lifecycle",
    flowSlugs: ["realtime-message-lifecycle"],
    limitations: [
      "읽음 receipt broadcast는 이번 범위에 포함하지 않습니다.",
      "전역 순서가 아니라 room 단위 순서와 재연결 경계를 다룹니다.",
    ],
  },
  {
    slug: "borrowme-return-and-harden",
    projectSlug: "borrow-me",
    title: "팀 시연이 끝난 코드를 다시 검증 가능한 상태로 만들기",
    summary:
      "과거 개선 수치를 되풀이하지 않고 현재 코드가 지켜야 할 조회 SQL 상한과 재고 불변식을 테스트로 남겼습니다.",
    userImpact:
      "상품이 늘수록 목록이 느려지거나 동시에 예약한 수보다 재고가 더 많이 줄면 대여 서비스의 기본 신뢰가 깨집니다.",
    failureMode: [
      "DTO 조립 중 연관 객체를 순회하면 상품 수만큼 SQL이 다시 늘 수 있습니다.",
      "재고를 읽고 감소시키는 사이에 다른 요청이 같은 수량을 읽을 수 있습니다.",
      "같은 취소가 겹치면 이미 반납한 수량이 다시 복원될 수 있습니다.",
    ],
    constraints: [
      "현재 저장소에서 반복 가능한 검증만 공개합니다.",
      "과거 팀 개발과 2026 개인 보강을 같은 기여 기간으로 합치지 않습니다.",
    ],
    decisions: [
      "상품·작성자·해시태그 fetch와 follow bulk lookup의 query 상한을 분리합니다.",
      "실제 MySQL 경계에서 동시 예약 성공 수와 남은 재고의 합을 확인합니다.",
      "예약과 상품 row를 잠그고 이미 취소된 요청은 재고를 다시 바꾸지 않게 합니다.",
    ],
    tradeoffs: [
      "화려한 개선 배수 대신 현재 지켜지는 상한만 말합니다.",
      "테스트 fixture가 운영 트래픽을 대신하지 않는다는 한계를 함께 공개합니다.",
    ],
    verification: [
      "상품 목록과 인증 응답의 SQL 상한을 Hibernate Statistics로 확인합니다.",
      "100명 동시 예약에서도 성공 수와 남은 재고의 합이 초기 재고와 같습니다.",
      "같은 취소를 20개 요청이 동시에 실행해도 재고는 한 번만 복원됩니다.",
    ],
    sourceIds: ["borrow-query-guard", "borrow-stock-invariant"],
    diagramId: "borrowme-return-and-harden",
    flowSlugs: [],
    limitations: [
      "현재 로컬 환경의 회귀 검증이며 production 성능을 뜻하지 않습니다.",
      "당시 서비스의 지속 운영을 주장하지 않습니다.",
    ],
  },
] as const satisfies readonly EngineeringCase[];

export function getCase(slug: string) {
  return engineeringCases.find((item) => item.slug === slug);
}

export function getCasesForProject(projectSlug: string) {
  return engineeringCases.filter((item) => item.projectSlug === projectSlug);
}
