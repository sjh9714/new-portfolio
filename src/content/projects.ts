export type EvidenceStatus = "measured" | "verified" | "pending";

export type ProjectCategory = "featured" | "additional" | "archive";

export type ProjectEvidence = {
  label: string;
  value: string;
  status: EvidenceStatus;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  role: string;
  period: string;
  repoUrl: string;
  category: ProjectCategory;
  domain: string;
  problem: string;
  solution: string;
  result: string;
  primaryTechStack: string[];
  allTechStack: string[];
  evidence: ProjectEvidence[];
  jdTags: string[];
  interviewQuestions: string[];
  limitations: string[];
};

export const projects: Project[] = [
  {
    slug: "concert-booking",
    title: "Concert Booking",
    subtitle: "고동시성 콘서트 예매 정합성 백엔드",
    role: "Personal backend project",
    period: "README 기준 미표기",
    repoUrl: "https://github.com/sjh9714/concert-booking",
    category: "featured",
    domain: "Ticketing / Reservation",
    problem:
      "동일 좌석 경합, 대기열 우회, 중복 요청, 결제/만료 race, Kafka publish 실패가 함께 발생할 수 있는 예매 흐름",
    solution:
      "좌석 락 전략 비교, Queue token 바인딩, Idempotency-Key, Outbox/DLT, Redis reconciliation을 조합해 DB 최종 정합성을 유지",
    result:
      "동일 좌석 100개 동시 요청에서 success 1, fail 99, overselling 0을 기록하고 예약/결제/만료 정합성을 Testcontainers로 검증",
    primaryTechStack: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Kafka"],
    allTechStack: [
      "Java",
      "Spring Boot",
      "JPA",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "Testcontainers",
      "k6",
      "Docker",
    ],
    evidence: [
      {
        label: "Hot Seat Contention",
        value: "100 concurrent requests -> success 1, fail 99, overselling 0",
        status: "measured",
      },
      {
        label: "Distributed Reservation",
        value:
          "50명 서로 다른 좌석 예매 -> pessimistic 50/50, Redis distributed lock 50/50",
        status: "measured",
      },
      {
        label: "Mixed Load",
        value: "200 VU, 45초 기준 총 RPS 약 969~1,005",
        status: "measured",
      },
      {
        label: "Testcontainers scenarios",
        value:
          "reservation/payment idempotency, race condition, DLT replay, stock reconciliation 검증",
        status: "verified",
      },
    ],
    jdTags: [
      "Concurrency",
      "Idempotency",
      "Outbox",
      "Kafka",
      "Redis",
      "Testcontainers",
    ],
    interviewQuestions: [
      "왜 Redis stock을 최종 진실로 두지 않았나요?",
      "낙관적 락이 서로 다른 좌석 예매에서도 실패한 이유는 무엇인가요?",
      "Outbox가 exactly-once를 보장하지 않는다면 중복은 어디서 흡수했나요?",
    ],
    limitations: [
      "운영 알림, tracing, SLO, runbook은 포트폴리오 문서의 다음 보강 범위입니다.",
      "Redis 장애 시 fail-open/fail-closed 정책은 별도 장애 시나리오로 더 명시해야 합니다.",
    ],
  },
  {
    slug: "realtime-chat",
    title: "Realtime Chat",
    subtitle: "Kafka/Redis 기반 다중 인스턴스 채팅 정합성",
    role: "Personal backend project",
    period: "README 기준 미표기",
    repoUrl: "https://github.com/sjh9714/realtime-chat",
    category: "featured",
    domain: "Realtime Messaging",
    problem:
      "다중 인스턴스 WebSocket 채팅에서 구독 권한, 메시지 순서, presence, reconnect 이후 읽음/누락 복구가 흔들릴 수 있음",
    solution:
      "STOMP 구독 인가, Kafka ACK/NACK, roomId key 기반 ordering, Redis presence, reconnect sync API, DLT replay를 구성",
    result:
      "채팅방 조회 API RPS와 p95를 개선하고 N+1을 제거했으며, 아직 실제 send-to-receive latency는 Pending으로 분리",
    primaryTechStack: ["Java", "Spring Boot", "WebSocket", "Kafka", "Redis"],
    allTechStack: [
      "Java",
      "Spring Boot",
      "STOMP",
      "WebSocket",
      "Kafka",
      "Redis",
      "JPA",
      "Testcontainers",
      "k6",
    ],
    evidence: [
      {
        label: "Chat room API RPS",
        value: "937 -> 1,598 RPS",
        status: "measured",
      },
      {
        label: "p95 response time",
        value: "212.85ms -> 149.22ms",
        status: "measured",
      },
      {
        label: "N+1 query removal",
        value: "2N+1 queries -> 1 query",
        status: "measured",
      },
      {
        label: "WebSocket connection smoke",
        value: "2대 합산 1,158 sessions, 연결 체크 성공률 100%",
        status: "measured",
      },
      {
        label: "Send-to-receive latency",
        value: "p50/p95/p99 benchmark 필요",
        status: "pending",
      },
      {
        label: "WebSocket delivery completeness",
        value: "1,000 concurrent sessions 기준 복구율/누락률 검증 필요",
        status: "pending",
      },
    ],
    jdTags: [
      "WebSocket",
      "Kafka",
      "Redis",
      "Authorization",
      "N+1",
      "DLT",
    ],
    interviewQuestions: [
      "roomId를 Kafka key로 잡았을 때 순서 보장은 어디까지 가능한가요?",
      "구독 인가는 handshake와 subscribe 중 어디서 검증했나요?",
      "reconnect sync API가 누락 메시지를 어떻게 판별하나요?",
    ],
    limitations: [
      "send-to-receive p50/p95/p99와 delivery completeness가 아직 Pending입니다.",
      "Kafka consumer failure 이후 DLT replay 성공률을 독립 benchmark로 더 보여줘야 합니다.",
    ],
  },
  {
    slug: "ai-usage-billing-gateway",
    title: "AI Usage Billing Gateway",
    subtitle: "멀티테넌트 SaaS 사용량 과금 게이트웨이",
    role: "Personal backend project",
    period: "README 기준 미표기",
    repoUrl: "https://github.com/sjh9714/ai-usage-billing-gateway",
    category: "featured",
    domain: "Billing / Multi-tenant Security",
    problem:
      "organization 단위 사용량 수집, API key 보안, usage 중복 입력, invoice/webhook 중복 처리, ledger 불변성이 함께 필요한 과금 흐름",
    solution:
      "tenant isolation, API key prefix/hash 저장, usage idempotency, webhook duplicate/conflict 구분, append-only ledger invariant를 구성",
    result:
      "보안/정합성 흐름은 검증했지만 mixed usage 성능 결과와 production readiness는 아직 Pending으로 명시",
    primaryTechStack: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Redis"],
    allTechStack: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Kafka",
      "Redis",
      "JWT",
      "API Key",
      "Testcontainers",
      "k6",
    ],
    evidence: [
      {
        label: "API Key storage",
        value: "raw key 1회 반환, DB에는 prefix/hash 저장",
        status: "verified",
      },
      {
        label: "Usage idempotency",
        value: "중복 usage event 처리와 request hash mismatch 구분",
        status: "verified",
      },
      {
        label: "Webhook duplicate handling",
        value: "providerEventId와 payload hash로 duplicate/conflict 구분",
        status: "verified",
      },
      {
        label: "Append-only ledger invariant",
        value: "debit/credit balance, single currency, positive amount invariant 검증",
        status: "verified",
      },
      {
        label: "k6 mixed usage scenario",
        value: "throughput/latency/error rate 결과 수집 예정",
        status: "pending",
      },
      {
        label: "Production performance claim",
        value: "Not claimed",
        status: "pending",
      },
    ],
    jdTags: [
      "Billing",
      "Multi-tenant",
      "API Key",
      "Ledger",
      "Webhook",
      "Audit",
    ],
    interviewQuestions: [
      "API key 원문을 다시 보여주지 않는 이유는 무엇인가요?",
      "usage idempotency와 webhook duplicate 처리는 어떻게 다르게 봤나요?",
      "append-only ledger에서 refund reversal은 어떻게 표현해야 하나요?",
    ],
    limitations: [
      "invoice generation은 manual endpoint에서 scheduler 또는 Spring Batch로 보강해야 합니다.",
      "k6 mixed usage 결과, dashboard, alerting, tracing, SLO는 아직 Pending입니다.",
      "strict quota reservation과 refund reversal ledger는 다음 구현 범위입니다.",
    ],
  },
  {
    slug: "msa-shop",
    title: "MSA Shop",
    subtitle: "SAGA·Outbox 기반 쇼핑몰 주문 보상 흐름 실험",
    role: "Personal backend project",
    period: "README 기준 미표기",
    repoUrl: "https://github.com/sjh9714/msa-shop",
    category: "featured",
    domain: "Commerce / Distributed Transaction",
    problem:
      "서비스가 User, Product, Order, Payment, Settlement로 나뉠 때 주문 실패와 결제 성공 이후 저장 실패를 하나의 DB transaction처럼 처리할 수 없음",
    solution:
      "RabbitMQ 이벤트, SAGA/Outbox 보상 흐름, Gateway 인증/rate limit, Prometheus/Grafana/Zipkin 관측성을 구성",
    result:
      "MSA 환경에서 주문 흐름의 장애 경계와 보상 트랜잭션을 학습하고 검증하기 위한 멀티 모듈 백엔드 프로젝트로 정리",
    primaryTechStack: ["Java", "Spring Boot", "RabbitMQ", "PostgreSQL", "Docker"],
    allTechStack: [
      "Java",
      "Spring Boot",
      "RabbitMQ",
      "PostgreSQL",
      "Redis",
      "Gateway",
      "Prometheus",
      "Grafana",
      "Zipkin",
      "Docker",
      "Kubernetes",
      "Helm",
    ],
    evidence: [
      {
        label: "SAGA compensation flow",
        value: "주문 실패 시 재고 보상, 주문 저장 실패 시 Outbox 보상 흐름 구성",
        status: "verified",
      },
      {
        label: "RabbitMQ event flow",
        value: "Order, Product, Payment, Settlement 간 이벤트 흐름 구성",
        status: "verified",
      },
      {
        label: "Gateway boundary",
        value: "Gateway 인증과 rate limit 경계 구성",
        status: "verified",
      },
      {
        label: "Observability stack",
        value: "Prometheus/Grafana/Zipkin 구성",
        status: "verified",
      },
    ],
    jdTags: ["MSA", "SAGA", "Outbox", "RabbitMQ", "Gateway", "Observability"],
    interviewQuestions: [
      "왜 서비스를 나눴고, DB는 서비스별로 분리했나요?",
      "분산 트랜잭션을 SAGA로 풀 때 보상 실패는 어떻게 다뤘나요?",
      "Outbox relay가 죽으면 어떤 지표와 재처리 경로가 필요할까요?",
    ],
    limitations: [
      "운영 경험 있는 MSA가 아니라 장애 경계와 보상 흐름을 실험한 프로젝트로 표현해야 합니다.",
      "정산 서비스의 exactly-once 요구 수준과 중복 흡수 지점을 더 명확히 문서화해야 합니다.",
    ],
  },
  {
    slug: "timedeal-service",
    title: "TimeDeal Service",
    subtitle: "타임딜 주문 동시성·캐시·레질리언스 API",
    role: "Personal backend project",
    period: "README 기준 미표기",
    repoUrl: "https://github.com/sjh9714/timedeal-service",
    category: "additional",
    domain: "Commerce / Flash Sale",
    problem: "타임딜 주문에서 재고 경합, 캐시 일관성, 외부 장애 전파를 통제해야 함",
    solution:
      "락 전략, Redis, Caffeine, Resilience4j, Prometheus/Grafana, k6 결과를 commerce resilience 관점으로 정리",
    result:
      "Concert Booking과 겹치는 동시성 축은 메인에서 제외하고 commerce resilience 보조 사례로 배치",
    primaryTechStack: ["Java", "Spring Boot", "Redis", "Caffeine", "Resilience4j"],
    allTechStack: [
      "Java",
      "Spring Boot",
      "Redis",
      "Caffeine",
      "Resilience4j",
      "Prometheus",
      "Grafana",
      "k6",
    ],
    evidence: [
      {
        label: "Concurrency strategy",
        value: "락 전략과 Redis 기반 타임딜 주문 경합 검증",
        status: "verified",
      },
      {
        label: "Resilience stack",
        value: "Caffeine, Resilience4j, Prometheus/Grafana 구성",
        status: "verified",
      },
    ],
    jdTags: ["Redis", "Caching", "Resilience4j", "k6", "Monitoring"],
    interviewQuestions: [
      "Concert Booking과 비교해 TimeDeal에서 락 전략 선택 기준은 무엇이 달랐나요?",
      "캐시를 쓰면서 DB와 불일치가 생길 때 복구 기준은 무엇인가요?",
    ],
    limitations: [
      "Concert Booking과 주제가 겹치므로 메인 사례로 중복 배치하지 않습니다.",
    ],
  },
  {
    slug: "borrow-me",
    title: "BorrowMe",
    subtitle: "대학생 물건 대여 예약·검색·소셜 API",
    role: "11인 팀 프로젝트",
    period: "README 기준 미표기",
    repoUrl: "https://github.com/sjh9714/borrow_me",
    category: "additional",
    domain: "Rental / Team Project",
    problem: "팀 기반 대여 서비스에서 예약 정합성, 상품 목록 조회 성능, 협업 흐름을 함께 다뤄야 함",
    solution:
      "동시 예약 재고 초과 방지, N+1 제거, 상품 목록 조회 최적화, 해커톤 팀 협업 경험을 짧게 정리",
    result: "상품 목록 p95 1,010ms -> 23ms, 쿼리 201회 -> 3회 개선 사례를 보조 카드로 표시",
    primaryTechStack: ["Java", "Spring Boot", "JPA", "MySQL", "k6"],
    allTechStack: ["Java", "Spring Boot", "JPA", "MySQL", "OAuth", "k6"],
    evidence: [
      {
        label: "Product list p95",
        value: "1,010ms -> 23ms",
        status: "measured",
      },
      {
        label: "Query count",
        value: "201 queries -> 3 queries",
        status: "measured",
      },
      {
        label: "Reservation consistency",
        value: "동시 예약 재고 초과 방지",
        status: "verified",
      },
    ],
    jdTags: ["Team Project", "N+1", "Performance", "Reservation"],
    interviewQuestions: [
      "11인 팀에서 백엔드 의사결정 충돌은 어떻게 조율했나요?",
      "p95 개선에서 가장 큰 병목은 N+1이었나요, 인덱스였나요?",
    ],
    limitations: [
      "기술 깊이는 featured 프로젝트보다 낮으므로 협업과 성능 개선 카드로만 사용합니다.",
    ],
  },
  {
    slug: "running-app",
    title: "Running App",
    subtitle: "러닝 기록·챌린지·트레이닝 플랜 풀스택 앱",
    role: "Full-stack project",
    period: "README 기준 미표기",
    repoUrl: "https://github.com/sjh9714/Running_App",
    category: "additional",
    domain: "Fitness / Product",
    problem: "러닝 활동, 챌린지, 플랜, 이벤트 기반 처리, 웹/iOS 경험을 하나의 사용자 흐름으로 연결해야 함",
    solution: "이벤트 기반 비동기 처리와 Redis 캐싱을 제품 기능 완성도 관점으로 정리",
    result: "백엔드 메인 사례가 아니라 사용자 기능을 끝까지 만든 제품 감각 카드로 배치",
    primaryTechStack: ["Java", "Spring Boot", "Redis", "Event-driven", "iOS"],
    allTechStack: [
      "Java",
      "Spring Boot",
      "Redis",
      "Event-driven",
      "Web",
      "iOS",
    ],
    evidence: [
      {
        label: "Product scope",
        value: "러닝 기록, 챌린지, 트레이닝 플랜, 이벤트 처리 포함",
        status: "verified",
      },
      {
        label: "Caching",
        value: "Redis 캐싱 적용",
        status: "verified",
      },
    ],
    jdTags: ["Product", "Redis", "Async", "Full-stack"],
    interviewQuestions: [
      "제품 기능 완성도와 백엔드 깊이 사이에서 어떤 우선순위를 잡았나요?",
    ],
    limitations: [
      "백엔드 포트폴리오 메인으로는 넓고 얕아 보일 수 있어 Additional로 둡니다.",
    ],
  },
  {
    slug: "ai-interview-coach",
    title: "AI Interview Coach",
    subtitle: "JD 분석 기반 질문 생성과 SSE 피드백 서비스",
    role: "Personal AI/backend project",
    period: "README 기준 미표기",
    repoUrl: "https://github.com/sjh9714/interview-coach",
    category: "additional",
    domain: "AI / Interview",
    problem: "LLM 기반 기능이 단순 API 연결처럼 보이지 않도록 SSE, RAG, 캐싱, 성능 병목을 백엔드 문제로 정리해야 함",
    solution: "SSE timeout, heap/ZGC tuning, N+1 개선, Redis caching 중심으로 AI 서비스 백엔드 문제를 표현",
    result: "트렌드 카드로는 유효하지만 featured 사례는 과금/정합성 프로젝트에 양보",
    primaryTechStack: ["Java", "Spring Boot", "SSE", "RAG", "Redis"],
    allTechStack: [
      "Java",
      "Spring Boot",
      "SSE",
      "RAG",
      "ChromaDB",
      "Redis",
      "Next.js",
    ],
    evidence: [
      {
        label: "Service topology",
        value: "5개 Spring Boot 서비스와 Next.js 구성",
        status: "verified",
      },
      {
        label: "Backend focus",
        value: "SSE timeout, heap/ZGC, N+1, Redis caching 중심 보강 필요",
        status: "pending",
      },
    ],
    jdTags: ["AI", "SSE", "RAG", "Redis", "Performance"],
    interviewQuestions: [
      "SSE 연결 유지와 timeout은 어떤 기준으로 설계했나요?",
      "RAG 품질보다 백엔드 안정성에서 가장 어려웠던 지점은 무엇인가요?",
    ],
    limitations: [
      "AI 기능 자체보다 백엔드 안정성 문제 중심으로 설명해야 합니다.",
    ],
  },
  {
    slug: "memory-of-year",
    title: "Memory of Year",
    subtitle: "앨범·편지·사진·스티커 관리 팀 프로젝트 API",
    role: "7인 팀 프로젝트",
    period: "README 기준 미표기",
    repoUrl: "https://github.com/sjh9714/memory_of_year",
    category: "archive",
    domain: "Archive / Early Team Project",
    problem: "팀 프로젝트 API 구현 경험은 있으나 현재 featured 프로젝트보다 백엔드 임팩트가 약함",
    solution: "JWT, S3, Swagger, k6, N+1 개선 경험을 early team project로만 보관",
    result: "메인 화면에서는 숨기고 전체 프로젝트 아카이브에서만 노출",
    primaryTechStack: ["Java", "Spring Boot", "JWT", "S3", "k6"],
    allTechStack: ["Java", "Spring Boot", "JWT", "S3", "Swagger", "k6"],
    evidence: [
      {
        label: "Early backend stack",
        value: "JWT, S3, Swagger, k6, N+1 개선 경험",
        status: "verified",
      },
    ],
    jdTags: ["Team Project", "JWT", "S3", "Swagger"],
    interviewQuestions: [
      "초기 팀 프로젝트와 현재 featured 프로젝트 사이에서 성장한 지점은 무엇인가요?",
    ],
    limitations: [
      "다른 레포에 비해 백엔드 임팩트가 약하므로 Archive로 분류합니다.",
    ],
  },
];

export const featuredProjects = projects.filter(
  (project) => project.category === "featured",
);

export const additionalProjects = projects.filter(
  (project) => project.category === "additional",
);

export const archiveProjects = projects.filter(
  (project) => project.category === "archive",
);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getEvidencePreview(project: Project, limit: number) {
  const pendingEvidence = project.evidence.find(
    (evidence) => evidence.status === "pending",
  );

  if (!pendingEvidence || limit >= project.evidence.length) {
    return project.evidence.slice(0, limit);
  }

  const nonPendingEvidence = project.evidence.find(
    (evidence) => evidence.status !== "pending",
  );

  return [nonPendingEvidence, pendingEvidence]
    .filter((evidence): evidence is ProjectEvidence => Boolean(evidence))
    .slice(0, limit);
}
