export type EvidenceStatus = "measured" | "verified" | "pending";

export type ProjectCategory = "featured" | "additional" | "archive";

export type ProjectEvidence = {
  label: string;
  value: string;
  status: EvidenceStatus;
};

export type ProjectOverallArchitecture = {
  projectSlug: string;
  imageSrc: string;
  alt: string;
  caption: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  role: string;
  team?: string;
  period?: string;
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
    team: "개인 / BE 1",
    repoUrl: "https://github.com/sjh9714/concert-booking",
    category: "featured",
    domain: "Ticketing / Reservation",
    problem:
      "동일 좌석 경합, 대기열 우회, 중복 요청, 결제/만료 race, Kafka publish 실패가 함께 발생할 수 있는 예매 흐름",
    solution:
      "좌석 락 전략 비교, Queue token 바인딩, Idempotency-Key, Outbox/DLT, Redis reconciliation을 조합해 DB 최종 정합성을 유지",
    result:
      "동일 좌석 100개 동시 요청에서 success 1, fail 99, overselling 0을 기록하고 예약/결제/만료 정합성을 Testcontainers로 검증했습니다.",
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
        label: "동일 좌석 경합",
        value: "100 concurrent requests -> success 1, fail 99, overselling 0",
        status: "measured",
      },
      {
        label: "분산 좌석 예약",
        value:
          "50명 서로 다른 좌석 예매 -> pessimistic 50/50, Redis distributed lock 50/50",
        status: "measured",
      },
      {
        label: "혼합 부하 테스트",
        value: "200 VU, 45초 기준 총 RPS 약 969~1,005",
        status: "measured",
      },
      {
        label: "Testcontainers 검증 시나리오",
        value:
          "reservation/payment idempotency, race condition, DLT replay, stock reconciliation 검증",
        status: "verified",
      },
      {
        label: "결제/만료 race·중복 요청·대기열 abuse 검증",
        value:
          "D/E/F local repeat: 결제/만료 race, idempotency replay/conflict, 대기열 token abuse checks passed",
        status: "verified",
      },
      {
        label: "Prometheus actuator metric contract",
        value:
          "alert rule과 Grafana dashboard가 참조하는 metric name을 보호된 /actuator/prometheus 응답과 대조",
        status: "verified",
      },
      {
        label: "Local monitoring evidence harness",
        value:
          "local-monitoring admin bootstrap, bearer-token Prometheus config, Grafana provisioning, capture-summary validator로 실제 scrape artifact 준비",
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
      "왜 Redis stock을 최종 기준 데이터로 두지 않았나요?",
      "낙관적 락이 서로 다른 좌석 예매에서도 실패한 이유는 무엇인가요?",
      "Outbox가 exactly-once를 보장하지 않는다면 중복은 어디서 흡수했나요?",
    ],
    limitations: [
      "Actuator metric name contract, alert rule, Grafana template은 시나리오 검증이며 실제 Prometheus server scrape, alert firing, dashboard 운영, tracing, SLO는 별도 보강 예정입니다.",
      "Redis 장애 시 fail-open/fail-closed 정책은 추가 장애 시나리오로 분리해 검증할 수 있습니다.",
    ],
  },
  {
    slug: "realtime-chat",
    title: "Realtime Chat",
    subtitle: "Kafka/Redis 기반 다중 인스턴스 채팅 정합성",
    role: "Personal backend project",
    team: "개인 / BE 1",
    repoUrl: "https://github.com/sjh9714/realtime-chat",
    category: "featured",
    domain: "Realtime Messaging",
    problem:
      "다중 인스턴스 WebSocket 채팅에서 구독 권한, 메시지 순서, presence, reconnect 이후 읽음/누락 복구가 흔들릴 수 있음",
    solution:
      "STOMP 구독 인가, Kafka ACK/NACK, roomId key 기반 ordering, Redis presence, reconnect sync API, DLT replay를 구성",
    result:
      "채팅방 조회 API RPS와 p95 응답 시간을 개선하고 N+1 쿼리를 제거했으며, 메시지 지연과 전달 완전성은 별도 측정 항목으로 분리했습니다.",
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
        label: "채팅방 조회 API RPS",
        value: "937 -> 1,598 RPS",
        status: "measured",
      },
      {
        label: "p95 응답 시간",
        value: "212.85ms -> 149.22ms",
        status: "measured",
      },
      {
        label: "N+1 쿼리 제거",
        value: "2N+1 queries -> 1 query",
        status: "measured",
      },
      {
        label: "WebSocket 연결 스모크 테스트",
        value: "2대 합산 1,158 sessions, 연결 체크 성공률 100%",
        status: "verified",
      },
      {
        label: "메시지 전달 지연 시간 로컬 스냅샷",
        value:
          "50-user repeat3 p95 23-38ms, 500-user repeat3 p95 37-47ms, 1,000-user repeat3 p95 45-50ms (local receiver matrix, 운영 성능 claim 아님)",
        status: "verified",
      },
      {
        label: "WebSocket 전달 완전성 로컬 스냅샷",
        value:
          "50-user repeat3 expected 4,900 / unique 4,900, 500-user repeat3 expected 49,900 / unique 49,900, 1,000-user repeat3 expected 99,900 / unique 99,900, missing 0 / duplicate 0 / completeness 100% (운영 성능 claim 아님)",
        status: "verified",
      },
      {
        label: "Room-global ordering 로컬 진단",
        value:
          "1,000-user repeat3 persisted message id 기준 room-global out-of-order 0",
        status: "verified",
      },
      {
        label: "Receiver matrix by-room guard",
        value:
          "summary.byRoom으로 room별 denominator와 cross-room unexpected delivery deterministic fixture 검증",
        status: "verified",
      },
      {
        label: "Mixed HTTP probe artifact 분리 검산",
        value:
          "room list / message history / read receipt http.jsonl을 mixedHttp summary로 분리하고 receiver denominator 불변 fixture 검증",
        status: "verified",
      },
      {
        label: "Mixed traffic local scenario",
        value:
          "10 rooms x 50 users repeat3 + mixed HTTP probes: unique 4,900/4,900, missing 0, duplicate 0, receiver p95 18-20ms, mixed HTTP failed 0/30 per run (local single app)",
        status: "verified",
      },
      {
        label: "Delivery evidence validator",
        value:
          "2-user local artifact에서 manifest.json, raw JSONL, regenerated summary, byRoom coverage를 검산했고, mixedHttp 포함 artifact는 failed 0 조건으로 승격 전 확인",
        status: "verified",
      },
      {
        label: "Mixed traffic p95 latency",
        value: "production/mixed 1,000-session benchmark 추가 측정 예정",
        status: "pending",
      },
      {
        label: "Production delivery benchmark",
        value:
          "장시간 soak와 mixed traffic 환경의 delivery benchmark 추가 측정 예정",
        status: "pending",
      },
    ],
    jdTags: ["WebSocket", "Kafka", "Redis", "Authorization", "N+1", "DLT"],
    interviewQuestions: [
      "roomId를 Kafka key로 잡았을 때 순서 보장은 어디까지 가능한가요?",
      "구독 인가는 handshake와 subscribe 중 어디서 검증했나요?",
      "reconnect sync API가 누락 메시지를 어떻게 판별하나요?",
    ],
    limitations: [
      "50/500/1,000-user local receiver matrix는 시나리오 검증으로만 제시하고, production/mixed benchmark와 운영 성능 claim은 별도 측정 항목으로 남겨둡니다.",
      "Kafka consumer failure 이후 DLT replay 성공률은 별도 장애 시나리오로 수치화할 수 있습니다.",
    ],
  },
  {
    slug: "ai-usage-billing-gateway",
    title: "AI Usage Billing Gateway",
    subtitle: "멀티테넌트 SaaS 사용량 과금 게이트웨이",
    role: "Personal backend project",
    team: "개인 / BE 1",
    repoUrl: "https://github.com/sjh9714/ai-usage-billing-gateway",
    category: "featured",
    domain: "Billing / Multi-tenant Security",
    problem:
      "organization 단위 사용량 수집, API key 보안, usage 중복 입력, invoice/webhook 중복 처리, ledger 불변성이 함께 필요한 과금 흐름",
    solution:
      "tenant isolation, API key prefix/hash 저장, usage idempotency, quota reservation, invoice scheduler, webhook duplicate/conflict, refund reversal ledger를 구성",
    result:
      "API key 보안, usage idempotency, quota reservation, invoice scheduler, webhook 중복 처리, refund reversal ledger를 검증하고 local full mixed repeat3 측정과 운영 성능 주장을 분리했습니다.",
    primaryTechStack: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "Spring Security",
    ],
    allTechStack: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "Spring Security",
      "JWT",
      "API Key",
      "Micrometer",
      "Testcontainers",
      "k6",
    ],
    evidence: [
      {
        label: "API Key 저장 방식",
        value: "raw key 1회 반환, DB에는 prefix/hash 저장",
        status: "verified",
      },
      {
        label: "사용량 중복 처리",
        value: "중복 usage event 처리와 request hash mismatch 구분",
        status: "verified",
      },
      {
        label: "Webhook 중복 처리",
        value: "providerEventId와 payload hash로 duplicate/conflict 구분",
        status: "verified",
      },
      {
        label: "Append-only Ledger 불변성",
        value:
          "debit/credit balance, single currency, positive amount invariant 검증",
        status: "verified",
      },
      {
        label: "Quota reservation",
        value:
          "gateway/explicit usage insert와 같은 transaction의 quota_counters reservation 검증",
        status: "verified",
      },
      {
        label: "Monthly invoice scheduler",
        value:
          "active subscription organization deduplication과 monthly invoice scheduler idempotency 검증",
        status: "verified",
      },
      {
        label: "Refund reversal ledger",
        value:
          "refund webhook의 balanced reversal, duplicate idempotency, original ledger group 추적 검증",
        status: "verified",
      },
      {
        label: "Full mixed smoke readiness guard",
        value:
          "K6_REQUIRE_OPTIONAL_PATHS=true에서 모든 check 통과, HTTP failure 0, invoice/webhook branch 실행, optional skip 0건을 threshold와 summary validator로 강제",
        status: "verified",
      },
      {
        label: "Full mixed capture rollup guard",
        value:
          "capture-summary.json이 run별 summary validator 통과 여부와 branch count만 묶고 benchmark aggregate는 만들지 않음",
        status: "verified",
      },
      {
        label: "Low-cardinality outcome counters",
        value:
          "gateway request/rate-limit, idempotency conflict, webhook conflict, ledger group counter 등록과 호출 경로 unit test",
        status: "verified",
      },
      {
        label: "Audit metadata sanitizer",
        value:
          "apiKey/authorization/token/secret/password/signature/cookie 계열 nested metadata [REDACTED] 처리 unit test",
        status: "verified",
      },
      {
        label: "혼합 사용량 부하 테스트",
        value:
          "2026-05-23 local full mixed repeat3: 5 VU, 30s, checks 150/150/run, HTTP failure 0/150/run, p95 18.5976-44.1454ms, invoice/webhook branch 각 6회/run",
        status: "measured",
      },
      {
        label: "운영 성능 주장",
        value: "dashboard/alerting/tracing/SLO 운영 성능 데이터 추가 측정 예정",
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
      "invoice scheduler, quota reservation, refund reversal ledger는 시나리오 검증 상태이며 회계 compliance claim은 하지 않습니다.",
      "mixed usage benchmark, dashboard, alerting, tracing, SLO는 공개 측정 항목으로 남겨두었습니다.",
      "quota reconciliation job, dashboard, alert rule은 운영 보강 지점으로 남겨두었습니다.",
    ],
  },
  {
    slug: "msa-shop",
    title: "MSA Shop",
    subtitle: "SAGA·Outbox 기반 쇼핑몰 주문 보상 흐름 실험",
    role: "Personal backend project",
    team: "개인 학습 프로젝트",
    repoUrl: "https://github.com/sjh9714/msa-shop",
    category: "additional",
    domain: "Commerce / Distributed Transaction",
    problem:
      "서비스가 User, Product, Order, Payment, Settlement로 나뉠 때 주문 실패와 결제 성공 이후 저장 실패를 하나의 DB transaction처럼 처리할 수 없음",
    solution:
      "RabbitMQ 이벤트, SAGA/Outbox 보상 흐름, Gateway 인증/rate limit, Prometheus/Grafana/Zipkin 관측성을 구성",
    result:
      "주문, 재고, 결제, 정산 경계를 분리하고 RabbitMQ 이벤트와 SAGA/Outbox 보상 흐름으로 장애 지점을 설명할 수 있게 구성했습니다.",
    primaryTechStack: [
      "Java",
      "Spring Boot",
      "RabbitMQ",
      "PostgreSQL",
      "Docker",
    ],
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
        label: "SAGA 보상 흐름",
        value:
          "주문 실패 시 재고 보상, 주문 저장 실패 시 Outbox 보상 흐름 구성",
        status: "verified",
      },
      {
        label: "RabbitMQ 이벤트 흐름",
        value: "Order, Product, Payment, Settlement 간 이벤트 흐름 구성",
        status: "verified",
      },
      {
        label: "Gateway 접근 경계",
        value: "Gateway 인증과 rate limit 경계 구성",
        status: "verified",
      },
      {
        label: "관측성 스택",
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
      "프로덕션 트래픽을 운영한 기록이 아니라 서비스 경계와 보상 흐름을 검증한 학습형 프로젝트입니다.",
      "정산 서비스의 exactly-once 요구 수준과 중복 흡수 지점은 더 명확한 시나리오 문서로 확장할 수 있습니다.",
    ],
  },
  {
    slug: "timedeal-service",
    title: "TimeDeal Service",
    subtitle: "타임딜 주문 동시성·캐시·레질리언스 API",
    role: "Personal backend project",
    repoUrl: "https://github.com/sjh9714/timedeal-service",
    category: "additional",
    domain: "Commerce / Flash Sale",
    problem:
      "타임딜 주문에서 재고 경합, 캐시 일관성, 외부 장애 전파를 통제해야 함",
    solution:
      "락 전략, Redis, Caffeine, Resilience4j, Prometheus/Grafana, k6 결과를 commerce resilience 관점으로 정리",
    result:
      "락 전략, Redis/Caffeine 캐싱, Resilience4j, Prometheus/Grafana를 조합해 타임딜 주문 흐름의 경합과 장애 전파를 검증했습니다.",
    primaryTechStack: [
      "Java",
      "Spring Boot",
      "Redis",
      "Caffeine",
      "Resilience4j",
    ],
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
        label: "동시성 전략",
        value: "락 전략과 Redis 기반 타임딜 주문 경합 검증",
        status: "verified",
      },
      {
        label: "레질리언스 구성",
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
      "콘서트 예매와 유사한 경합 주제가 있어 commerce resilience 관점으로 차이를 분리해 설명합니다.",
    ],
  },
  {
    slug: "borrow-me",
    title: "BorrowMe",
    subtitle: "대학생 물건 대여 예약·검색·소셜 API",
    role: "11인 팀 프로젝트",
    team: "11인 팀 프로젝트",
    repoUrl: "https://github.com/sjh9714/borrow_me",
    category: "additional",
    domain: "Rental / Team Project",
    problem:
      "팀 기반 대여 서비스에서 예약 정합성, 상품 목록 조회 성능, 협업 흐름을 함께 다뤄야 함",
    solution:
      "동시 예약 재고 초과 방지, N+1 제거, 상품 목록 조회 최적화, 해커톤 팀 협업 경험을 짧게 정리",
    result:
      "원본 README 기록 기준 상품 목록 p95 1,010ms -> 23ms, 쿼리 201회 -> 3회 개선 사례를 현재 query-count guard, 예약 정합성 테스트, Flyway baseline validation으로 보강했습니다.",
    primaryTechStack: ["Java", "Spring Boot", "JPA", "MySQL", "k6"],
    allTechStack: ["Java", "Spring Boot", "JPA", "MySQL", "OAuth", "k6"],
    evidence: [
      {
        label: "상품 목록 p95 원본 기록",
        value: "참고 기록 · raw artifact 없음 · 현재 재측정 claim 아님",
        status: "pending",
      },
      {
        label: "상품 목록 현재 재측정 snapshot",
        value: "p95 358.1088ms · HTTP failure 0 · checks 10,683/10,683 (local)",
        status: "measured",
      },
      {
        label: "상품 목록 쿼리 수 원본 기록 + 현재 guard",
        value:
          "원본 README 기록 + 현재 query-count guard: 201 queries -> 3 queries",
        status: "verified",
      },
      {
        label: "Follow lookup query-count guard",
        value:
          "FollowService.getFollowedUserIds 후보 사용자 팔로우 조회 SQL 1회 guard",
        status: "verified",
      },
      {
        label: "Authenticated product-list follow-aware guard",
        value:
          "인증 GET /api/products 응답에서 팔로우 여부 true/false와 SQL 5회 이하 query-count guard",
        status: "verified",
      },
      {
        label: "Ranking data path query-count guard",
        value:
          "상위 사용자, 최근 상품, 팔로우 여부 조회 조합을 SQL 5회 이하로 유지",
        status: "verified",
      },
      {
        label: "Ranking HTTP model assembly guard",
        value:
          "GET /ranking handler/model assembly에서 topUsers/currentUser/recentProducts/followed flag 구성과 SQL 6회 이하 guard",
        status: "verified",
      },
      {
        label: "Exercise hashtag query-count guard",
        value: "운동 추천/검색 응답의 exercise hashtag DTO 변환 SQL 1회 guard",
        status: "verified",
      },
      {
        label: "예약 정합성",
        value: "동시 예약 재고 초과 방지",
        status: "verified",
      },
      {
        label: "Flyway baseline validation",
        value:
          "V1 baseline schema migration + MySQL Testcontainers + Hibernate validate",
        status: "verified",
      },
    ],
    jdTags: ["Team Project", "N+1", "Performance", "Reservation"],
    interviewQuestions: [
      "11인 팀에서 백엔드 의사결정 충돌은 어떻게 조율했나요?",
      "p95 개선에서 가장 큰 병목은 N+1이었나요, 인덱스였나요?",
    ],
    limitations: [
      "상품 목록 p95/쿼리 수는 원본 README 기록 기준이며, 현재 repository에서는 query-count guard와 local snapshot을 분리해 설명합니다.",
    ],
  },
  {
    slug: "running-app",
    title: "Running App",
    subtitle: "러닝 기록·챌린지·트레이닝 플랜 풀스택 앱",
    role: "Full-stack project",
    repoUrl: "https://github.com/sjh9714/Running_App",
    category: "additional",
    domain: "Fitness / Product",
    problem:
      "러닝 활동, 챌린지, 플랜, 이벤트 기반 처리, 웹/iOS 경험을 하나의 사용자 흐름으로 연결해야 함",
    solution:
      "이벤트 기반 비동기 처리와 Redis 캐싱을 제품 기능 완성도 관점으로 정리",
    result:
      "러닝 기록, 챌린지, 트레이닝 플랜 흐름을 이벤트 기반 비동기 처리와 Redis 캐싱으로 구현했습니다.",
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
        label: "제품 범위",
        value: "러닝 기록, 챌린지, 트레이닝 플랜, 이벤트 처리 포함",
        status: "verified",
      },
      {
        label: "캐싱",
        value: "Redis 캐싱 적용",
        status: "verified",
      },
    ],
    jdTags: ["Product", "Redis", "Async", "Full-stack"],
    interviewQuestions: [
      "제품 기능 완성도와 백엔드 깊이 사이에서 어떤 우선순위를 잡았나요?",
    ],
    limitations: [
      "기능 범위가 넓어 핵심 백엔드 주제는 이벤트 처리와 캐싱으로 좁혀 설명합니다.",
    ],
  },
  {
    slug: "ai-interview-coach",
    title: "AI Interview Coach",
    subtitle: "JD 분석 기반 질문 생성과 SSE 피드백 서비스",
    role: "Personal AI/backend project",
    repoUrl: "https://github.com/sjh9714/interview-coach",
    category: "additional",
    domain: "AI / Interview",
    problem:
      "LLM 기반 기능이 단순 API 연결처럼 보이지 않도록 SSE, RAG, 캐싱, 성능 병목을 백엔드 문제로 정리해야 함",
    solution:
      "SSE timeout, heap/ZGC tuning, N+1 개선, Redis caching 중심으로 AI 서비스 백엔드 문제를 표현",
    result:
      "JD 분석, 질문 생성, SSE 피드백 흐름을 여러 Spring Boot 서비스로 나누고 캐싱/스트리밍 안정성 과제를 정리했습니다.",
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
        label: "서비스 구성",
        value: "5개 Spring Boot 서비스와 Next.js 구성",
        status: "verified",
      },
      {
        label: "백엔드 초점",
        value: "SSE timeout, heap/ZGC, N+1, Redis caching 중심 확장 항목",
        status: "pending",
      },
    ],
    jdTags: ["AI", "SSE", "RAG", "Redis", "Performance"],
    interviewQuestions: [
      "SSE 연결 유지와 timeout은 어떤 기준으로 설계했나요?",
      "RAG 품질보다 백엔드 안정성에서 가장 어려웠던 지점은 무엇인가요?",
    ],
    limitations: [
      "LLM 품질 평가보다 스트리밍 안정성, 캐싱, 서비스 분리 흐름을 중심으로 설명합니다.",
    ],
  },
  {
    slug: "memory-of-year",
    title: "Memory of Year",
    subtitle: "앨범·편지·사진·스티커 관리 팀 프로젝트 API",
    role: "7인 팀 프로젝트",
    repoUrl: "https://github.com/sjh9714/memory_of_year",
    category: "archive",
    domain: "Early Team Project",
    problem:
      "앨범, 편지, 사진, 스티커를 관리하는 팀 서비스에서 인증, 파일 업로드, API 문서화를 구성해야 함",
    solution: "JWT 인증, S3 파일 저장, Swagger 문서화, k6/N+1 개선 경험을 정리",
    result:
      "JWT, S3, Swagger, k6, N+1 개선을 포함한 초기 팀 프로젝트 경험을 정리했습니다.",
    primaryTechStack: ["Java", "Spring Boot", "JWT", "S3", "k6"],
    allTechStack: ["Java", "Spring Boot", "JWT", "S3", "Swagger", "k6"],
    evidence: [
      {
        label: "초기 백엔드 스택",
        value: "JWT, S3, Swagger, k6, N+1 개선 경험",
        status: "verified",
      },
    ],
    jdTags: ["Team Project", "JWT", "S3", "Swagger"],
    interviewQuestions: [
      "초기 팀 프로젝트와 현재 featured 프로젝트 사이에서 성장한 지점은 무엇인가요?",
    ],
    limitations: [
      "현재 대표 사례보다 백엔드 임팩트가 작아 전체 프로젝트 목록에서만 짧게 다룹니다.",
    ],
  },
];

export const projectOverallArchitectures: ProjectOverallArchitecture[] = [
  {
    projectSlug: "concert-booking",
    imageSrc: "/architecture/overall/concert-booking.svg",
    alt: "Concert Booking 전체 흐름: 대기열, 예약 트랜잭션, Outbox, Kafka, DLT, PostgreSQL 복구 기준",
    caption:
      "예매 요청이 Queue token, 예약 트랜잭션, Outbox/Kafka, Consumer/DLT, PostgreSQL 기준 복구로 이어지는 전체 흐름입니다.",
  },
  {
    projectSlug: "realtime-chat",
    imageSrc: "/architecture/overall/realtime-chat.svg",
    alt: "Realtime Chat 전체 흐름: STOMP 연결, 구독 인가, Kafka roomId ordering, Redis presence, reconnect sync",
    caption:
      "다중 인스턴스 채팅에서 연결, 구독 인가, 메시지 순서, presence, reconnect 동기화 경계를 분리한 흐름입니다.",
  },
  {
    projectSlug: "ai-usage-billing-gateway",
    imageSrc: "/architecture/overall/ai-usage-billing-gateway.svg",
    alt: "AI Usage Billing Gateway 전체 흐름: API key 인증, usage idempotency, invoice, webhook, append-only ledger",
    caption:
      "tenant 인증부터 사용량 중복 처리, invoice/webhook 처리, append-only ledger와 audit log까지의 과금 흐름입니다.",
  },
  {
    projectSlug: "borrow-me",
    imageSrc: "/architecture/overall/borrowme.svg",
    alt: "BorrowMe 전체 흐름: 상품 목록 API, 팔로우 조회, 예약 정합성, MySQL 기준 데이터",
    caption:
      "상품 목록 조회 최적화와 예약 정합성 검증이 MySQL 기준 데이터 위에서 만나는 흐름입니다.",
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

export function getEvidencePreview(project: Project, limit = 2) {
  const pending = project.evidence.find(
    (evidence) => evidence.status === "pending",
  );
  const measuredOrVerified = project.evidence.filter(
    (evidence) => evidence.status !== "pending",
  );

  if (!pending) {
    return measuredOrVerified.slice(0, limit);
  }

  return [measuredOrVerified[0], pending]
    .filter((evidence): evidence is ProjectEvidence => Boolean(evidence))
    .slice(0, limit);
}
