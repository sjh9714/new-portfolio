import {
  getProjectBySlug,
  type Project,
  type ProjectEvidence,
} from "@/content/projects";

export type MeasurementEnvironmentItem = {
  label: string;
  value: string;
};

export type PortfolioCaseMeasurement = {
  scenarios?: MeasurementEnvironmentItem[];
  executionEnvironment?: MeasurementEnvironmentItem[];
};

export type PortfolioDiagramMarker =
  | "transaction"
  | "async"
  | "failure"
  | "source"
  | "pending";

export type PortfolioDiagramNodeKind =
  | "client"
  | "gateway"
  | "service"
  | "transaction"
  | "broker"
  | "database"
  | "cache"
  | "worker"
  | "ledger"
  | "external";

export type PortfolioDiagramNode = {
  id: string;
  label: string;
  description: string;
  kind: PortfolioDiagramNodeKind;
  markers?: PortfolioDiagramMarker[];
};

export type PortfolioDiagramEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  markers?: PortfolioDiagramMarker[];
};

export type PortfolioDiagram = {
  title: string;
  summary: string;
  nodes: PortfolioDiagramNode[];
  edges: PortfolioDiagramEdge[];
};

export type PortfolioCase = {
  slug: string;
  title: string;
  projectSlug: string;
  domain: string;
  resumeLine: string;
  problem: string[];
  solution: string[];
  result: string[];
  evidence: ProjectEvidence[];
  measurement?: PortfolioCaseMeasurement;
  implementationDetails: string[];
  limitations: string[];
  interviewQuestions: string[];
  diagram: PortfolioDiagram;
};

function requireProject(slug: string): Project {
  const project = getProjectBySlug(slug);

  if (!project) {
    throw new Error(`Missing project for portfolio case: ${slug}`);
  }

  return project;
}

function requireEvidence(projectSlug: string, label: string): ProjectEvidence {
  const project = requireProject(projectSlug);
  const evidence = project.evidence.find((item) => item.label === label);

  if (!evidence) {
    throw new Error(`Missing evidence "${label}" on project "${projectSlug}"`);
  }

  return evidence;
}

function evidenceSet(projectSlug: string, labels: string[]) {
  return labels.map((label) => requireEvidence(projectSlug, label));
}

export const featuredPortfolioCases: PortfolioCase[] = [
  {
    slug: "concert-seat-overselling-consistency",
    title:
      "동일 좌석 100개 동시 예매 요청에서 좌석 락·Idempotency·Outbox로 오버셀링 0건 검증",
    projectSlug: "concert-booking",
    domain: "콘서트 예매 / 예약 정합성",
    resumeLine:
      "동일 좌석 100개 동시 예매 요청에서 좌석 락·Idempotency-Key·Outbox로 success 1, fail 99, overselling 0을 검증했습니다.",
    problem: [
      "동일 좌석에 여러 사용자가 동시에 접근하면 읽기-수정-쓰기 사이 race condition으로 오버셀링이 발생할 수 있었습니다.",
      "네트워크 timeout과 client retry는 중복 예약 또는 중복 결제로 이어질 수 있었습니다.",
      "Redis 재고와 DB 예약 상태가 어긋날 때 어떤 데이터를 최종 기준으로 복구할지 명확해야 했습니다.",
    ],
    solution: [
      "Queue token을 userId + scheduleId에 바인딩해 대기열 우회 요청을 제한했습니다.",
      "Reservation transaction 안에서 Idempotency-Key 확인, 좌석 락, 예약 생성을 함께 처리했습니다.",
      "DB commit 이후 발행할 이벤트는 Outbox에 남기고 Redis stock은 PostgreSQL 기준 reconciliation 대상으로 두었습니다.",
    ],
    result: [
      "동일 좌석 100개 동시 요청에서 success 1, fail 99, overselling 0을 기록했습니다.",
      "서로 다른 좌석 50개 예약에서 pessimistic lock과 Redis distributed lock 모두 50/50 성공을 확인했습니다.",
      "예약/결제 idempotency, race condition, DLT replay, stock reconciliation을 Testcontainers 시나리오로 검증했습니다.",
    ],
    evidence: evidenceSet("concert-booking", [
      "동일 좌석 경합",
      "분산 좌석 예약",
      "Testcontainers 검증 시나리오",
    ]),
    measurement: {
      scenarios: [
        {
          label: "동일 좌석 경합 시나리오",
          value: "동일 좌석 100 concurrent requests",
        },
        {
          label: "분산 좌석 예약 시나리오",
          value: "서로 다른 좌석 50명 동시 예약",
        },
      ],
    },
    implementationDetails: [
      "좌석 경합은 DB transaction 안의 락과 idempotency check가 같은 경계에 있도록 정리했습니다.",
      "Redis는 빠른 조회와 queue 역할을 맡지만 좌석/예약 상태의 최종 기준 데이터로 두지 않았습니다.",
      "Outbox를 예약 흐름에 포함해 DB 변경과 이벤트 발행 의도를 같은 commit 경계에 남겼습니다.",
    ],
    limitations: [
      "운영 알림, tracing, SLO, runbook은 아직 대표 근거로 제시하지 않습니다.",
      "부하 테스트의 하드웨어/실행 환경 세부값은 공개 가능한 값이 확인될 때만 추가합니다.",
    ],
    interviewQuestions: [
      "왜 Redis stock을 최종 기준 데이터로 두지 않았나요?",
      "낙관적 락과 비관적 락, Redis distributed lock의 선택 기준은 무엇인가요?",
      "Outbox가 exactly-once를 보장하지 않는다면 중복은 어디서 흡수했나요?",
    ],
    diagram: {
      title: "동일 좌석 예매 정합성 구조",
      summary:
        "Queue token, reservation transaction, Outbox, Kafka, reconciliation을 하나의 요청 흐름으로 연결해 오버셀링과 중복 요청을 제어합니다.",
      nodes: [
        {
          id: "client",
          label: "Client",
          description: "동일 좌석 예약 요청과 재시도를 보냅니다.",
          kind: "client",
        },
        {
          id: "queue",
          label: "Queue Token",
          description:
            "userId + scheduleId 바인딩으로 대기열 우회를 제한합니다.",
          kind: "cache",
        },
        {
          id: "reservation",
          label: "Reservation Transaction",
          description:
            "Idempotency-Key 확인, 좌석 락, 예약 생성, Outbox 기록을 같은 경계에서 처리합니다.",
          kind: "transaction",
          markers: ["transaction"],
        },
        {
          id: "outbox",
          label: "Outbox Table",
          description: "DB commit 이후 발행할 이벤트 의도를 남깁니다.",
          kind: "database",
          markers: ["source"],
        },
        {
          id: "kafka",
          label: "Kafka",
          description: "예약/만료/좌석 해제 이벤트를 비동기로 전달합니다.",
          kind: "broker",
          markers: ["async"],
        },
        {
          id: "consumer",
          label: "Consumer + DLT",
          description: "중복 소비를 흡수하고 실패 이벤트를 격리합니다.",
          kind: "worker",
          markers: ["failure"],
        },
        {
          id: "postgres",
          label: "PostgreSQL",
          description: "좌석, 예약, 결제 상태의 최종 기준 데이터입니다.",
          kind: "database",
          markers: ["source"],
        },
        {
          id: "redis",
          label: "Redis Stock / Queue",
          description:
            "대기열과 빠른 재고 조회를 맡지만 최종 기준 데이터는 아닙니다.",
          kind: "cache",
        },
        {
          id: "reconciliation",
          label: "Reconciliation Job",
          description: "Redis와 DB 차이를 PostgreSQL 기준으로 복구합니다.",
          kind: "worker",
          markers: ["failure"],
        },
      ],
      edges: [
        {
          id: "issue-token",
          from: "client",
          to: "queue",
          label: "대기열 토큰 발급/검증",
        },
        {
          id: "reserve-seat",
          from: "queue",
          to: "reservation",
          label: "예약 요청",
          markers: ["transaction"],
        },
        {
          id: "write-outbox",
          from: "reservation",
          to: "outbox",
          label: "이벤트 의도 저장",
          markers: ["transaction"],
        },
        {
          id: "publish-event",
          from: "outbox",
          to: "kafka",
          label: "commit 이후 이벤트 발행",
          markers: ["async"],
        },
        {
          id: "consume-event",
          from: "kafka",
          to: "consumer",
          label: "중복 소비 방지",
          markers: ["async"],
        },
        {
          id: "persist-state",
          from: "consumer",
          to: "postgres",
          label: "예약 상태 반영",
          markers: ["transaction", "source"],
        },
        {
          id: "scan-redis",
          from: "redis",
          to: "reconciliation",
          label: "재고 불일치 스캔",
          markers: ["failure"],
        },
        {
          id: "repair-db",
          from: "reconciliation",
          to: "postgres",
          label: "DB 기준 복구",
          markers: ["source"],
        },
      ],
    },
  },
  {
    slug: "concert-outbox-dlt-recovery",
    title:
      "DB commit 이후 Kafka 발행 실패를 Outbox·DLT·수동 재처리로 복구 가능한 상태로 설계",
    projectSlug: "concert-booking",
    domain: "콘서트 예매 / 이벤트 정합성",
    resumeLine:
      "DB commit 이후 Kafka 발행 실패를 Outbox·DLT·수동 재처리 경로로 격리해 예약/결제/만료 이벤트를 복구 가능한 상태로 설계했습니다.",
    problem: [
      "DB commit 이후 Kafka publish가 실패하면 예약 상태와 consumer 처리 상태가 어긋날 수 있었습니다.",
      "consumer 실패를 단순 재시도로만 처리하면 중복 처리와 무한 재시도 위험이 있었습니다.",
      "결제 승인, 취소, 만료 race가 섞일 때 어떤 이벤트를 다시 처리해야 하는지 추적 가능해야 했습니다.",
    ],
    solution: [
      "도메인 변경과 발행할 이벤트 의도를 같은 transaction에서 Outbox에 저장했습니다.",
      "Outbox relay, DEAD 상태, DLT, manual replay 경로를 분리해 실패 이벤트를 다시 설명할 수 있게 했습니다.",
      "consumer idempotency와 Redis stock reconciliation으로 중복 소비와 조회 상태 불일치를 흡수했습니다.",
    ],
    result: [
      "예약/결제 idempotency, race condition, DLT replay, stock reconciliation을 Testcontainers로 검증했습니다.",
      "Kafka publish 실패와 consumer 실패를 정상 처리 흐름 밖으로 격리할 수 있게 구조화했습니다.",
      "Outbox가 exactly-once를 보장한다는 식의 과장 없이 consumer idempotency를 함께 설명하도록 정리했습니다.",
    ],
    evidence: evidenceSet("concert-booking", [
      "Testcontainers 검증 시나리오",
      "혼합 부하 테스트",
    ]),
    implementationDetails: [
      "Outbox Table은 이벤트 발행 성공 여부와 재처리 상태를 추적하는 복구 기준으로 둡니다.",
      "DLT와 DEAD 상태는 자동 재시도로 해결되지 않는 이벤트를 운영자가 확인 가능한 대상으로 분리합니다.",
      "Redis stock은 빠른 조회를 위한 보조 상태이며, reconciliation은 PostgreSQL 기준으로 수행합니다.",
    ],
    limitations: [
      "Outbox relay 재시도 주기, DEAD 전환 기준, 운영 알림은 추가 문서화가 필요합니다.",
      "운영 환경에서의 tracing과 runbook은 아직 공개 근거로 제시하지 않습니다.",
    ],
    interviewQuestions: [
      "Outbox 패턴은 어떤 실패를 줄이고, 어떤 실패는 여전히 남기나요?",
      "manual replay가 중복 발행을 만들 때 어디서 idempotency를 보장하나요?",
      "DLT에 쌓인 이벤트를 어떤 기준으로 다시 처리해야 하나요?",
    ],
    diagram: {
      title: "Outbox / DLT 복구 흐름",
      summary:
        "DB transaction 안에 이벤트 의도를 남기고, relay와 consumer 실패를 DLT/manual replay 경로로 분리합니다.",
      nodes: [
        {
          id: "transaction",
          label: "Reservation / Payment Transaction",
          description: "예약 또는 결제 상태 변경을 commit합니다.",
          kind: "transaction",
          markers: ["transaction"],
        },
        {
          id: "outbox",
          label: "Outbox Table",
          description: "발행할 이벤트와 재처리 상태를 남깁니다.",
          kind: "database",
          markers: ["source"],
        },
        {
          id: "relay",
          label: "Outbox Relay",
          description: "Outbox 이벤트를 Kafka로 발행합니다.",
          kind: "worker",
          markers: ["async"],
        },
        {
          id: "kafka",
          label: "Kafka",
          description: "예약/결제/만료 이벤트를 전달합니다.",
          kind: "broker",
          markers: ["async"],
        },
        {
          id: "consumer",
          label: "Consumer",
          description: "consumer idempotency로 중복 처리를 흡수합니다.",
          kind: "worker",
        },
        {
          id: "dlt",
          label: "DLT / DEAD",
          description: "자동 처리 실패 이벤트를 격리합니다.",
          kind: "worker",
          markers: ["failure"],
        },
        {
          id: "manual",
          label: "Manual Replay",
          description: "확인 후 수동 재처리합니다.",
          kind: "worker",
          markers: ["failure"],
        },
        {
          id: "postgres",
          label: "PostgreSQL",
          description: "예약/결제 상태의 최종 기준 데이터입니다.",
          kind: "database",
          markers: ["source"],
        },
      ],
      edges: [
        {
          id: "write-outbox",
          from: "transaction",
          to: "outbox",
          label: "상태 변경과 이벤트 의도 commit",
          markers: ["transaction"],
        },
        {
          id: "relay-publish",
          from: "outbox",
          to: "relay",
          label: "발행 대상 조회",
          markers: ["async"],
        },
        {
          id: "publish-kafka",
          from: "relay",
          to: "kafka",
          label: "Kafka 발행",
          markers: ["async"],
        },
        {
          id: "consume",
          from: "kafka",
          to: "consumer",
          label: "이벤트 소비",
          markers: ["async"],
        },
        {
          id: "dlt",
          from: "consumer",
          to: "dlt",
          label: "처리 실패 격리",
          markers: ["failure"],
        },
        {
          id: "manual-replay",
          from: "dlt",
          to: "manual",
          label: "수동 재처리",
          markers: ["failure"],
        },
        {
          id: "persist",
          from: "consumer",
          to: "postgres",
          label: "상태 반영",
          markers: ["source"],
        },
        {
          id: "manual-persist",
          from: "manual",
          to: "postgres",
          label: "재처리 결과 반영",
          markers: ["source"],
        },
      ],
    },
  },
  {
    slug: "chat-room-n-plus-one-rps",
    title: "채팅방 조회 API의 N+1 쿼리를 제거해 RPS 937→1,598 개선",
    projectSlug: "realtime-chat",
    domain: "실시간 채팅 / 조회 성능",
    resumeLine:
      "채팅방 조회 API의 N+1 쿼리를 제거해 RPS 937→1,598, p95 212.85ms→149.22ms, 쿼리 2N+1→1회로 개선했습니다.",
    problem: [
      "채팅방 목록 조회에서 방 수에 비례해 쿼리가 늘어나 API 응답 시간이 악화될 수 있었습니다.",
      "실시간 채팅 프로젝트라도 사용자는 먼저 방 목록 조회와 재접속 동기화 API에서 지연을 경험합니다.",
      "WebSocket 연결 성공과 실제 메시지 전달 지연은 다른 지표이므로 성능 claim을 분리해야 했습니다.",
    ],
    solution: [
      "채팅방 조회 경로의 N+1 쿼리를 제거해 필요한 데이터를 1회 쿼리로 조회하도록 재구성했습니다.",
      "조회 API 개선 수치와 WebSocket 연결 스모크 테스트를 분리해 근거 상태를 표시했습니다.",
      "send-to-receive latency와 delivery completeness는 아직 추가 측정 예정으로 남겨 과장을 피했습니다.",
    ],
    result: [
      "채팅방 조회 API 처리량을 937 RPS에서 1,598 RPS로 개선했습니다.",
      "p95 응답 시간을 212.85ms에서 149.22ms로 낮췄습니다.",
      "N+1 쿼리를 2N+1회에서 1회로 제거했습니다.",
    ],
    evidence: evidenceSet("realtime-chat", [
      "채팅방 조회 API RPS",
      "p95 응답 시간",
      "N+1 쿼리 제거",
      "메시지 전달 지연 시간",
      "WebSocket 전달 완전성",
    ]),
    measurement: {
      scenarios: [
        {
          label: "조회 API 시나리오",
          value: "채팅방 조회 API 개선 전후 비교",
        },
        {
          label: "쿼리 수 변화",
          value: "2N+1회 -> 1회",
        },
      ],
    },
    implementationDetails: [
      "조회 성능 사례는 WebSocket delivery 성능과 분리해 API 병목 개선으로 설명합니다.",
      "roomId 기반 Kafka ordering, Redis presence, reconnect sync는 프로젝트 맥락으로 연결하되 측정하지 않은 지표는 pending으로 둡니다.",
      "면접에서는 N+1 제거 방식과 실시간 전달 지연 측정 계획을 나눠 답변할 수 있게 구성합니다.",
    ],
    limitations: [
      "send-to-receive p50/p95/p99와 delivery completeness는 아직 공개 측정 결과가 없습니다.",
      "다중 인스턴스 환경의 reconnect 후 누락 메시지 복구율은 추가 측정 예정입니다.",
    ],
    interviewQuestions: [
      "N+1 쿼리가 어떤 엔티티 관계에서 발생했고 어떻게 1회로 줄였나요?",
      "채팅방 조회 API 성능과 실시간 메시지 전달 지연은 왜 별도 지표인가요?",
      "roomId key ordering은 Kafka partition과 어떤 관계가 있나요?",
    ],
    diagram: {
      title: "채팅방 조회 API 개선 흐름",
      summary:
        "실시간 메시징 경로와 별도로, 채팅방 조회 API의 DB 접근 경로를 줄여 목록 조회 병목을 개선합니다.",
      nodes: [
        {
          id: "client",
          label: "Client",
          description: "채팅방 목록을 조회합니다.",
          kind: "client",
        },
        {
          id: "api",
          label: "Chat Room API",
          description: "방 목록, 마지막 메시지, 읽음 상태를 응답합니다.",
          kind: "service",
        },
        {
          id: "before",
          label: "Before Query Path",
          description: "방 수에 따라 2N+1회 쿼리가 발생했습니다.",
          kind: "service",
        },
        {
          id: "after",
          label: "After Query Path",
          description: "필요 데이터를 1회 쿼리로 모으도록 재구성했습니다.",
          kind: "service",
        },
        {
          id: "db",
          label: "Message DB",
          description: "채팅방, 메시지, 읽음 상태의 기준 데이터입니다.",
          kind: "database",
          markers: ["source"],
        },
        {
          id: "websocket",
          label: "WebSocket Delivery",
          description: "전달 지연과 완전성은 별도 측정 예정입니다.",
          kind: "service",
          markers: ["pending"],
        },
      ],
      edges: [
        {
          id: "request",
          from: "client",
          to: "api",
          label: "채팅방 목록 조회",
        },
        {
          id: "before-query",
          from: "api",
          to: "before",
          label: "개선 전 N+1 경로",
        },
        {
          id: "after-query",
          from: "api",
          to: "after",
          label: "개선 후 단일 조회 경로",
        },
        {
          id: "db-read",
          from: "after",
          to: "db",
          label: "1회 쿼리",
          markers: ["source"],
        },
        {
          id: "pending-delivery",
          from: "api",
          to: "websocket",
          label: "실시간 전달 지표 분리",
          markers: ["pending"],
        },
      ],
    },
  },
  {
    slug: "billing-idempotency-webhook-ledger",
    title:
      "멀티테넌트 과금 흐름에서 API Key hash 저장·사용량 중복 처리·Webhook 중복 처리를 검증",
    projectSlug: "ai-usage-billing-gateway",
    domain: "SaaS 과금 / 멀티테넌트 보안",
    resumeLine:
      "멀티테넌트 과금 흐름에서 API Key hash 저장, 사용량 중복 처리, Webhook duplicate/conflict, append-only ledger invariant를 검증했습니다.",
    problem: [
      "API Key 원문 저장은 유출 시 tenant 보안 사고로 이어질 수 있었습니다.",
      "사용량 수집과 결제 webhook은 retry와 duplicate delivery가 정상 입력처럼 들어올 수 있었습니다.",
      "invoice, payment, ledger 흐름은 중복 처리와 감사 가능성을 함께 만족해야 했습니다.",
    ],
    solution: [
      "API Key는 raw value를 1회만 반환하고 DB에는 prefix와 hash만 저장하는 방식으로 정리했습니다.",
      "usage event와 webhook은 idempotency key, providerEventId, payload hash로 duplicate/conflict를 분리했습니다.",
      "append-only ledger invariant를 두어 debit/credit balance와 audit log를 검증 대상으로 만들었습니다.",
    ],
    result: [
      "API Key 저장 방식, 사용량 중복 처리, Webhook 중복 처리, Append-only Ledger 불변성을 시나리오로 검증했습니다.",
      "혼합 사용량 부하 테스트와 운영 성능 주장은 아직 추가 측정 예정으로 분리했습니다.",
      "AI 기능 자체보다 SaaS billing backend의 보안과 정합성 문제를 중심으로 설명할 수 있게 정리했습니다.",
    ],
    evidence: evidenceSet("ai-usage-billing-gateway", [
      "API Key 저장 방식",
      "사용량 중복 처리",
      "Webhook 중복 처리",
      "Append-only Ledger 불변성",
      "혼합 사용량 부하 테스트",
      "운영 성능 주장",
    ]),
    implementationDetails: [
      "tenant isolation은 organization 단위 경계와 API Key 인증 흐름으로 설명합니다.",
      "중복 요청은 예외가 아니라 정상 입력으로 보고 request hash mismatch 같은 conflict를 별도로 다룹니다.",
      "ledger는 수정 가능한 잔액 컬럼보다 append-only 기록과 invariant 검증을 중심으로 설명합니다.",
    ],
    limitations: [
      "invoice scheduler 또는 Spring Batch, refund reversal ledger, strict quota reservation은 보강 예정입니다.",
      "k6 mixed usage benchmark, dashboard, alerting, tracing, SLO는 공개 측정 결과가 생긴 뒤에만 measured로 올립니다.",
    ],
    interviewQuestions: [
      "API Key 원문을 저장하지 않으면 인증은 어떻게 수행하나요?",
      "Webhook duplicate와 conflict는 어떤 기준으로 구분하나요?",
      "append-only ledger가 있어도 정산 중복 집계는 어디서 막아야 하나요?",
    ],
    diagram: {
      title: "멀티테넌트 과금 정합성 흐름",
      summary:
        "API Key 인증, usage idempotency, invoice/webhook 처리, append-only ledger를 tenant 경계 안에서 검증합니다.",
      nodes: [
        {
          id: "client",
          label: "Tenant Client",
          description: "API Key로 사용량 요청을 보냅니다.",
          kind: "client",
        },
        {
          id: "gateway",
          label: "Usage Gateway",
          description: "API Key hash 인증과 tenant 경계를 확인합니다.",
          kind: "gateway",
        },
        {
          id: "usage",
          label: "Usage Event",
          description: "중복 입력을 idempotency 기준으로 처리합니다.",
          kind: "service",
          markers: ["transaction"],
        },
        {
          id: "invoice",
          label: "Invoice",
          description: "tenant별 사용량을 청구 단위로 묶습니다.",
          kind: "service",
        },
        {
          id: "webhook",
          label: "Payment Webhook",
          description: "duplicate/conflict를 구분합니다.",
          kind: "external",
          markers: ["failure"],
        },
        {
          id: "ledger",
          label: "Append-only Ledger",
          description: "금액 변경 이력의 최종 기준 데이터입니다.",
          kind: "ledger",
          markers: ["source"],
        },
        {
          id: "audit",
          label: "Audit Log",
          description: "보안/정산 판단 근거를 남깁니다.",
          kind: "database",
          markers: ["source"],
        },
        {
          id: "benchmark",
          label: "Mixed Usage Benchmark",
          description: "혼합 사용량 부하 테스트는 추가 측정 예정입니다.",
          kind: "worker",
          markers: ["pending"],
        },
      ],
      edges: [
        {
          id: "auth",
          from: "client",
          to: "gateway",
          label: "API Key 인증",
        },
        {
          id: "record-usage",
          from: "gateway",
          to: "usage",
          label: "사용량 기록",
          markers: ["transaction"],
        },
        {
          id: "invoice",
          from: "usage",
          to: "invoice",
          label: "청구 대상 집계",
        },
        {
          id: "payment",
          from: "invoice",
          to: "webhook",
          label: "결제 결과 수신",
          markers: ["failure"],
        },
        {
          id: "ledger",
          from: "webhook",
          to: "ledger",
          label: "원장 기록",
          markers: ["source"],
        },
        {
          id: "audit",
          from: "ledger",
          to: "audit",
          label: "감사 로그",
          markers: ["source"],
        },
        {
          id: "pending-benchmark",
          from: "usage",
          to: "benchmark",
          label: "성능 claim 분리",
          markers: ["pending"],
        },
      ],
    },
  },
  {
    slug: "borrowme-product-list-n-plus-one",
    title: "상품 목록 조회 N+1을 제거해 p95 1,010ms→23ms, 쿼리 201회→3회 개선",
    projectSlug: "borrow-me",
    domain: "대여 서비스 / 조회 성능",
    resumeLine:
      "BorrowMe 상품 목록 조회의 N+1을 제거해 p95 1,010ms→23ms, 쿼리 201회→3회로 개선하고 동시 예약 재고 초과를 방지했습니다.",
    problem: [
      "상품 목록 조회에서 연관 데이터 접근이 반복되며 p95 응답 시간이 1초 수준까지 늘어났습니다.",
      "목록 API는 서비스 첫 화면과 가까워 조회 지연이 사용자 경험에 직접 영향을 줬습니다.",
      "팀 프로젝트에서는 성능 개선과 예약 정합성 의사결정을 짧은 시간 안에 공유해야 했습니다.",
    ],
    solution: [
      "상품 목록 조회의 N+1 접근을 제거해 필요한 조회를 3회 쿼리로 줄였습니다.",
      "p95 응답 시간과 쿼리 수를 개선 전후로 기록해 결과 중심으로 설명할 수 있게 했습니다.",
      "동시 예약 재고 초과 방지는 별도 정합성 검증 항목으로 분리했습니다.",
    ],
    result: [
      "상품 목록 p95 응답 시간을 1,010ms에서 23ms로 개선했습니다.",
      "쿼리 수를 201회에서 3회로 줄였습니다.",
      "동시 예약 재고 초과 방지를 시나리오로 검증했습니다.",
    ],
    evidence: evidenceSet("borrow-me", [
      "상품 목록 p95",
      "쿼리 수",
      "예약 정합성",
    ]),
    measurement: {
      scenarios: [
        {
          label: "조회 API 시나리오",
          value: "상품 목록 조회 API 개선 전후 비교",
        },
        {
          label: "쿼리 수 변화",
          value: "201 queries -> 3 queries",
        },
      ],
    },
    implementationDetails: [
      "이 사례는 백엔드 기본기인 조회 병목 발견과 N+1 제거를 대표 사례로 분리합니다.",
      "팀 프로젝트 맥락은 협업과 의사결정 설명에 쓰고, 수치는 상품 목록 조회 개선에 집중합니다.",
      "예약 정합성은 Concert Booking보다 낮은 위계의 검증 사례로 연결합니다.",
    ],
    limitations: [
      "해커톤 팀 프로젝트 특성상 장기 운영 지표보다 개선 전후 수치와 협업 맥락에 초점을 둡니다.",
      "병목 분석 세부 환경은 공개 가능한 값이 확인될 때만 추가합니다.",
    ],
    interviewQuestions: [
      "N+1을 발견한 계기와 쿼리 수를 줄인 방식은 무엇인가요?",
      "p95가 평균 응답 시간보다 이 사례에서 더 중요한 이유는 무엇인가요?",
      "팀 프로젝트에서 성능 개선 우선순위는 어떻게 합의했나요?",
    ],
    diagram: {
      title: "상품 목록 조회 개선 흐름",
      summary:
        "상품 목록 API의 반복 조회 경로를 줄여 p95 응답 시간과 쿼리 수를 개선한 흐름입니다.",
      nodes: [
        {
          id: "client",
          label: "Client",
          description: "상품 목록 화면을 요청합니다.",
          kind: "client",
        },
        {
          id: "api",
          label: "Product List API",
          description: "상품 목록과 필요한 연관 정보를 응답합니다.",
          kind: "service",
        },
        {
          id: "before",
          label: "Before",
          description: "반복 조회로 201 queries가 발생했습니다.",
          kind: "service",
        },
        {
          id: "after",
          label: "After",
          description: "조회 경로를 정리해 3 queries로 줄였습니다.",
          kind: "service",
        },
        {
          id: "mysql",
          label: "MySQL",
          description: "상품과 예약 상태의 기준 데이터입니다.",
          kind: "database",
          markers: ["source"],
        },
        {
          id: "reservation",
          label: "Reservation Consistency",
          description: "동시 예약 재고 초과를 방지합니다.",
          kind: "transaction",
          markers: ["transaction"],
        },
      ],
      edges: [
        {
          id: "request",
          from: "client",
          to: "api",
          label: "상품 목록 조회",
        },
        {
          id: "before-path",
          from: "api",
          to: "before",
          label: "개선 전 반복 조회",
        },
        {
          id: "after-path",
          from: "api",
          to: "after",
          label: "개선 후 조회 축소",
        },
        {
          id: "db-read",
          from: "after",
          to: "mysql",
          label: "3회 쿼리",
          markers: ["source"],
        },
        {
          id: "reservation-check",
          from: "api",
          to: "reservation",
          label: "예약 정합성 검증",
          markers: ["transaction"],
        },
      ],
    },
  },
];

export const legacyCaseStudyAliases: Record<string, string> = {
  "concert-booking": "concert-seat-overselling-consistency",
  "realtime-chat": "chat-room-n-plus-one-rps",
  "ai-usage-billing-gateway": "billing-idempotency-webhook-ledger",
  "msa-shop": "/projects#msa-shop",
};

export const featuredPortfolioProjectSlugs = Array.from(
  new Set(
    featuredPortfolioCases.map((portfolioCase) => portfolioCase.projectSlug),
  ),
);

export function isFeaturedPortfolioProject(projectSlug: string) {
  return featuredPortfolioProjectSlugs.includes(projectSlug);
}

export function getSupportingProjects<TProject extends { slug: string }>(
  projects: TProject[],
) {
  return projects.filter(
    (project) => !isFeaturedPortfolioProject(project.slug),
  );
}

export function getPortfolioCaseBySlug(slug: string) {
  return featuredPortfolioCases.find(
    (portfolioCase) => portfolioCase.slug === slug,
  );
}
