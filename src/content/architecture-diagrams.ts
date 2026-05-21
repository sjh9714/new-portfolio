import type { EvidenceStatus } from "./projects";

export type ArchitectureNodeKind =
  | "client"
  | "gateway"
  | "service"
  | "worker"
  | "broker"
  | "database"
  | "cache"
  | "ledger"
  | "external";

export type ArchitectureEdgeKind =
  | "sync"
  | "async"
  | "transaction"
  | "failure"
  | "retry"
  | "replay"
  | "compensation";

export type ArchitectureBoundaryKind =
  | "transaction"
  | "async"
  | "failure"
  | "source"
  | "service";

export type ArchitectureNode = {
  id: string;
  label: string;
  description: string;
  kind: ArchitectureNodeKind;
  sourceOfTruth?: boolean;
  status?: EvidenceStatus;
  evidenceLabel?: string;
};

export type ArchitectureEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  kind: ArchitectureEdgeKind;
  evidenceLabel?: string;
};

export type ArchitectureBoundary = {
  id: string;
  label: string;
  kind: ArchitectureBoundaryKind;
  nodeIds: string[];
};

export type ArchitectureCallout = {
  label: string;
  description: string;
  evidenceLabel?: string;
};

export type ArchitectureDiagramSpec = {
  slug: string;
  title: string;
  summary: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  boundaries: ArchitectureBoundary[];
  callouts: ArchitectureCallout[];
};

export const architectureDiagrams: Record<string, ArchitectureDiagramSpec> = {
  "concert-booking": {
    slug: "concert-booking",
    title: "대기열 기반 예매 정합성",
    summary:
      "Queue token, reservation transaction, Outbox relay, Kafka consumer, reconciliation job을 분리해 좌석 정합성과 이벤트 유실 복구 경로를 보여줍니다.",
    nodes: [
      {
        id: "client",
        label: "Client",
        description: "예약 요청과 결제 요청을 보냅니다.",
        kind: "client",
      },
      {
        id: "queue",
        label: "Queue Token",
        description: "userId + scheduleId 바인딩으로 대기열 우회를 막습니다.",
        kind: "cache",
        sourceOfTruth: false,
      },
      {
        id: "reservation",
        label: "Reservation API",
        description:
          "idempotency check, seat lock, reservation insert를 같은 경계에서 처리합니다.",
        kind: "service",
        evidenceLabel: "동일 좌석 경합",
        status: "measured",
      },
      {
        id: "payment",
        label: "Payment API",
        description:
          "결제 승인, 취소, 만료 race를 예약 상태와 맞춰 처리합니다.",
        kind: "service",
        evidenceLabel: "Testcontainers 검증 시나리오",
        status: "verified",
      },
      {
        id: "outbox",
        label: "Outbox Table",
        description:
          "DB commit 이후 발행할 이벤트를 transaction 안에 남깁니다.",
        kind: "database",
        sourceOfTruth: true,
        evidenceLabel: "Testcontainers 검증 시나리오",
        status: "verified",
      },
      {
        id: "kafka",
        label: "Kafka",
        description: "예약/만료/좌석 해제 이벤트를 비동기로 전달합니다.",
        kind: "broker",
      },
      {
        id: "consumer",
        label: "Consumer + DLT",
        description:
          "consumer idempotency, DEAD 상태, manual replay 경로를 둡니다.",
        kind: "worker",
        evidenceLabel: "Testcontainers 검증 시나리오",
        status: "verified",
      },
      {
        id: "postgres",
        label: "PostgreSQL",
        description: "좌석, 예약, 결제 상태의 최종 기준 데이터입니다.",
        kind: "database",
        sourceOfTruth: true,
        evidenceLabel: "분산 좌석 예약",
        status: "measured",
      },
      {
        id: "redis",
        label: "Redis Stock / Queue",
        description:
          "대기열과 빠른 재고 조회를 맡지만 최종 진실 원천은 아닙니다.",
        kind: "cache",
        sourceOfTruth: false,
        evidenceLabel: "혼합 부하 테스트",
        status: "measured",
      },
      {
        id: "reconciliation",
        label: "Reconciliation Job",
        description: "Redis와 DB 차이를 DB 기준으로 복구합니다.",
        kind: "worker",
        evidenceLabel: "Testcontainers 검증 시나리오",
        status: "verified",
      },
    ],
    edges: [
      {
        id: "request-token",
        from: "client",
        to: "queue",
        label: "대기열 토큰 발급/검증",
        kind: "sync",
      },
      {
        id: "reserve-seat",
        from: "queue",
        to: "reservation",
        label: "Idempotency-Key 기반 예약 요청",
        kind: "transaction",
        evidenceLabel: "동일 좌석 경합",
      },
      {
        id: "payment-state",
        from: "reservation",
        to: "payment",
        label: "결제/취소/만료 race 처리",
        kind: "transaction",
        evidenceLabel: "Testcontainers 검증 시나리오",
      },
      {
        id: "write-outbox",
        from: "payment",
        to: "outbox",
        label: "도메인 변경과 이벤트 의도 commit",
        kind: "transaction",
      },
      {
        id: "publish-event",
        from: "outbox",
        to: "kafka",
        label: "Outbox relay 이벤트 발행",
        kind: "async",
      },
      {
        id: "consume-event",
        from: "kafka",
        to: "consumer",
        label: "Consumer idempotency 처리",
        kind: "async",
      },
      {
        id: "dead-replay",
        from: "consumer",
        to: "outbox",
        label: "DEAD 상태 → 수동 처리",
        kind: "replay",
        evidenceLabel: "Testcontainers 검증 시나리오",
      },
      {
        id: "persist-state",
        from: "consumer",
        to: "postgres",
        label: "DB 최종 정합성",
        kind: "transaction",
        evidenceLabel: "분산 좌석 예약",
      },
      {
        id: "redis-check",
        from: "redis",
        to: "reconciliation",
        label: "재고 불일치 스캔",
        kind: "retry",
        evidenceLabel: "Testcontainers 검증 시나리오",
      },
      {
        id: "reconcile-db",
        from: "reconciliation",
        to: "postgres",
        label: "DB 기준 복구",
        kind: "transaction",
      },
    ],
    boundaries: [
      {
        id: "reservation-tx",
        label: "예약 트랜잭션 경계",
        kind: "transaction",
        nodeIds: ["reservation", "payment", "outbox", "postgres"],
      },
      {
        id: "event-boundary",
        label: "비동기 발행/소비 경계",
        kind: "async",
        nodeIds: ["outbox", "kafka", "consumer"],
      },
      {
        id: "failure-boundary",
        label: "발행 또는 소비 실패/복구 경로",
        kind: "failure",
        nodeIds: ["outbox", "kafka", "consumer"],
      },
      {
        id: "truth-boundary",
        label: "DB 기반 최종 기준 데이터",
        kind: "source",
        nodeIds: ["postgres", "outbox"],
      },
    ],
    callouts: [
      {
        label: "최종 기준 데이터",
        description:
          "Redis는 빠른 조회와 큐 역할만 맡고, 좌석/예약 상태는 PostgreSQL과 Outbox 기록으로 복구합니다.",
        evidenceLabel: "Testcontainers 검증 시나리오",
      },
      {
        label: "실패/복구 경로",
        description:
          "Kafka 발행 실패와 consumer 실패는 DEAD 상태와 manual replay로 다시 처리합니다.",
        evidenceLabel: "Testcontainers 검증 시나리오",
      },
    ],
  },
  "realtime-chat": {
    slug: "realtime-chat",
    title: "RoomId 기준 실시간 메시징",
    summary:
      "STOMP subscribe authorization, roomId-keyed Kafka ordering, Redis presence, reconnect sync, DLT replay를 다중 인스턴스 경계로 나눕니다.",
    nodes: [
      {
        id: "client",
        label: "Client A/B",
        description: "send, subscribe, reconnect sync 요청을 보냅니다.",
        kind: "client",
      },
      {
        id: "app1",
        label: "WebSocket App #1",
        description: "STOMP 구독 인가와 producer ACK/NACK를 처리합니다.",
        kind: "service",
        evidenceLabel: "WebSocket 연결 스모크 테스트",
        status: "measured",
      },
      {
        id: "app2",
        label: "WebSocket App #2",
        description: "다른 인스턴스의 client에도 room event를 전달합니다.",
        kind: "service",
        evidenceLabel: "WebSocket 연결 스모크 테스트",
        status: "measured",
      },
      {
        id: "kafka",
        label: "Kafka topic by roomId",
        description:
          "roomId key로 같은 방 메시지 순서를 한 partition에서 유지합니다.",
        kind: "broker",
      },
      {
        id: "consumer",
        label: "Chat Consumer + DLT",
        description:
          "message persist, read state update, DLT replay를 처리합니다.",
        kind: "worker",
      },
      {
        id: "message-db",
        label: "Message DB",
        description: "message와 read state의 최종 기준 데이터입니다.",
        kind: "database",
        sourceOfTruth: true,
        evidenceLabel: "N+1 쿼리 제거",
        status: "measured",
      },
      {
        id: "redis",
        label: "Redis Presence",
        description:
          "online state와 instance fan-out을 돕는 ephemeral store입니다.",
        kind: "cache",
        sourceOfTruth: false,
      },
      {
        id: "sync-api",
        label: "Reconnect Sync API",
        description: "마지막 수신 위치 이후 message를 다시 조회합니다.",
        kind: "service",
        evidenceLabel: "WebSocket 전달 완전성",
        status: "pending",
      },
      {
        id: "latency-benchmark",
        label: "Latency Benchmark",
        description: "send-to-receive p50/p95/p99를 별도 측정합니다.",
        kind: "external",
        evidenceLabel: "메시지 전달 지연 시간",
        status: "pending",
      },
    ],
    edges: [
      {
        id: "subscribe",
        from: "client",
        to: "app1",
        label: "STOMP 구독 인가",
        kind: "sync",
      },
      {
        id: "publish",
        from: "app1",
        to: "kafka",
        label: "Producer ACK/NACK",
        kind: "async",
      },
      {
        id: "consume",
        from: "kafka",
        to: "consumer",
        label: "roomId 기준 순서 보장",
        kind: "async",
      },
      {
        id: "persist",
        from: "consumer",
        to: "message-db",
        label: "message/read state 저장",
        kind: "transaction",
        evidenceLabel: "N+1 쿼리 제거",
      },
      {
        id: "presence",
        from: "app1",
        to: "redis",
        label: "presence heartbeat",
        kind: "sync",
      },
      {
        id: "fanout",
        from: "redis",
        to: "app2",
        label: "인스턴스 간 fan-out",
        kind: "async",
      },
      {
        id: "deliver",
        from: "app2",
        to: "client",
        label: "구독자 전달",
        kind: "sync",
        evidenceLabel: "WebSocket 전달 완전성",
      },
      {
        id: "reconnect",
        from: "client",
        to: "sync-api",
        label: "마지막 수신 cursor",
        kind: "retry",
        evidenceLabel: "WebSocket 전달 완전성",
      },
      {
        id: "sync-read",
        from: "sync-api",
        to: "message-db",
        label: "누락 메시지 복구",
        kind: "transaction",
      },
      {
        id: "latency-sample",
        from: "client",
        to: "latency-benchmark",
        label: "send-to-receive 샘플링",
        kind: "sync",
        evidenceLabel: "메시지 전달 지연 시간",
      },
    ],
    boundaries: [
      {
        id: "ws-boundary",
        label: "WebSocket 인스턴스 경계",
        kind: "async",
        nodeIds: ["app1", "app2", "redis"],
      },
      {
        id: "kafka-boundary",
        label: "Kafka 비동기 순서 경계",
        kind: "async",
        nodeIds: ["app1", "kafka", "consumer"],
      },
      {
        id: "db-truth",
        label: "Message 최종 기준 데이터",
        kind: "source",
        nodeIds: ["message-db"],
      },
      {
        id: "pending-boundary",
        label: "추가 측정 예정 benchmark 경계",
        kind: "failure",
        nodeIds: ["sync-api", "latency-benchmark"],
      },
    ],
    callouts: [
      {
        label: "측정 완료 API 경로",
        description: "채팅방 조회 API는 RPS, p95, N+1 제거 수치가 있습니다.",
        evidenceLabel: "채팅방 조회 API RPS",
      },
      {
        label: "추가 검증 예정",
        description:
          "실제 메시지 지연과 전달 완전성은 별도 benchmark에서 공개 수치로 채워야 합니다.",
        evidenceLabel: "메시지 전달 지연 시간",
      },
    ],
  },
  "ai-usage-billing-gateway": {
    slug: "ai-usage-billing-gateway",
    title: "테넌트 기준 과금 정합성",
    summary:
      "JWT/API key 인증, usage idempotency, invoice, webhook duplicate handling, ledger/audit을 과금 정합성 흐름으로 연결합니다.",
    nodes: [
      {
        id: "user-api",
        label: "User API / JWT",
        description: "organization 단위 권한과 RBAC 경계를 확인합니다.",
        kind: "client",
      },
      {
        id: "api-key",
        label: "API Key",
        description: "raw key는 최초 1회 반환하고 prefix/hash만 저장합니다.",
        kind: "gateway",
        evidenceLabel: "API Key 저장 방식",
        status: "verified",
      },
      {
        id: "gateway",
        label: "Usage Gateway",
        description: "tenant isolation과 quota/rate limit 경계를 둡니다.",
        kind: "service",
      },
      {
        id: "usage",
        label: "Usage Event",
        description:
          "idempotency key와 request hash로 중복과 충돌을 구분합니다.",
        kind: "service",
        evidenceLabel: "사용량 중복 처리",
        status: "verified",
      },
      {
        id: "invoice",
        label: "Invoice",
        description: "월별 사용량 집계와 중복 invoice 생성을 막는 경계입니다.",
        kind: "worker",
      },
      {
        id: "webhook",
        label: "Payment Webhook",
        description:
          "providerEventId와 payload hash로 duplicate/conflict를 구분합니다.",
        kind: "external",
        evidenceLabel: "Webhook 중복 처리",
        status: "verified",
      },
      {
        id: "ledger",
        label: "Append-only Ledger",
        description:
          "debit/credit balance와 currency invariant의 최종 진실 원천입니다.",
        kind: "ledger",
        sourceOfTruth: true,
        evidenceLabel: "Append-only Ledger 불변성",
        status: "verified",
      },
      {
        id: "audit",
        label: "Audit Log",
        description: "billing 변경 이력을 감사 가능한 형태로 남깁니다.",
        kind: "database",
        sourceOfTruth: true,
      },
      {
        id: "benchmark",
        label: "Mixed Usage Benchmark",
        description:
          "throughput, latency, error rate를 공개 측정으로 남길 항목입니다.",
        kind: "external",
        evidenceLabel: "혼합 사용량 부하 테스트",
        status: "pending",
      },
      {
        id: "ops-data",
        label: "운영 데이터",
        description:
          "운영형 성능 claim은 공개 가능한 데이터와 함께만 표시합니다.",
        kind: "external",
        evidenceLabel: "운영 성능 주장",
        status: "pending",
      },
    ],
    edges: [
      {
        id: "auth",
        from: "user-api",
        to: "api-key",
        label: "tenant auth / key 발급",
        kind: "sync",
        evidenceLabel: "API Key 저장 방식",
      },
      {
        id: "gateway-check",
        from: "api-key",
        to: "gateway",
        label: "hash 검증",
        kind: "sync",
      },
      {
        id: "record-usage",
        from: "gateway",
        to: "usage",
        label: "idempotent usage 저장",
        kind: "transaction",
        evidenceLabel: "사용량 중복 처리",
      },
      {
        id: "usage-invoice",
        from: "usage",
        to: "invoice",
        label: "월별 사용량 집계",
        kind: "async",
      },
      {
        id: "webhook-state",
        from: "webhook",
        to: "invoice",
        label: "결제 상태 callback",
        kind: "retry",
        evidenceLabel: "Webhook 중복 처리",
      },
      {
        id: "ledger-entry",
        from: "invoice",
        to: "ledger",
        label: "charge/payment ledger 추가",
        kind: "transaction",
        evidenceLabel: "Append-only Ledger 불변성",
      },
      {
        id: "audit-entry",
        from: "ledger",
        to: "audit",
        label: "audit trail 기록",
        kind: "transaction",
      },
      {
        id: "bench-target",
        from: "benchmark",
        to: "gateway",
        label: "mixed usage scenario 측정",
        kind: "sync",
        evidenceLabel: "혼합 사용량 부하 테스트",
      },
      {
        id: "ops-target",
        from: "ops-data",
        to: "ledger",
        label: "운영형 성능 근거",
        kind: "sync",
        evidenceLabel: "운영 성능 주장",
      },
    ],
    boundaries: [
      {
        id: "tenant-boundary",
        label: "Tenant/key 보안 경계",
        kind: "transaction",
        nodeIds: ["user-api", "api-key", "gateway"],
      },
      {
        id: "billing-boundary",
        label: "과금 트랜잭션 경계",
        kind: "transaction",
        nodeIds: ["usage", "invoice", "ledger", "audit"],
      },
      {
        id: "webhook-boundary",
        label: "외부 webhook 재시도 경계",
        kind: "failure",
        nodeIds: ["webhook", "invoice"],
      },
      {
        id: "ledger-truth",
        label: "Ledger 최종 기준 데이터",
        kind: "source",
        nodeIds: ["ledger", "audit"],
      },
    ],
    callouts: [
      {
        label: "중복 입력은 정상 입력",
        description:
          "usage와 webhook은 재시도와 중복 delivery를 정상 입력으로 보고 hash mismatch만 conflict로 다룹니다.",
        evidenceLabel: "사용량 중복 처리",
      },
      {
        label: "추가 검증 예정",
        description:
          "mixed usage benchmark와 운영형 성능 근거는 측정 완료 전까지 별도 상태로 보입니다.",
        evidenceLabel: "혼합 사용량 부하 테스트",
      },
    ],
  },
  "msa-shop": {
    slug: "msa-shop",
    title: "서비스 간 주문 보상 흐름",
    summary:
      "Gateway, Order, Product, Payment, Settlement를 RabbitMQ 이벤트로 연결하고 보상 실패 경계를 명시합니다.",
    nodes: [
      {
        id: "gateway",
        label: "Gateway",
        description: "인증과 rate limit의 공통 진입 경계입니다.",
        kind: "gateway",
        evidenceLabel: "Gateway 접근 경계",
        status: "verified",
      },
      {
        id: "order",
        label: "Order Service",
        description: "주문 생성과 Saga 상태를 관리합니다.",
        kind: "service",
        evidenceLabel: "SAGA 보상 흐름",
        status: "verified",
      },
      {
        id: "product",
        label: "Product Reserve",
        description: "재고 예약과 예약 취소 보상을 처리합니다.",
        kind: "service",
      },
      {
        id: "payment",
        label: "Payment Service",
        description: "결제 승인과 결제 취소 보상 경계를 가집니다.",
        kind: "service",
      },
      {
        id: "rabbitmq",
        label: "RabbitMQ",
        description: "서비스 간 이벤트 전달과 보상 이벤트를 연결합니다.",
        kind: "broker",
        evidenceLabel: "RabbitMQ 이벤트 흐름",
        status: "verified",
      },
      {
        id: "outbox",
        label: "Service Outbox",
        description: "로컬 commit 이후 이벤트 발행 의도를 남깁니다.",
        kind: "database",
        sourceOfTruth: true,
        evidenceLabel: "SAGA 보상 흐름",
        status: "verified",
      },
      {
        id: "settlement",
        label: "Settlement Service",
        description: "결제 완료 이벤트를 정산 집계로 반영합니다.",
        kind: "service",
        evidenceLabel: "RabbitMQ 이벤트 흐름",
        status: "verified",
      },
      {
        id: "service-db",
        label: "Per-service DB",
        description: "각 서비스 로컬 데이터의 최종 기준 데이터입니다.",
        kind: "database",
        sourceOfTruth: true,
      },
      {
        id: "observability",
        label: "Prometheus / Grafana / Zipkin",
        description: "장애 경계와 지연 흐름을 관찰하는 stack입니다.",
        kind: "external",
        evidenceLabel: "관측성 스택",
        status: "verified",
      },
    ],
    edges: [
      {
        id: "create-order",
        from: "gateway",
        to: "order",
        label: "주문 생성",
        kind: "sync",
        evidenceLabel: "Gateway 접근 경계",
      },
      {
        id: "reserve-stock",
        from: "order",
        to: "product",
        label: "재고 예약",
        kind: "async",
        evidenceLabel: "SAGA 보상 흐름",
      },
      {
        id: "approve-payment",
        from: "product",
        to: "payment",
        label: "결제 승인",
        kind: "async",
      },
      {
        id: "event-bus",
        from: "payment",
        to: "rabbitmq",
        label: "결제 이벤트",
        kind: "async",
        evidenceLabel: "RabbitMQ 이벤트 흐름",
      },
      {
        id: "settlement-event",
        from: "rabbitmq",
        to: "settlement",
        label: "정산 집계",
        kind: "async",
        evidenceLabel: "RabbitMQ 이벤트 흐름",
      },
      {
        id: "write-outbox",
        from: "order",
        to: "outbox",
        label: "로컬 상태와 이벤트 의도",
        kind: "transaction",
        evidenceLabel: "SAGA 보상 흐름",
      },
      {
        id: "compensate-stock",
        from: "payment",
        to: "product",
        label: "결제 실패 → 재고 예약 취소",
        kind: "compensation",
        evidenceLabel: "SAGA 보상 흐름",
      },
      {
        id: "relay-retry",
        from: "outbox",
        to: "rabbitmq",
        label: "Outbox relay 실패",
        kind: "retry",
      },
      {
        id: "service-state",
        from: "order",
        to: "service-db",
        label: "서비스별 로컬 상태",
        kind: "transaction",
      },
      {
        id: "trace-flow",
        from: "observability",
        to: "gateway",
        label: "trace/metric feedback",
        kind: "sync",
        evidenceLabel: "관측성 스택",
      },
    ],
    boundaries: [
      {
        id: "service-boundary",
        label: "서비스와 DB 경계",
        kind: "service",
        nodeIds: ["order", "product", "payment", "settlement", "service-db"],
      },
      {
        id: "event-boundary",
        label: "RabbitMQ 비동기 경계",
        kind: "async",
        nodeIds: ["rabbitmq", "outbox", "settlement"],
      },
      {
        id: "compensation-boundary",
        label: "SAGA 보상 경계",
        kind: "failure",
        nodeIds: ["product", "payment", "order"],
      },
      {
        id: "gateway-boundary",
        label: "Gateway 접근 경계",
        kind: "transaction",
        nodeIds: ["gateway", "order"],
      },
    ],
    callouts: [
      {
        label: "보상 처리 경로",
        description:
          "재고 예약 이후 결제가 실패하면 Product에 보상 이벤트를 보내고 Order Saga 상태를 갱신합니다.",
        evidenceLabel: "SAGA 보상 흐름",
      },
      {
        label: "범위 표시",
        description:
          "운영형 MSA claim보다 서비스 경계와 보상 흐름 검증에 초점을 둡니다.",
        evidenceLabel: "RabbitMQ 이벤트 흐름",
      },
    ],
  },
};
