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

export type PortfolioArchitectureSummary = {
  sourceOfTruth?: string;
  transactionBoundary?: string;
  asyncBoundary?: string;
  failureRecoveryPath?: string;
  designReason?: string;
};

export type PortfolioProblemArchitecture = {
  imageSrc: string;
  alt: string;
  caption: string;
  sourceFile: string;
  readingGuide: string[];
};

export type PortfolioStateTransition = {
  from: string;
  to: string;
  description: string;
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

export type PortfolioVisualDiagramNode = {
  id: string;
  label: string;
  description?: string;
  markers?: PortfolioDiagramMarker[];
};

export type PortfolioVisualDiagramEdge = {
  from: string;
  to: string;
  label: string;
  markers?: PortfolioDiagramMarker[];
};

export type PortfolioBeforeAfterItem = {
  label: string;
  value?: string;
  markers?: PortfolioDiagramMarker[];
};

export type PortfolioBeforeAfterColumn = {
  title: string;
  items: PortfolioBeforeAfterItem[];
};

export type PortfolioVisualDiagram =
  | {
      type: "flow";
      title: string;
      summary?: string;
      nodes: PortfolioVisualDiagramNode[];
      edges: PortfolioVisualDiagramEdge[];
    }
  | {
      type: "before-after";
      title: string;
      summary?: string;
      before: PortfolioBeforeAfterColumn;
      after: PortfolioBeforeAfterColumn;
    }
  | {
      type: "state-machine";
      title: string;
      summary?: string;
      states: string[];
      transitions: PortfolioVisualDiagramEdge[];
    };

export type PortfolioCase = {
  slug: string;
  title: string;
  projectSlug: string;
  domain: string;
  resumeLine: string;
  architectureSummary: PortfolioArchitectureSummary;
  problemArchitecture: PortfolioProblemArchitecture;
  problem: string[];
  solution: string[];
  result: string[];
  evidence: ProjectEvidence[];
  primaryEvidenceLabels?: string[];
  referenceEvidenceLabels?: string[];
  referenceEvidenceTitle?: string;
  additionalEvidenceLabels?: string[];
  additionalEvidenceTitle?: string;
  measurement?: PortfolioCaseMeasurement;
  implementationDetails: string[];
  stateTransitions?: PortfolioStateTransition[];
  limitations: string[];
  interviewQuestions: string[];
  visualDiagram: PortfolioVisualDiagram;
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
      "동일 좌석 100개 동시 예매 요청에서 Queue Token·좌석 락·Idempotency로 오버셀링 0건 검증",
    projectSlug: "concert-booking",
    domain: "콘서트 예매 / 예약 정합성",
    resumeLine:
      "동일 좌석 100개 동시 예매 요청에서 Queue Token, 좌석 락, Idempotency-Key로 success 1, fail 99, overselling 0을 검증했습니다.",
    architectureSummary: {
      sourceOfTruth: "PostgreSQL Reservation / Seat 상태",
      transactionBoundary:
        "Reservation Transaction 안에서 Idempotency-Key 확인, Seat Lock, Reservation Insert, Outbox Insert를 처리합니다.",
      asyncBoundary: "Outbox Table -> Kafka 발행 구간",
      failureRecoveryPath:
        "Consumer 실패 시 DLT로 격리하고, Redis stock 불일치는 Reconciliation Job으로 복구합니다.",
      designReason:
        "Redis는 빠른 경합 제어와 대기열에는 적합하지만 최종 기준 데이터로 두면 복구 기준이 흐려지므로 PostgreSQL을 최종 기준 데이터로 유지했습니다.",
    },
    problemArchitecture: {
      imageSrc: "/architecture/cases/concert-seat-overselling-consistency.svg",
      alt: "동일 좌석 예매 경합에서 Queue token, Reservation transaction, Outbox, Kafka, DLT, PostgreSQL 복구 기준을 연결한 문제 구간 아키텍처",
      caption:
        "동일 좌석 요청을 트랜잭션 경계와 비동기 발행 경계로 나누고 PostgreSQL을 좌석/예약의 최종 기준 데이터로 둔 구조입니다.",
      sourceFile:
        "public/architecture/cases/concert-seat-overselling-consistency.svg",
      readingGuide: [
        "왼쪽의 Client/Queue token은 대기열 우회 요청을 제한하는 진입 경계입니다.",
        "가운데 Reservation transaction에서 Idempotency-Key, Seat lock, Reservation insert, Outbox insert가 같은 commit 경계에 묶입니다.",
        "오른쪽의 Kafka/Consumer/DLT와 하단 Reconciliation은 발행 실패와 Redis 보조 상태 불일치를 PostgreSQL 기준으로 복구하는 경로입니다.",
      ],
    },
    problem: [
      "동일 좌석에 여러 사용자가 동시에 접근하면 읽기-수정-쓰기 사이 race condition으로 오버셀링이 발생할 수 있었습니다.",
      "네트워크 timeout과 client retry는 중복 예약 또는 중복 결제로 이어질 수 있었습니다.",
      "Redis 재고와 DB 예약 상태가 어긋날 때 어떤 데이터를 최종 기준 데이터로 삼아 복구할지 명확해야 했습니다.",
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
          label: "동일 좌석 경합 측정 조건",
          value:
            "동일 좌석 100 concurrent requests -> success 1, fail 99, overselling 0",
        },
        {
          label: "분산 좌석 예약 측정 조건",
          value:
            "서로 다른 좌석 50명 동시 예약 -> pessimistic 50/50, Redis distributed lock 50/50",
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
    visualDiagram: {
      type: "flow",
      title: "동일 좌석 예매 요청 흐름",
      summary:
        "동일 좌석 요청을 대기열, 예약 transaction, Outbox, Kafka, 복구 경로로 분리해 좌석 상태를 PostgreSQL 기준으로 설명합니다.",
      nodes: [
        {
          id: "client",
          label: "Client",
          description: "동일 좌석 예약 요청",
        },
        {
          id: "queue",
          label: "Queue Token",
          description: "userId + scheduleId 검증",
        },
        {
          id: "reservation",
          label: "Reservation Transaction",
          description: "Idempotency-Key / Seat Lock / Reservation Insert",
          markers: ["transaction"],
        },
        {
          id: "outbox",
          label: "Outbox Table",
          description: "이벤트 발행 의도 저장",
          markers: ["source"],
        },
        {
          id: "kafka",
          label: "Kafka",
          description: "예약/만료 이벤트 발행",
          markers: ["async"],
        },
        {
          id: "consumer",
          label: "Consumer + DLT",
          description: "중복 소비 흡수 / 실패 격리",
          markers: ["failure"],
        },
        {
          id: "postgres",
          label: "PostgreSQL",
          description: "좌석·예약 최종 기준 데이터",
          markers: ["source"],
        },
        {
          id: "reconciliation",
          label: "Redis Reconciliation",
          description: "Redis 보조 상태를 DB 기준으로 복구",
          markers: ["failure"],
        },
      ],
      edges: [
        { from: "client", to: "queue", label: "대기열 토큰 검증" },
        {
          from: "queue",
          to: "reservation",
          label: "예약 요청",
          markers: ["transaction"],
        },
        {
          from: "reservation",
          to: "outbox",
          label: "이벤트 의도 저장",
          markers: ["transaction"],
        },
        {
          from: "outbox",
          to: "kafka",
          label: "commit 이후 발행",
          markers: ["async"],
        },
        {
          from: "kafka",
          to: "consumer",
          label: "consumer 처리 / DLT 격리",
          markers: ["failure"],
        },
        {
          from: "consumer",
          to: "postgres",
          label: "상태 반영",
          markers: ["source"],
        },
        {
          from: "postgres",
          to: "reconciliation",
          label: "DB 기준 복구",
          markers: ["source", "failure"],
        },
      ],
    },
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
    architectureSummary: {
      sourceOfTruth: "Outbox 상태와 도메인 DB",
      transactionBoundary:
        "도메인 변경과 Outbox Insert를 같은 DB transaction에 기록합니다.",
      asyncBoundary: "Outbox Relay -> Kafka",
      failureRecoveryPath:
        "RETRYING/DEAD/manual replay와 consumer idempotency로 발행 실패와 소비 실패를 분리합니다.",
      designReason:
        "DB commit과 Kafka publish를 하나의 원자적 작업으로 보장할 수 없기 때문에 이벤트 발행 의도를 DB에 먼저 남겼습니다.",
    },
    problemArchitecture: {
      imageSrc: "/architecture/cases/concert-outbox-dlt-recovery.svg",
      alt: "DB commit 이후 Kafka 발행 실패를 Outbox relay, DLT, DEAD, manual replay로 분리한 복구 아키텍처",
      caption:
        "도메인 DB commit과 Kafka publish 사이의 원자성 한계를 Outbox 상태와 DLT/manual replay 경로로 분리한 구조입니다.",
      sourceFile: "public/architecture/cases/concert-outbox-dlt-recovery.svg",
      readingGuide: [
        "왼쪽 transaction은 도메인 변경과 Outbox insert가 함께 commit되는 구간입니다.",
        "Outbox relay와 Kafka 사이가 비동기 발행 경계이며 실패 시 RETRYING/DEAD 상태로 추적합니다.",
        "Consumer 실패는 DLT로 격리하고 manual replay 이후에도 consumer idempotency와 도메인 DB 기준으로 중복을 흡수합니다.",
      ],
    },
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
      "D/E/F local repeat에서 결제/만료 race, idempotency replay/conflict, 대기열 token abuse checks를 통과했습니다.",
      "Kafka publish 실패와 consumer 실패를 정상 처리 흐름 밖으로 격리할 수 있게 구조화했습니다.",
    ],
    evidence: evidenceSet("concert-booking", [
      "Testcontainers 검증 시나리오",
      "결제/만료 race·중복 요청·대기열 abuse 검증",
      "혼합 부하 테스트",
    ]),
    primaryEvidenceLabels: [
      "Testcontainers 검증 시나리오",
      "결제/만료 race·중복 요청·대기열 abuse 검증",
    ],
    measurement: {
      scenarios: [
        {
          label: "혼합 부하 시나리오",
          value: "200 VU, 45초 기준 총 RPS 약 969~1,005",
        },
        {
          label: "결제/만료 race·중복 요청·대기열 abuse 검증 조건",
          value:
            "pessimistic/optimistic/distributed 전략 x scenario-d/e/f x 3회 local repeat",
        },
      ],
    },
    implementationDetails: [
      "Outbox Table은 이벤트 발행 성공 여부와 재처리 상태를 추적하는 복구 기준으로 둡니다.",
      "DLT와 DEAD 상태는 자동 재시도로 해결되지 않는 이벤트를 운영자가 확인 가능한 대상으로 분리합니다.",
      "Redis stock은 빠른 조회를 위한 보조 상태이며, reconciliation은 PostgreSQL 기준으로 수행합니다.",
    ],
    stateTransitions: [
      {
        from: "PENDING",
        to: "PUBLISHED",
        description: "Outbox relay가 Kafka 발행에 성공한 상태",
      },
      {
        from: "PUBLISHED",
        to: "CONSUMED",
        description: "consumer idempotency를 통과해 처리 완료된 상태",
      },
      {
        from: "PENDING",
        to: "RETRYING",
        description: "일시적 발행 실패 후 재시도 대상으로 남긴 상태",
      },
      {
        from: "RETRYING",
        to: "DEAD",
        description: "자동 재시도로 복구하지 못해 격리한 상태",
      },
      {
        from: "DEAD",
        to: "MANUAL_REPLAY",
        description: "운영자 확인 후 수동 재처리 대상으로 올린 상태",
      },
      {
        from: "MANUAL_REPLAY",
        to: "PUBLISHED",
        description: "수동 재처리 이벤트가 다시 발행된 상태",
      },
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
    visualDiagram: {
      type: "state-machine",
      title: "Outbox / DLT 상태 전이",
      summary:
        "발행 성공, consumer 처리, 재시도, DEAD 격리, 수동 재처리 경로를 상태 전이로 분리합니다.",
      states: [
        "PENDING",
        "PUBLISHED",
        "CONSUMED",
        "RETRYING",
        "DEAD",
        "MANUAL_REPLAY",
      ],
      transitions: [
        {
          from: "PENDING",
          to: "PUBLISHED",
          label: "relay 성공",
          markers: ["async"],
        },
        {
          from: "PUBLISHED",
          to: "CONSUMED",
          label: "consumer 처리 성공",
          markers: ["async"],
        },
        {
          from: "PENDING",
          to: "RETRYING",
          label: "relay 실패",
          markers: ["failure"],
        },
        {
          from: "RETRYING",
          to: "DEAD",
          label: "재시도 초과",
          markers: ["failure"],
        },
        {
          from: "DEAD",
          to: "MANUAL_REPLAY",
          label: "운영자 수동 재처리",
          markers: ["failure"],
        },
        {
          from: "MANUAL_REPLAY",
          to: "PUBLISHED",
          label: "재발행 성공",
          markers: ["async"],
        },
      ],
    },
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
    architectureSummary: {
      sourceOfTruth: "Message / Room / Participant DB",
      transactionBoundary: "읽기 전용 조회 경로",
      designReason:
        "대표 문제는 실시간 전송이 아니라 채팅방 조회 API의 N+1이므로 전체 채팅 구조보다 조회 경로 Before/After를 중심으로 표현했습니다.",
    },
    problemArchitecture: {
      imageSrc: "/architecture/cases/chat-room-n-plus-one-rps.svg",
      alt: "채팅방 조회 API의 2N+1 쿼리 경로를 1회 조회 경로로 줄인 Before/After 아키텍처",
      caption:
        "실시간 delivery claim과 분리해 측정된 채팅방 조회 API의 N+1 제거 구간만 Before/After로 보여주는 구조입니다.",
      sourceFile: "public/architecture/cases/chat-room-n-plus-one-rps.svg",
      readingGuide: [
        "왼쪽 Before는 채팅방 수에 따라 room, last message, read state 조회가 반복되는 경로입니다.",
        "오른쪽 After는 Chat Room API가 필요한 목록 데이터를 1회 조회/projection으로 모으는 경로입니다.",
        "WebSocket delivery, reconnect sync, production/mixed benchmark는 별도 측정 항목으로 분리해 표시합니다.",
      ],
    },
    problem: [
      "채팅방 목록 조회에서 방 수에 비례해 쿼리가 늘어나 API 응답 시간이 악화될 수 있었습니다.",
      "실시간 채팅 프로젝트라도 사용자는 먼저 방 목록 조회와 재접속 동기화 API에서 지연을 경험합니다.",
      "WebSocket 연결 성공과 실제 메시지 전달 지연은 다른 지표이므로 성능 claim을 분리해야 했습니다.",
    ],
    solution: [
      "채팅방 조회 경로의 N+1 쿼리를 제거해 필요한 데이터를 1회 쿼리로 조회하도록 재구성했습니다.",
      "조회 API 개선 수치, WebSocket 연결 스모크 테스트, 50/500/1,000-user receiver matrix local scenario, by-room denominator guard를 서로 다른 근거 상태로 분리했습니다.",
      "send-to-receive latency와 delivery completeness는 local scenario와 production/mixed benchmark를 분리해 과장을 피했습니다.",
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
      "메시지 전달 지연 시간 로컬 스냅샷",
      "WebSocket 전달 완전성 로컬 스냅샷",
      "Room-global ordering 로컬 진단",
      "Receiver matrix by-room guard",
      "Mixed HTTP probe artifact 분리 검산",
      "Mixed traffic local scenario",
      "Delivery evidence validator",
      "Mixed traffic p95 latency",
      "Production delivery benchmark",
    ]),
    primaryEvidenceLabels: [
      "채팅방 조회 API RPS",
      "p95 응답 시간",
      "N+1 쿼리 제거",
    ],
    measurement: {
      scenarios: [
        {
          label: "채팅방 조회 API RPS/p95 개선 조건",
          value: "RPS 937 -> 1,598, p95 212.85ms -> 149.22ms",
        },
        {
          label: "채팅방 조회 N+1 제거 쿼리 수 변화",
          value: "2N+1 queries -> 1 query",
        },
        {
          label: "메시지 전달 로컬 스냅샷",
          value:
            "50-user repeat3 p95 23-38ms, 500-user repeat3 p95 37-47ms, 1,000-user repeat3 p95 45-50ms",
        },
        {
          label: "WebSocket 전달 완전성 로컬 스냅샷",
          value:
            "50-user repeat3 expected 4,900 / unique 4,900, 500-user repeat3 expected 49,900 / unique 49,900, 1,000-user repeat3 expected 99,900 / unique 99,900, missing 0 / duplicate 0 / completeness 100%",
        },
        {
          label: "Room-global ordering 로컬 진단",
          value:
            "1,000-user repeat3 persisted message id 기준 room-global out-of-order 0",
        },
        {
          label: "Mixed traffic local scenario",
          value:
            "10 rooms x 50 users repeat3 + mixed HTTP probes: unique 4,900/4,900, missing 0, duplicate 0, receiver p95 18-20ms, mixed HTTP failed 0/30/run",
        },
        {
          label: "Room별 delivery matrix guard",
          value:
            "summary.byRoom denominator + cross-room unexpected delivery deterministic fixture",
        },
      ],
    },
    implementationDetails: [
      "조회 성능 사례는 WebSocket delivery 성능과 분리해 API 병목 개선으로 설명합니다.",
      "채팅방 목록 조회는 N+1 제거와 fetch/projection 전략을 중심으로 답변할 수 있게 정리했습니다.",
      "WebSocket delivery와 mixed traffic 세부 artifact는 GitHub README/docs 근거로 분리했습니다.",
    ],
    limitations: [
      "50/500/1,000-user receiver matrix는 local scenario evidence이므로 production/mixed benchmark나 운영 성능 주장으로 사용하지 않습니다.",
      "10 rooms x 50 users mixed traffic scenario도 local single app evidence이며, production multi-instance mixed benchmark나 cache-hit claim으로 사용하지 않습니다.",
      "다중 인스턴스 환경의 reconnect 후 누락 메시지 복구율은 추가 측정 예정입니다.",
    ],
    interviewQuestions: [
      "N+1 쿼리가 어떤 엔티티 관계에서 발생했고 어떻게 1회로 줄였나요?",
      "채팅방 조회 API 성능과 실시간 메시지 전달 지연은 왜 별도 지표인가요?",
      "roomId key ordering은 Kafka partition과 어떤 관계가 있나요?",
    ],
    visualDiagram: {
      type: "before-after",
      title: "채팅방 조회 API 개선 전후",
      summary:
        "실시간 delivery claim과 분리해, 측정된 조회 API 병목 개선을 쿼리 수와 응답 지표로 보여줍니다.",
      before: {
        title: "Before",
        items: [
          { label: "Chat Room API" },
          { label: "2N+1 queries", markers: ["failure"] },
          { label: "937 RPS" },
          { label: "p95 212.85ms" },
        ],
      },
      after: {
        title: "After",
        items: [
          { label: "Chat Room API" },
          { label: "1 query", markers: ["source"] },
          { label: "1,598 RPS" },
          { label: "p95 149.22ms" },
        ],
      },
    },
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
    architectureSummary: {
      sourceOfTruth: "Usage Event, Invoice, Append-only Ledger",
      transactionBoundary: "usage idempotency와 ledger insert 경계",
      asyncBoundary: "payment webhook / invoice 처리 흐름",
      failureRecoveryPath: "webhook duplicate/conflict 처리와 audit log",
      designReason:
        "과금 시스템은 중복 요청과 webhook 재전송이 정상 입력이므로 중복을 예외가 아니라 설계 대상으로 처리했습니다.",
    },
    problemArchitecture: {
      imageSrc: "/architecture/cases/billing-idempotency-webhook-ledger.svg",
      alt: "멀티테넌트 과금에서 API key hash 인증, usage idempotency, invoice, webhook duplicate/conflict, append-only ledger를 연결한 아키텍처",
      caption:
        "tenant 경계 안에서 usage 중복 처리와 webhook 재전송을 설계 대상으로 보고 append-only ledger와 audit log로 이어지는 구조입니다.",
      sourceFile:
        "public/architecture/cases/billing-idempotency-webhook-ledger.svg",
      readingGuide: [
        "왼쪽 API Key 인증은 raw key를 저장하지 않고 prefix/hash로 tenant 경계를 확인합니다.",
        "Usage event와 quota reservation은 중복 요청을 idempotency key와 request hash 기준으로 처리하는 구간입니다.",
        "Invoice/webhook 이후 append-only ledger와 audit log가 정산 판단과 감사 근거를 남기는 최종 기준 데이터 역할을 합니다.",
      ],
    },
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
      "API Key 저장 방식, 사용량 중복 처리, quota reservation, invoice scheduler, Webhook 중복 처리, refund reversal ledger를 시나리오로 검증했습니다.",
      "Audit metadata sanitizer로 민감 metadata redaction 경계를 unit test로 검증했습니다.",
      "혼합 사용량 부하 테스트는 2026-05-23 local full mixed repeat3에서 checks 150/150/run, HTTP failure 0/150/run을 기록했습니다.",
    ],
    evidence: evidenceSet("ai-usage-billing-gateway", [
      "API Key 저장 방식",
      "사용량 중복 처리",
      "Webhook 중복 처리",
      "Append-only Ledger 불변성",
      "Quota reservation",
      "Monthly invoice scheduler",
      "Refund reversal ledger",
      "Full mixed smoke readiness guard",
      "Full mixed capture rollup guard",
      "Low-cardinality outcome counters",
      "Audit metadata sanitizer",
      "혼합 사용량 부하 테스트",
      "운영 성능 주장",
    ]),
    primaryEvidenceLabels: [
      "API Key 저장 방식",
      "사용량 중복 처리",
      "Webhook 중복 처리",
      "Refund reversal ledger",
      "혼합 사용량 부하 테스트",
    ],
    implementationDetails: [
      "tenant isolation은 organization 단위 경계와 API Key 인증 흐름으로 설명합니다.",
      "중복 요청은 예외가 아니라 정상 입력으로 보고 request hash mismatch 같은 conflict를 별도로 다룹니다.",
      "quota, scheduler, audit/counter guard 세부는 GitHub README/docs 근거로 분리했습니다.",
    ],
    limitations: [
      "invoice scheduler, quota reservation, refund reversal ledger는 시나리오 검증 상태이며 회계 compliance claim은 하지 않습니다.",
      "local full mixed repeat3는 운영 성능 claim이 아니며, dashboard, alerting, tracing, SLO는 공개 운영 근거가 생긴 뒤에만 측정 완료로 올립니다.",
      "quota reconciliation job, dashboard, alert rule은 운영 보강 지점으로 남겨두었습니다.",
    ],
    interviewQuestions: [
      "API Key 원문을 저장하지 않으면 인증은 어떻게 수행하나요?",
      "Webhook duplicate와 conflict는 어떤 기준으로 구분하나요?",
      "append-only ledger가 있어도 정산 중복 집계는 어디서 막아야 하나요?",
    ],
    visualDiagram: {
      type: "flow",
      title: "멀티테넌트 사용량 과금 흐름",
      summary:
        "API Key 인증부터 usage idempotency, webhook 중복 처리, append-only ledger, audit log까지 tenant 경계 안에서 연결합니다.",
      nodes: [
        {
          id: "client",
          label: "Client",
          description: "tenant 사용량 요청",
        },
        {
          id: "api-key",
          label: "API Key",
          description: "raw value 1회 반환 / hash 저장",
        },
        {
          id: "gateway",
          label: "Usage Gateway",
          description: "tenant isolation / 인증",
          markers: ["transaction"],
        },
        {
          id: "usage",
          label: "Usage Event",
          description: "사용량 중복 처리",
          markers: ["transaction"],
        },
        {
          id: "invoice",
          label: "Invoice",
          description: "tenant별 청구 단위",
        },
        {
          id: "webhook",
          label: "Webhook",
          description: "duplicate / conflict 구분",
          markers: ["failure"],
        },
        {
          id: "ledger",
          label: "Append-only Ledger",
          description: "ledger invariant 검증",
          markers: ["source"],
        },
        {
          id: "audit",
          label: "Audit Log",
          description: "감사 가능성 확보",
          markers: ["source"],
        },
      ],
      edges: [
        { from: "client", to: "api-key", label: "API Key 제출" },
        {
          from: "api-key",
          to: "gateway",
          label: "hash 인증",
          markers: ["transaction"],
        },
        {
          from: "gateway",
          to: "usage",
          label: "usage idempotency",
          markers: ["transaction"],
        },
        { from: "usage", to: "invoice", label: "청구 집계" },
        {
          from: "invoice",
          to: "webhook",
          label: "결제 이벤트 처리",
          markers: ["failure"],
        },
        {
          from: "webhook",
          to: "ledger",
          label: "append-only 기록",
          markers: ["source"],
        },
        {
          from: "ledger",
          to: "audit",
          label: "감사 로그",
          markers: ["source"],
        },
      ],
    },
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
          label: "Local Repeat3 Evidence",
          description: "5 VU, 30s, repeat3 branch mix를 검증합니다.",
          kind: "worker",
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
          label: "local repeat3 측정",
        },
      ],
    },
  },
  {
    slug: "borrowme-product-list-n-plus-one",
    title: "상품 목록 조회 N+1 개선 원본 기록을 현재 query-count guard로 검증",
    projectSlug: "borrow-me",
    domain: "대여 서비스 / 조회 성능",
    resumeLine:
      "BorrowMe 상품 목록 조회 N+1 개선 원본 기록과 현재 clean repeat3 snapshot을 분리하고, query-count guard와 예약 정합성 테스트로 회귀를 검증했습니다.",
    architectureSummary: {
      sourceOfTruth: "Product / Image / Reservation DB",
      transactionBoundary: "읽기 전용 조회 경로",
      designReason:
        "상품 목록 조회의 병목은 전체 시스템 구조가 아니라 데이터 접근 경로였으므로 Before/After 조회 아키텍처로 표현했습니다.",
    },
    problemArchitecture: {
      imageSrc: "/architecture/cases/borrowme-product-list-n-plus-one.svg",
      alt: "BorrowMe 상품 목록 API의 201회 조회 원본 기록과 현재 3회 query-count guard를 분리한 Before/After 아키텍처",
      caption:
        "원본 README 성능 기록과 현재 repository query-count guard를 분리해 상품 목록 조회 병목 개선 구간을 보여주는 구조입니다.",
      sourceFile:
        "public/architecture/cases/borrowme-product-list-n-plus-one.svg",
      readingGuide: [
        "왼쪽 Before는 상품 목록에서 이미지, 예약, 팔로우 관련 조회가 반복되는 병목 구간입니다.",
        "오른쪽 After는 상품 목록 데이터를 batch/join/projection으로 모으고 query-count guard로 회귀를 막는 경로입니다.",
        "예약 정합성 검증은 조회 최적화와 별도 흐름이지만 같은 MySQL 기준 데이터 위에서 확인합니다.",
      ],
    },
    problem: [
      "상품 목록 조회에서 연관 데이터 접근이 반복되며 p95 응답 시간이 1초 수준까지 늘어났습니다.",
      "목록 API는 서비스 첫 화면과 가까워 조회 지연이 사용자 경험에 직접 영향을 줬습니다.",
      "팀 프로젝트에서는 성능 개선과 예약 정합성 의사결정을 짧은 시간 안에 공유해야 했습니다.",
    ],
    solution: [
      "상품 목록 조회의 N+1 접근을 제거해 필요한 조회를 3회 쿼리로 줄였습니다.",
      "p95 응답 시간과 쿼리 수는 원본 README 기록으로 분리하고, 현재 repo에서는 query-count guard로 회귀를 막습니다.",
      "동시 예약 재고 초과 방지는 별도 정합성 검증 항목으로 분리했습니다.",
    ],
    result: [
      "원본 README 기록 기준 상품 목록 p95 응답 시간은 1,010ms에서 23ms로 개선됐습니다.",
      "2026-05-23 clean repeat3 local k6 snapshot에서는 p95 358.1088ms, HTTP failure rate 0을 기록했습니다.",
      "원본 README 기록과 현재 query-count guard 기준 쿼리 수는 201회에서 3회로 정리됩니다.",
      "동시 예약 재고 초과 방지, follow lookup SQL 1회, 인증 상품 목록 팔로우 여부 응답, ranking data path SQL 5회 이하, ranking model assembly SQL 6회 이하, exercise hashtag SQL 1회, Flyway baseline schema validation을 시나리오로 검증했습니다.",
    ],
    evidence: evidenceSet("borrow-me", [
      "상품 목록 p95 원본 기록",
      "상품 목록 현재 재측정 snapshot",
      "상품 목록 쿼리 수 원본 기록 + 현재 guard",
      "Follow lookup query-count guard",
      "Authenticated product-list follow-aware guard",
      "Ranking data path query-count guard",
      "Ranking HTTP model assembly guard",
      "Exercise hashtag query-count guard",
      "예약 정합성",
      "Flyway baseline validation",
    ]),
    primaryEvidenceLabels: [
      "상품 목록 현재 재측정 snapshot",
      "상품 목록 쿼리 수 원본 기록 + 현재 guard",
      "예약 정합성",
    ],
    referenceEvidenceTitle: "참고 기록",
    referenceEvidenceLabels: ["상품 목록 p95 원본 기록"],
    measurement: {
      scenarios: [
        {
          label: "상품 목록 p95 원본 기록",
          value: "참고 기록 · raw artifact 없음 · 현재 측정 완료 claim 아님",
        },
        {
          label: "상품 목록 현재 재측정 snapshot",
          value:
            "p95 358.1088ms · HTTP failure 0 · checks 10,683/10,683 (local)",
        },
        {
          label: "상품 목록 쿼리 수 원본 기록 + 현재 guard",
          value:
            "원본 README 기록 201 queries + 현재 repository guard 3 queries 이하",
        },
        {
          label: "Follow lookup query-count guard",
          value:
            "FollowService.getFollowedUserIds 후보 사용자 팔로우 조회 SQL 1회",
        },
        {
          label: "Authenticated product-list follow-aware guard",
          value:
            "인증 GET /api/products 응답에서 팔로우 여부 true/false와 SQL 5회 이하",
        },
        {
          label: "Ranking data path query-count guard",
          value: "상위 사용자, 최근 상품, 팔로우 여부 조회 조합 SQL 5회 이하",
        },
        {
          label: "Ranking HTTP model assembly guard",
          value:
            "GET /ranking handler/model assembly에서 topUsers/currentUser/recentProducts/followed flag 구성과 SQL 6회 이하",
        },
        {
          label: "Exercise hashtag query-count guard",
          value: "운동 추천/검색 응답의 exercise hashtag DTO 변환 SQL 1회",
        },
        {
          label: "Flyway baseline validation",
          value:
            "V1 baseline schema migration + MySQL Testcontainers + Hibernate validate",
        },
      ],
    },
    implementationDetails: [
      "이 사례는 백엔드 기본기인 조회 병목 발견과 N+1 제거를 대표 사례로 분리합니다.",
      "팀 프로젝트 맥락은 협업과 의사결정 설명에 쓰고, 수치는 원본 기록과 현재 query-count guard의 경계를 함께 표시합니다.",
      "follow/ranking/Flyway guard 세부는 GitHub README/docs 근거로 분리했습니다.",
    ],
    limitations: [
      "p95 1,010ms→23ms와 쿼리 201회→3회는 원본 README 기록이며, raw artifact가 없어 현재 재측정값처럼 주장하지 않습니다.",
      "병목 분석 세부 환경은 공개 가능한 값이 확인될 때만 추가합니다.",
    ],
    interviewQuestions: [
      "N+1을 발견한 계기와 쿼리 수를 줄인 방식은 무엇인가요?",
      "p95가 평균 응답 시간보다 이 사례에서 더 중요한 이유는 무엇인가요?",
      "팀 프로젝트에서 성능 개선 우선순위는 어떻게 합의했나요?",
    ],
    visualDiagram: {
      type: "before-after",
      title: "상품 목록 조회 개선 전후",
      summary:
        "원본 README 기록의 Before/After 수치와 현재 query-count guard의 경계를 함께 보여줍니다.",
      before: {
        title: "Before",
        items: [
          { label: "Product List API" },
          { label: "201 queries (원본 기록)", markers: ["failure"] },
          { label: "p95 1,010ms (원본 기록)" },
        ],
      },
      after: {
        title: "After",
        items: [
          { label: "Product List API" },
          { label: "3 queries 이하 (현재 guard)", markers: ["source"] },
          { label: "p95 23ms (원본 기록)" },
        ],
      },
    },
    diagram: {
      title: "상품 목록 조회 개선 흐름",
      summary:
        "상품 목록 API의 반복 조회 경로를 줄이고 현재 query-count guard로 회귀를 막는 흐름입니다.",
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
          description:
            "원본 README 기록상 반복 조회로 201 queries가 발생했습니다.",
          kind: "service",
        },
        {
          id: "after",
          label: "After",
          description:
            "현재 repository guard는 조회 경로가 3 queries 이하인지 확인합니다.",
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

export type ProjectArchitectureSummary = {
  projectSlug: string;
  caseSlug: string;
  flow: string;
};

export type FeaturedProjectGroupCase = {
  caseSlug: string;
  label: string;
  summary: string;
  actionLabel: string;
};

export type FeaturedProjectGroup = {
  projectSlug: string;
  title: string;
  subtitle: string;
  description: string;
  caseSlugs: string[];
  cases: PortfolioCase[];
  caseLinks: FeaturedProjectGroupCase[];
  primaryEvidence: ProjectEvidence[];
  techStack: string[];
  repoUrl: string;
  project: Project;
};

export const projectArchitectureSummaries: ProjectArchitectureSummary[] = [
  {
    projectSlug: "concert-booking",
    caseSlug: "concert-seat-overselling-consistency",
    flow: "Client -> Queue Token -> Reservation Transaction -> Outbox -> Kafka -> Consumer/DLT -> PostgreSQL",
  },
  {
    projectSlug: "realtime-chat",
    caseSlug: "chat-room-n-plus-one-rps",
    flow: "Client -> Chat Room API -> Optimized Query/Projection -> Message/Room DB -> Response",
  },
  {
    projectSlug: "ai-usage-billing-gateway",
    caseSlug: "billing-idempotency-webhook-ledger",
    flow: "Client/API Key -> Usage Gateway -> Usage Event -> Invoice/Webhook -> Append-only Ledger/Audit",
  },
  {
    projectSlug: "borrow-me",
    caseSlug: "borrowme-product-list-n-plus-one",
    flow: "Product List API -> Batch/Join/Projection 조회 -> Product/Image/Reservation DB -> Response",
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

const featuredProjectGroupDefinitions = [
  {
    projectSlug: "concert-booking",
    description:
      "동일 좌석 경합과 DB commit 이후 Kafka 발행 실패를 각각 동시성 정합성, 이벤트 복구 deep dive로 분리했습니다.",
    caseLinks: [
      {
        caseSlug: "concert-seat-overselling-consistency",
        label: "좌석 오버셀링 0건 검증",
        summary:
          "동일 좌석 100개 동시 요청에서 success 1, fail 99, overselling 0",
        actionLabel: "좌석 정합성 보기",
      },
      {
        caseSlug: "concert-outbox-dlt-recovery",
        label: "Outbox/DLT 이벤트 복구",
        summary:
          "DB commit 이후 Kafka 발행 실패를 Outbox·DLT·수동 재처리로 복구 가능한 상태로 설계",
        actionLabel: "Outbox/DLT 보기",
      },
    ],
    primaryEvidenceLabels: ["동일 좌석 경합", "Testcontainers 검증 시나리오"],
  },
  {
    projectSlug: "realtime-chat",
    description:
      "실시간 채팅 전체 구조보다 채팅방 조회 API의 N+1 제거와 조회 성능 개선 구간을 대표 deep dive로 분리했습니다.",
    caseLinks: [
      {
        caseSlug: "chat-room-n-plus-one-rps",
        label: "채팅방 조회 API N+1 제거",
        summary: "RPS 937→1,598, p95 212.85ms→149.22ms, query 2N+1→1",
        actionLabel: "조회 성능 개선 보기",
      },
    ],
    primaryEvidenceLabels: [
      "채팅방 조회 API RPS",
      "p95 응답 시간",
      "N+1 쿼리 제거",
    ],
  },
  {
    projectSlug: "ai-usage-billing-gateway",
    description:
      "멀티테넌트 과금 흐름에서 API Key 저장, 사용량 중복 처리, Webhook 중복 처리를 하나의 정합성 deep dive로 묶었습니다.",
    caseLinks: [
      {
        caseSlug: "billing-idempotency-webhook-ledger",
        label: "과금 idempotency / webhook / ledger 검증",
        summary:
          "API Key hash 저장, usage idempotency, webhook duplicate/conflict, append-only ledger invariant 검증",
        actionLabel: "과금 정합성 보기",
      },
    ],
    primaryEvidenceLabels: [
      "API Key 저장 방식",
      "사용량 중복 처리",
      "Webhook 중복 처리",
    ],
  },
  {
    projectSlug: "borrow-me",
    description:
      "팀 프로젝트의 상품 목록 N+1 개선 원본 기록과 현재 query-count guard, clean repeat3 snapshot을 분리해 보여줍니다.",
    caseLinks: [
      {
        caseSlug: "borrowme-product-list-n-plus-one",
        label: "상품 목록 N+1 개선과 현재 guard 분리 검증",
        summary:
          "원본 기록과 현재 재측정 snapshot을 섞지 않고 query-count guard로 조회 경로 회귀를 방지",
        actionLabel: "조회 성능 개선 보기",
      },
    ],
    primaryEvidenceLabels: [
      "상품 목록 p95 원본 기록",
      "상품 목록 현재 재측정 snapshot",
      "상품 목록 쿼리 수 원본 기록 + 현재 guard",
    ],
  },
] as const;

export function getPortfolioCasesByProjectSlug(projectSlug: string) {
  return featuredPortfolioCases.filter(
    (portfolioCase) => portfolioCase.projectSlug === projectSlug,
  );
}

export function getPortfolioCaseProjectBadge(portfolioCase: PortfolioCase) {
  const project = requireProject(portfolioCase.projectSlug);
  const projectCases = getPortfolioCasesByProjectSlug(
    portfolioCase.projectSlug,
  );

  if (projectCases.length <= 1) {
    return project.title;
  }

  const deepDiveIndex = projectCases.findIndex(
    (item) => item.slug === portfolioCase.slug,
  );

  return `${project.title} · Deep Dive ${deepDiveIndex + 1}/${projectCases.length}`;
}

export const featuredProjectGroups: FeaturedProjectGroup[] =
  featuredProjectGroupDefinitions.map((group) => {
    const project = requireProject(group.projectSlug);
    const cases = group.caseLinks.map((caseLink) => {
      const portfolioCase = getPortfolioCaseBySlug(caseLink.caseSlug);

      if (!portfolioCase) {
        throw new Error(`Missing portfolio case: ${caseLink.caseSlug}`);
      }

      return portfolioCase;
    });

    return {
      projectSlug: group.projectSlug,
      title: project.title,
      subtitle: project.subtitle,
      description: group.description,
      caseSlugs: group.caseLinks.map((caseLink) => caseLink.caseSlug),
      cases,
      caseLinks: [...group.caseLinks],
      primaryEvidence: group.primaryEvidenceLabels.map((label) =>
        requireEvidence(group.projectSlug, label),
      ),
      techStack: project.primaryTechStack,
      repoUrl: project.repoUrl,
      project,
    };
  });

export function getFeaturedPortfolioProjectGroups() {
  return featuredProjectGroups;
}

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
