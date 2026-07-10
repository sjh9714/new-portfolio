import type { FlowActor, FlowPlayback } from "./types";

const concertActors: FlowActor[] = [
  {
    id: "guest-a",
    label: "Guest A",
    detail: "먼저 좌석을 누른 사용자",
    x: 8,
    y: 22,
    sourceIds: ["concert-seat-contention-test", "concert-product-journey-e2e"],
  },
  {
    id: "guest-b",
    label: "Guest B",
    detail: "같은 좌석을 누른 사용자",
    x: 8,
    y: 66,
    sourceIds: ["concert-seat-contention-test", "concert-product-journey-e2e"],
  },
  {
    id: "queue",
    label: "Queue",
    detail: "일정별 입장 권한",
    x: 36,
    y: 22,
    sourceIds: ["concert-queue-token-test", "concert-product-journey-e2e"],
  },
  {
    id: "booking",
    label: "Booking",
    detail: "멱등 요청과 좌석 transaction",
    x: 63,
    y: 44,
    sourceIds: [
      "concert-idempotency-test",
      "concert-seat-contention-test",
      "concert-product-journey-e2e",
    ],
  },
  {
    id: "db",
    label: "PostgreSQL",
    detail: "좌석의 최종 상태",
    x: 88,
    y: 44,
    sourceIds: ["concert-seat-contention-test"],
  },
];

const recoveryActors: FlowActor[] = [
  {
    id: "booking",
    label: "Booking",
    detail: "도메인 transaction",
    x: 8,
    y: 44,
    sourceIds: ["concert-outbox-test"],
  },
  {
    id: "outbox",
    label: "Outbox",
    detail: "발행할 사건",
    x: 30,
    y: 44,
    sourceIds: ["concert-outbox-test"],
  },
  {
    id: "relay",
    label: "Relay",
    detail: "retry와 backoff",
    x: 52,
    y: 24,
    sourceIds: ["concert-outbox-test"],
  },
  {
    id: "kafka",
    label: "Kafka",
    detail: "이벤트 전달",
    x: 73,
    y: 24,
    sourceIds: ["concert-outbox-test", "concert-dlt-test"],
  },
  {
    id: "consumer",
    label: "Consumer",
    detail: "좌석 반환",
    x: 92,
    y: 44,
    sourceIds: ["concert-dlt-test", "concert-seat-release-e2e"],
  },
  {
    id: "dlt",
    label: "DLT",
    detail: "처리 실패 격리",
    x: 73,
    y: 72,
    sourceIds: ["concert-dlt-test"],
  },
];

const realtimeActors: FlowActor[] = [
  {
    id: "sender",
    label: "Sender",
    detail: "optimistic message",
    x: 7,
    y: 45,
    sourceIds: [
      "realtime-client-state-test",
      "realtime-persisted-ack-test",
      "realtime-lifecycle-e2e",
    ],
  },
  {
    id: "kafka",
    label: "Kafka",
    detail: "room partition",
    x: 29,
    y: 45,
    sourceIds: [
      "realtime-ordering-test",
      "realtime-lifecycle-refactor-commit",
      "realtime-redelivery-test",
    ],
  },
  {
    id: "persistence",
    label: "Persistence",
    detail: "transaction boundary",
    x: 51,
    y: 45,
    sourceIds: [
      "realtime-lifecycle-refactor-commit",
      "realtime-persistence-boundary-test",
      "realtime-redelivery-test",
    ],
  },
  {
    id: "db",
    label: "Database",
    detail: "persisted message ID",
    x: 73,
    y: 22,
    sourceIds: ["realtime-persistence-boundary-test", "realtime-sync-api-test"],
  },
  {
    id: "receiver",
    label: "Receiver",
    detail: "live + reconnect",
    x: 93,
    y: 45,
    sourceIds: [
      "realtime-client-state-test",
      "realtime-lifecycle-e2e",
      "realtime-sync-api-test",
    ],
  },
  {
    id: "sync",
    label: "Sync API",
    detail: "afterMessageId",
    x: 73,
    y: 72,
    sourceIds: ["realtime-sync-api-test", "realtime-lifecycle-e2e"],
  },
];

const flowDrafts: readonly FlowPlayback[] = [
  {
    slug: "concert-seat-contention",
    projectSlug: "concert-booking",
    caseSlug: "concert-seat-contention",
    title: "두 사람이 같은 좌석을 눌렀을 때",
    summary:
      "입장 권한, 중복 요청, 좌석 변경을 분리해 한 명만 확정하고 다른 사용자를 다시 선택할 수 있게 합니다.",
    initialVariant: "designed",
    sourceIds: [
      "concert-queue-token-test",
      "concert-product-journey-e2e",
      "concert-seat-contention-test",
      "concert-idempotency-test",
    ],
    variants: [
      {
        id: "problem",
        label: "문제 흐름",
        actors: concertActors,
        edges: [
          {
            id: "a-booking",
            from: "guest-a",
            to: "booking",
            label: "reserve",
            sourceIds: ["concert-seat-contention-test"],
          },
          {
            id: "b-booking",
            from: "guest-b",
            to: "booking",
            label: "reserve",
            sourceIds: ["concert-seat-contention-test"],
          },
          {
            id: "booking-db",
            from: "booking",
            to: "db",
            label: "read → write",
            sourceIds: ["concert-seat-contention-test"],
          },
        ],
        steps: [
          {
            id: "select",
            title: "두 사용자가 같은 상태를 봅니다",
            narrative: "Guest A와 B가 모두 같은 좌석을 AVAILABLE로 읽습니다.",
            activeNodeIds: ["guest-a", "guest-b", "db"],
            activeEdgeIds: [],
            visibleState: { db: "selected seat · AVAILABLE" },
            sourceIds: [
              "concert-seat-contention-test",
              "concert-product-journey-e2e",
            ],
          },
          {
            id: "race",
            title: "조회 뒤 갱신이 겹칩니다",
            narrative:
              "한 transaction 경계가 없다면 두 요청이 모두 성공했다고 판단할 수 있습니다.",
            activeNodeIds: ["guest-a", "guest-b", "booking", "db"],
            activeEdgeIds: ["a-booking", "b-booking", "booking-db"],
            visibleState: { booking: "two winners?", db: "conflicting writes" },
            sourceIds: ["concert-seat-contention-test"],
          },
        ],
      },
      {
        id: "designed",
        label: "개선 흐름",
        actors: concertActors,
        edges: [
          {
            id: "a-queue",
            from: "guest-a",
            to: "queue",
            label: "enter",
            sourceIds: [
              "concert-queue-token-test",
              "concert-product-journey-e2e",
            ],
          },
          {
            id: "b-queue",
            from: "guest-b",
            to: "queue",
            label: "enter",
            sourceIds: [
              "concert-queue-token-test",
              "concert-product-journey-e2e",
            ],
          },
          {
            id: "queue-booking",
            from: "queue",
            to: "booking",
            label: "bound token",
            sourceIds: ["concert-queue-token-test"],
          },
          {
            id: "booking-db",
            from: "booking",
            to: "db",
            label: "lock + commit",
            sourceIds: ["concert-seat-contention-test"],
          },
          {
            id: "db-b",
            from: "db",
            to: "guest-b",
            label: "409 + refresh",
            sourceIds: ["concert-product-journey-e2e"],
          },
        ],
        steps: [
          {
            id: "admit",
            title: "입장 권한을 사용자와 일정에 묶습니다",
            narrative:
              "Queue가 유효한 token을 원자적으로 발급하고 재시도에는 같은 token을 돌려줍니다.",
            activeNodeIds: ["guest-a", "guest-b", "queue"],
            activeEdgeIds: ["a-queue", "b-queue"],
            visibleState: { queue: "token bound to user + schedule" },
            sourceIds: [
              "concert-queue-token-test",
              "concert-product-journey-e2e",
            ],
          },
          {
            id: "claim",
            title: "같은 예약 의도는 하나의 key를 유지합니다",
            narrative:
              "응답을 잃어도 새로운 예약을 만들지 않고 기존 결과를 조회합니다.",
            activeNodeIds: ["queue", "booking"],
            activeEdgeIds: ["queue-booking"],
            visibleState: { booking: "Idempotency-Key claimed" },
            sourceIds: [
              "concert-idempotency-test",
              "concert-product-journey-e2e",
            ],
          },
          {
            id: "lock",
            title: "DB transaction이 최종 승자를 정합니다",
            narrative:
              "좌석 row를 잠근 transaction 하나만 HELD로 commit합니다.",
            activeNodeIds: ["booking", "db"],
            activeEdgeIds: ["booking-db"],
            visibleState: { db: "selected seat · HELD by winner" },
            sourceIds: ["concert-seat-contention-test"],
          },
          {
            id: "recover",
            title: "패자는 최신 좌석표로 돌아갑니다",
            narrative:
              "Guest B는 모호한 실패 대신 409와 새 좌석 상태를 받아 다른 좌석을 선택합니다.",
            activeNodeIds: ["db", "guest-b"],
            activeEdgeIds: ["db-b"],
            visibleState: {
              "guest-b": "selected seat unavailable · choose again",
            },
            sourceIds: [
              "concert-seat-contention-test",
              "concert-product-journey-e2e",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "concert-event-recovery",
    projectSlug: "concert-booking",
    caseSlug: "concert-event-recovery",
    title: "이벤트 발행과 소비가 실패했을 때",
    summary:
      "commit 이후 실패를 Outbox 상태로 남기고 consumer 실패는 DLT로 격리해 복구 지점을 보존합니다.",
    initialVariant: "designed",
    sourceIds: [
      "concert-outbox-test",
      "concert-dlt-test",
      "concert-seat-release-e2e",
    ],
    variants: [
      {
        id: "designed",
        label: "복구 흐름",
        actors: recoveryActors,
        edges: [
          {
            id: "booking-outbox",
            from: "booking",
            to: "outbox",
            label: "same transaction",
            sourceIds: ["concert-outbox-test"],
          },
          {
            id: "outbox-relay",
            from: "outbox",
            to: "relay",
            label: "claim",
            sourceIds: ["concert-outbox-test"],
          },
          {
            id: "relay-kafka",
            from: "relay",
            to: "kafka",
            label: "publish",
            sourceIds: ["concert-outbox-test"],
          },
          {
            id: "kafka-consumer",
            from: "kafka",
            to: "consumer",
            label: "consume",
            sourceIds: ["concert-dlt-test"],
          },
          {
            id: "consumer-dlt",
            from: "consumer",
            to: "dlt",
            label: "isolate",
            sourceIds: ["concert-dlt-test"],
          },
          {
            id: "dlt-kafka",
            from: "dlt",
            to: "kafka",
            label: "manual replay",
            sourceIds: ["concert-dlt-test"],
          },
        ],
        steps: [
          {
            id: "record",
            title: "도메인 변경과 사건을 함께 기록합니다",
            narrative:
              "예약 취소와 Outbox insert가 같은 DB transaction에서 commit됩니다.",
            activeNodeIds: ["booking", "outbox"],
            activeEdgeIds: ["booking-outbox"],
            visibleState: { outbox: "PENDING" },
            sourceIds: ["concert-outbox-test"],
          },
          {
            id: "fail",
            title: "발행 실패를 성공처럼 지우지 않습니다",
            narrative: "relay가 실패 횟수와 다음 retry 시각을 남깁니다.",
            activeNodeIds: ["outbox", "relay", "kafka"],
            activeEdgeIds: ["outbox-relay", "relay-kafka"],
            visibleState: { outbox: "FAILED · retry 1" },
            sourceIds: ["concert-outbox-test"],
          },
          {
            id: "publish",
            title: "backoff 뒤 다시 발행합니다",
            narrative:
              "다음 relay가 같은 event를 발행하고 상태를 PUBLISHED로 바꿉니다.",
            activeNodeIds: ["relay", "kafka", "outbox"],
            activeEdgeIds: ["outbox-relay", "relay-kafka"],
            visibleState: { outbox: "PUBLISHED" },
            sourceIds: ["concert-outbox-test"],
          },
          {
            id: "isolate",
            title: "처리 실패는 정상 흐름에서 격리합니다",
            narrative:
              "poison event를 DLT로 옮겨 다른 이벤트 처리를 막지 않습니다.",
            activeNodeIds: ["kafka", "consumer", "dlt"],
            activeEdgeIds: ["kafka-consumer", "consumer-dlt"],
            visibleState: { dlt: "cause + original headers" },
            sourceIds: ["concert-dlt-test"],
          },
          {
            id: "replay",
            title: "원인을 확인한 뒤 멱등하게 replay합니다",
            narrative:
              "같은 event를 두 번 replay해도 좌석 반환은 한 번만 반영됩니다.",
            activeNodeIds: ["dlt", "kafka", "consumer"],
            activeEdgeIds: ["dlt-kafka", "kafka-consumer"],
            visibleState: { consumer: "seat released once" },
            sourceIds: ["concert-dlt-test", "concert-seat-release-e2e"],
          },
        ],
      },
    ],
  },
  {
    slug: "realtime-message-lifecycle",
    projectSlug: "realtime-chat",
    caseSlug: "realtime-message-lifecycle",
    title: "보낸 메시지가 저장되고 다시 이어질 때까지",
    summary:
      "상대에게 보이기 전에 DB에 저장하고, 연결이 끊기면 persisted ID 이후를 다시 가져옵니다.",
    initialVariant: "designed",
    sourceIds: [
      "realtime-ordering-test",
      "realtime-lifecycle-refactor-commit",
      "realtime-client-state-test",
      "realtime-persistence-boundary-test",
      "realtime-redelivery-test",
      "realtime-persisted-ack-test",
      "realtime-lifecycle-e2e",
      "realtime-sync-api-test",
    ],
    variants: [
      {
        id: "problem",
        label: "문제 흐름",
        actors: realtimeActors,
        edges: [
          {
            id: "sender-kafka",
            from: "sender",
            to: "kafka",
            label: "send",
            sourceIds: ["realtime-lifecycle-refactor-commit"],
          },
          {
            id: "kafka-db",
            from: "kafka",
            to: "db",
            label: "persist group",
            sourceIds: ["realtime-lifecycle-refactor-commit"],
          },
          {
            id: "kafka-receiver",
            from: "kafka",
            to: "receiver",
            label: "broadcast group",
            sourceIds: ["realtime-lifecycle-refactor-commit"],
          },
        ],
        steps: [
          {
            id: "fanout",
            title: "독립 consumer가 서로 다른 속도로 움직입니다",
            narrative:
              "broadcast가 persistence보다 먼저 끝나면 상대는 아직 저장되지 않은 메시지를 봅니다.",
            activeNodeIds: ["sender", "kafka", "receiver"],
            activeEdgeIds: ["sender-kafka", "kafka-receiver"],
            visibleState: { receiver: "visible", db: "not committed" },
            sourceIds: [
              "realtime-lifecycle-refactor-commit",
              "realtime-persistence-boundary-test",
            ],
          },
          {
            id: "phantom",
            title: "DB 실패 뒤 메시지가 사라집니다",
            narrative:
              "새로고침과 reconnect history에는 상대가 이미 본 메시지가 없습니다.",
            activeNodeIds: ["db", "receiver"],
            activeEdgeIds: ["kafka-db"],
            visibleState: { db: "FAILED", receiver: "phantom message" },
            sourceIds: [
              "realtime-lifecycle-refactor-commit",
              "realtime-persistence-boundary-test",
            ],
          },
        ],
      },
      {
        id: "designed",
        label: "개선 흐름",
        actors: realtimeActors,
        edges: [
          {
            id: "sender-kafka",
            from: "sender",
            to: "kafka",
            label: "SEND",
            sourceIds: ["realtime-client-state-test", "realtime-lifecycle-e2e"],
          },
          {
            id: "kafka-persist",
            from: "kafka",
            to: "persistence",
            label: "consume",
            sourceIds: [
              "realtime-lifecycle-refactor-commit",
              "realtime-persistence-boundary-test",
            ],
          },
          {
            id: "persist-db",
            from: "persistence",
            to: "db",
            label: "commit",
            sourceIds: ["realtime-persistence-boundary-test"],
          },
          {
            id: "persist-receiver",
            from: "persistence",
            to: "receiver",
            label: "broadcast",
            sourceIds: [
              "realtime-persistence-boundary-test",
              "realtime-redelivery-test",
              "realtime-persisted-ack-test",
              "realtime-lifecycle-e2e",
            ],
          },
          {
            id: "db-sync",
            from: "db",
            to: "sync",
            label: "afterMessageId",
            sourceIds: ["realtime-sync-api-test"],
          },
          {
            id: "sync-receiver",
            from: "sync",
            to: "receiver",
            label: "catch up",
            sourceIds: ["realtime-sync-api-test", "realtime-lifecycle-e2e"],
          },
        ],
        steps: [
          {
            id: "sending",
            title: "클라이언트가 임시 메시지를 표시합니다",
            narrative:
              "clientMessageId로 SENDING row를 만들고 Kafka accepted를 기다립니다.",
            activeNodeIds: ["sender", "kafka"],
            activeEdgeIds: ["sender-kafka"],
            visibleState: { sender: "SENDING → ACCEPTED" },
            sourceIds: ["realtime-client-state-test", "realtime-lifecycle-e2e"],
          },
          {
            id: "persist",
            title: "같은 room partition에서 DB에 먼저 저장합니다",
            narrative:
              "transaction이 commit되고 DB message ID가 생길 때까지 상대에게 보내지 않습니다.",
            activeNodeIds: ["kafka", "persistence", "db"],
            activeEdgeIds: ["kafka-persist", "persist-db"],
            visibleState: { db: "message ID · committed" },
            sourceIds: [
              "realtime-ordering-test",
              "realtime-lifecycle-refactor-commit",
              "realtime-persistence-boundary-test",
            ],
          },
          {
            id: "redeliver",
            title: "전달 실패를 ACK로 덮지 않습니다",
            narrative:
              "Redis publish가 실패하면 Kafka record를 ACK하지 않고, 재전달에서 이미 저장된 DB ID를 다시 사용합니다.",
            activeNodeIds: ["kafka", "persistence", "db"],
            activeEdgeIds: ["kafka-persist", "persist-db"],
            visibleState: {
              persistence: "publish failed · no ACK",
              db: "same message ID retained",
            },
            sourceIds: [
              "realtime-persistence-boundary-test",
              "realtime-redelivery-test",
            ],
          },
          {
            id: "broadcast",
            title: "persisted payload를 양쪽에 전달합니다",
            narrative:
              "발신자는 임시 row를 교체하고 수신자는 DB ID로 중복을 제거합니다.",
            activeNodeIds: ["persistence", "receiver", "sender"],
            activeEdgeIds: ["persist-receiver"],
            visibleState: {
              sender: "PERSISTED · message ID",
              receiver: "message ID · deduplicated",
            },
            sourceIds: [
              "realtime-client-state-test",
              "realtime-persisted-ack-test",
              "realtime-lifecycle-e2e",
            ],
          },
          {
            id: "offline",
            title: "수신자가 잠시 연결을 잃습니다",
            narrative:
              "실시간 fan-out은 놓칠 수 있지만 마지막 persisted ID를 기억합니다.",
            activeNodeIds: ["receiver"],
            activeEdgeIds: [],
            visibleState: { receiver: "offline · last persisted ID" },
            sourceIds: ["realtime-lifecycle-e2e"],
          },
          {
            id: "sync",
            title: "재연결 뒤 공백만 보충합니다",
            narrative:
              "마지막 persisted ID 이후를 오름차순으로 받아 기존 대화와 합칩니다.",
            activeNodeIds: ["db", "sync", "receiver"],
            activeEdgeIds: ["db-sync", "sync-receiver"],
            visibleState: { receiver: "missing messages · restored in order" },
            sourceIds: ["realtime-sync-api-test", "realtime-lifecycle-e2e"],
          },
        ],
      },
    ],
  },
];

export const flows = flowDrafts;

export function getFlow(slug: string) {
  return flows.find((flow) => flow.slug === slug);
}
