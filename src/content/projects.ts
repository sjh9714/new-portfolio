export type EvidenceScope =
  "unit" | "integration" | "local-load" | "production";

export type EvidenceSource = {
  repoUrl: string;
  permalink: string;
  command?: string;
};

export type Evidence =
  | {
      id: string;
      status: "measured";
      scope: EvidenceScope;
      label: string;
      value: string;
      measuredAt: string;
      scenario: string;
      environment: string;
      source: EvidenceSource;
    }
  | {
      id: string;
      status: "verified";
      scope: EvidenceScope;
      label: string;
      value: string;
      method: string;
      source: EvidenceSource;
    };

export type ProjectSummary = {
  slug: string;
  title: string;
  positioning: string;
  domain: string;
  role: string;
  team?: string;
  period?: string;
  problem: string;
  decision: string;
  result: string;
  tech: string[];
  evidenceIds: string[];
  caseStudySlugs: string[];
  repoUrl: string;
};

type RepositoryKey = "concert" | "realtime" | "billing" | "borrowMe";

const repositories: Record<RepositoryKey, { repoUrl: string; commit: string }> =
  {
    concert: {
      repoUrl: "https://github.com/sjh9714/concert-booking",
      commit: "c7bb1201bc9b3afbdb8a6499a206c2411f22afb4",
    },
    realtime: {
      repoUrl: "https://github.com/sjh9714/realtime-chat",
      commit: "2602fa915737c10ce79b16bd2344c46fe407fa73",
    },
    billing: {
      repoUrl: "https://github.com/sjh9714/ai-usage-billing-gateway",
      commit: "7bb677447b01573d3b294215d184b3675872b041",
    },
    borrowMe: {
      repoUrl: "https://github.com/sjh9714/borrow_me",
      commit: "2c860a5240272b05ef4ae882936789413bc82d44",
    },
  };

function githubSource(
  repository: RepositoryKey,
  path: string,
  lines?: string,
  command?: string,
): EvidenceSource {
  const { repoUrl, commit } = repositories[repository];

  return {
    repoUrl,
    permalink: `${repoUrl}/blob/${commit}/${path}${lines ? `#${lines}` : ""}`,
    ...(command ? { command } : {}),
  };
}

/**
 * Public proof only. Every item points at a commit-pinned file, test, or
 * artifact. Future work belongs in a case study's nextValidation field, not
 * in this catalog.
 */
export const evidenceCatalog: readonly Evidence[] = [
  {
    id: "concert-seat-single-winner",
    status: "verified",
    scope: "integration",
    label: "동일 좌석 경합",
    value: "10개 동시 요청 → 성공 1, 실패 9, 좌석 상태 HELD 1건",
    method:
      "Testcontainers 통합 테스트에서 10개 thread를 동시에 시작한 뒤 성공/실패 수와 단일 좌석 상태를 검증",
    source: githubSource(
      "concert",
      "src/test/java/com/concert/booking/integration/ConcurrencyIntegrationTest.java",
      "L86-L121",
      "./gradlew test --tests '*ConcurrencyIntegrationTest'",
    ),
  },
  {
    id: "concert-queue-token-boundary",
    status: "verified",
    scope: "integration",
    label: "Queue Token 경계",
    value:
      "token 없음·오사용·타 사용자·타 일정·만료·동시 재사용을 세 예약 전략에서 차단",
    method:
      "비관적 락, 낙관적 락, Redis 분산 락 구현에 동일한 Queue Token 정책 통합 테스트 적용",
    source: githubSource(
      "concert",
      "src/test/java/com/concert/booking/integration/QueueTokenPolicyIntegrationTest.java",
      "L58-L229",
      "./gradlew test --tests '*QueueTokenPolicyIntegrationTest'",
    ),
  },
  {
    id: "concert-reservation-idempotency",
    status: "verified",
    scope: "integration",
    label: "예약 멱등성",
    value:
      "동일 Idempotency-Key 재시도는 기존 예약을 반환하고 동시 재시도도 예약 row 1건으로 수렴",
    method:
      "세 예약 전략에서 same-key replay, payload conflict, 동시 retry 결과를 저장 row와 함께 검증",
    source: githubSource(
      "concert",
      "src/test/java/com/concert/booking/integration/ReservationIdempotencyIntegrationTest.java",
      "L63-L140",
      "./gradlew test --tests '*ReservationIdempotencyIntegrationTest'",
    ),
  },
  {
    id: "concert-database-constraints",
    status: "verified",
    scope: "integration",
    label: "DB 중복 방어선",
    value:
      "좌석 식별자, 예약 key, 사용자·일정·멱등 key, 예약·좌석 조합에 UNIQUE constraint 적용",
    method:
      "Flyway 예약 스키마의 unique constraint를 persistence 최종 방어선으로 확인",
    source: githubSource(
      "concert",
      "src/main/resources/db/migration/V2__create_seats_and_reservations.sql",
      "L1-L42",
    ),
  },
  {
    id: "concert-outbox-retry",
    status: "verified",
    scope: "integration",
    label: "Outbox 발행 복구",
    value:
      "Kafka 발행 실패 시 FAILED로 보존하고 재시도 성공 시 PUBLISHED, 최대 재시도 후 DEAD로 전이",
    method:
      "KafkaTemplate 실패/성공 응답을 주입해 Outbox 상태, retry count, backoff, terminal state를 검증",
    source: githubSource(
      "concert",
      "src/test/java/com/concert/booking/integration/OutboxIntegrationTest.java",
      "L117-L217",
      "./gradlew test --tests '*OutboxIntegrationTest'",
    ),
  },
  {
    id: "concert-dlt-replay",
    status: "verified",
    scope: "integration",
    label: "DLT replay 복구",
    value:
      "consumer 실패 이벤트를 DLT로 격리하고 replay 후 좌석·Redis 재고를 1회만 복구",
    method:
      "Testcontainers Kafka에서 강제 consumer 실패, DLT header, manual replay, 두 번째 replay의 멱등성을 검증",
    source: githubSource(
      "concert",
      "src/test/java/com/concert/booking/integration/KafkaDltReplayIntegrationTest.java",
      "L79-L110",
      "./gradlew test --tests '*KafkaDltReplayIntegrationTest'",
    ),
  },
  {
    id: "realtime-subscription-authorization",
    status: "verified",
    scope: "integration",
    label: "구독 인가",
    value: "채팅방 비멤버의 room topic SUBSCRIBE를 실제 STOMP 연결에서 거부",
    method:
      "비멤버 JWT로 연결한 뒤 room topic 구독 시 ERROR frame 또는 연결 종료가 발생하는지 검증",
    source: githubSource(
      "realtime",
      "src/test/java/com/realtime/chat/WebSocketSubscribeAuthorizationIntegrationTest.java",
      "L55-L97",
      "./gradlew test --tests '*WebSocketSubscribeAuthorizationIntegrationTest'",
    ),
  },
  {
    id: "realtime-room-ordering",
    status: "verified",
    scope: "integration",
    label: "room 단위 순서",
    value:
      "같은 roomId 메시지를 같은 Kafka partition에 저장하고 offset 순서와 발행 순서를 일치시킴",
    method:
      "roomId를 Kafka key로 발행한 5개 메시지의 partition, content 순서, Kafka offset 정렬을 검증",
    source: githubSource(
      "realtime",
      "src/test/java/com/realtime/chat/MessageOrderingIntegrationTest.java",
      "L56-L84",
      "./gradlew test --tests '*MessageOrderingIntegrationTest'",
    ),
  },
  {
    id: "realtime-reconnect-sync",
    status: "verified",
    scope: "integration",
    label: "재연결 동기화 경계",
    value:
      "afterMessageId 이후 누락 메시지를 오름차순으로 반환하고 비멤버·타 방 cursor를 거부",
    method:
      "sync API 응답 순서, pagination cursor, membership, cross-room cursor validation을 통합 테스트로 검증",
    source: githubSource(
      "realtime",
      "src/test/java/com/realtime/chat/MessageIntegrationTest.java",
      "L117-L201",
      "./gradlew test --tests '*MessageIntegrationTest'",
    ),
  },
  {
    id: "realtime-room-query-shape",
    status: "verified",
    scope: "local-load",
    label: "채팅방 목록 query shape · 보조 근거",
    value:
      "채팅방 N개 조회 경로를 2N+1 query에서 JPQL projection 1 query로 변경",
    method:
      "Hibernate SQL, JPQL projection, EXPLAIN ANALYZE를 성능 문서에 함께 기록하고 조회 구현과 대조",
    source: githubSource("realtime", "docs/PERF_RESULT.md", "L127-L166"),
  },
  {
    id: "realtime-delivery-completeness",
    status: "measured",
    scope: "local-load",
    label: "수신자 기준 전달 완전성",
    value:
      "1,000 users × 3회 · 회차별 expected 99,900 / unique 99,900 / missing 0 / duplicate 0",
    measuredAt: "2026-05-23",
    scenario:
      "단일 room 1,000명, sender 5명 × 20 messages, send interval 100ms, 회차당 expected delivery 99,900",
    environment: "Docker Compose app-1/app-2 로컬 환경, 3회 반복",
    source: githubSource(
      "realtime",
      "docs/evidence/RECEIVER_MATRIX_1000USERS_REPEAT3_2026-05-23.md",
      "L3-L35",
    ),
  },
  {
    id: "realtime-persisted-order-diagnostic",
    status: "measured",
    scope: "local-load",
    label: "Persisted ID 순서 진단",
    value: "1,000-user receiver matrix 3회 모두 room-global out-of-order 0",
    measuredAt: "2026-05-23",
    scenario:
      "raw receive row의 persisted DB messageId를 기준으로 room-global ordering을 사후 검산",
    environment: "Docker Compose app-1/app-2 로컬 환경, 3회 반복",
    source: githubSource(
      "realtime",
      "docs/evidence/RECEIVER_MATRIX_1000USERS_REPEAT3_2026-05-23.md",
      "L23-L35",
    ),
  },
  {
    id: "billing-api-key-storage",
    status: "verified",
    scope: "integration",
    label: "API Key 저장 경계",
    value:
      "raw key는 생성 시 한 번만 반환하고 DB·목록 응답에는 원문을 남기지 않음",
    method:
      "발급 원문이 key_hash/key_prefix와 일치하지 않고 목록 응답에 rawApiKey가 없는지 검증",
    source: githubSource(
      "billing",
      "src/test/java/io/github/sungjh/aiusagebillinggateway/ApiKeyUsageQuotaIT.java",
      "L23-L41",
      "./gradlew test --tests '*ApiKeyUsageQuotaIT'",
    ),
  },
  {
    id: "billing-usage-idempotency",
    status: "verified",
    scope: "integration",
    label: "사용량 중복 처리",
    value:
      "동일 key·동일 payload는 duplicate로 반환하고 사용량·quota row 1건 유지, 다른 payload는 conflict",
    method:
      "gateway same-key retry와 prompt mismatch를 MockMvc 요청, usage row count, quota counter로 검증",
    source: githubSource(
      "billing",
      "src/test/java/io/github/sungjh/aiusagebillinggateway/ApiKeyUsageQuotaIT.java",
      "L78-L135",
      "./gradlew test --tests '*ApiKeyUsageQuotaIT'",
    ),
  },
  {
    id: "billing-webhook-idempotency",
    status: "verified",
    scope: "integration",
    label: "Webhook 중복 처리",
    value:
      "같은 providerEventId 재전달은 duplicate로 처리하고 payment·audit row를 각각 1건 유지",
    method:
      "서명된 payment webhook을 두 번 전송한 뒤 duplicate 응답, invoice 상태, payment/audit row count를 검증",
    source: githubSource(
      "billing",
      "src/test/java/io/github/sungjh/aiusagebillinggateway/BillingPaymentLedgerAuditIT.java",
      "L81-L137",
      "./gradlew test --tests '*BillingPaymentLedgerAuditIT'",
    ),
  },
  {
    id: "billing-refund-ledger",
    status: "verified",
    scope: "integration",
    label: "Refund reversal ledger",
    value:
      "중복 refund를 1건으로 흡수하고 원 거래를 참조하는 debit/credit reversal을 같은 금액으로 기록",
    method:
      "payment와 refund webhook 처리 후 payment row, reversal account, original group, debit/credit 합계를 검증",
    source: githubSource(
      "billing",
      "src/test/java/io/github/sungjh/aiusagebillinggateway/BillingPaymentLedgerAuditIT.java",
      "L252-L340",
      "./gradlew test --tests '*BillingPaymentLedgerAuditIT'",
    ),
  },
  {
    id: "billing-local-mixed-safety",
    status: "measured",
    scope: "local-load",
    label: "혼합 경로 오류율",
    value: "3회 모두 checks 150/150 · HTTP failure 0/150 · optional skip 0",
    measuredAt: "2026-05-23",
    scenario:
      "5 VU, 30초, gateway 70% / usage 20% / invoice 5% / webhook 5%, 3회 반복",
    environment:
      "local k6 v1.5.0; CPU·memory·Docker resource·dataset 규모는 고정 문서화되지 않음",
    source: githubSource(
      "billing",
      "docs/evidence/FULL_MIXED_REPEAT3_2026-05-23.md",
      "L1-L34",
      "scripts/run-full-mixed-evidence.sh",
    ),
  },
  {
    id: "borrowme-product-list-snapshot",
    status: "measured",
    scope: "local-load",
    label: "상품 목록 현재 snapshot",
    value: "p95 358.1088ms · HTTP failure 0 · checks 10,683/10,683",
    measuredAt: "2026-05-23T00:46:42Z",
    scenario:
      "상품 목록 API product-listing, 3,563 requests, setup-data.sql fixture",
    environment:
      "local app profile · Docker MySQL 8.0 throwaway container · setup-data.sql dataset",
    source: githubSource(
      "borrowMe",
      "docs/evidence/k6/20260523T004642Z-product-listing/summary-metadata.txt",
      "L1-L25",
      "BASE_URL=http://localhost:5001 k6 run k6/test-product-listing.js --summary-export docs/evidence/k6/20260523T004642Z-product-listing/summary.json",
    ),
  },
  {
    id: "borrowme-product-query-guard",
    status: "verified",
    scope: "integration",
    label: "상품 목록 query-count guard",
    value:
      "20개 상품 fetch path SQL 1회, 공개 API 응답 조립 SQL 3회 이하를 Testcontainers에서 고정",
    method:
      "Hibernate Statistics로 fetch join 경로와 GET /api/products 전체 응답 변환의 prepared statement 수를 검증",
    source: githubSource(
      "borrowMe",
      "src/test/java/com/ardkyer/borrowme/ProductQueryTest.java",
      "L226-L257",
      "./gradlew test --tests '*ProductQueryTest'",
    ),
  },
  {
    id: "borrowme-follow-query-guard",
    status: "verified",
    scope: "integration",
    label: "팔로우 여부 일괄 조회 guard",
    value: "인증 상품 목록에서 true/false를 함께 조립하고 SQL 5회 이하로 유지",
    method:
      "MySQL Testcontainers에서 팔로우 fixture를 만들고 API 응답 플래그와 prepared statement 상한을 검증",
    source: githubSource(
      "borrowMe",
      "src/test/java/com/ardkyer/borrowme/ProductQueryTest.java",
      "L259-L309",
      "./gradlew test --tests '*ProductQueryTest'",
    ),
  },
  {
    id: "borrowme-reservation-consistency",
    status: "verified",
    scope: "integration",
    label: "예약 재고 정합성",
    value: "재고 50개에 동시 요청 100건 → 성공 50, 재고 부족 50, 최종 재고 0",
    method:
      "MySQL Testcontainers에서 100 thread를 동시에 시작해 성공/실패, reservation row, 최종 재고 상태를 검증",
    source: githubSource(
      "borrowMe",
      "src/test/java/com/ardkyer/borrowme/ReservationConcurrencyTest.java",
      "L127-L198",
      "./gradlew test --tests '*ReservationConcurrencyTest'",
    ),
  },
];

export const projects: readonly ProjectSummary[] = [
  {
    slug: "concert-booking",
    title: "Concert Booking",
    positioning:
      "좌석 경합과 이벤트 발행 실패를 각각 동기·비동기 복구 경계로 분리한 예매 백엔드",
    domain: "Ticketing / Reservation",
    role: "Personal backend project",
    team: "개인 / BE 1",
    problem:
      "같은 좌석 경합, 대기열 우회, client retry와 Kafka 발행 실패가 한 예매 흐름에서 겹칠 수 있었습니다.",
    decision:
      "PostgreSQL을 좌석·예약 기준 데이터로 두고 Queue Token, 좌석 락, Idempotency-Key, Outbox/DLT를 경계별로 분리했습니다.",
    result:
      "동일 좌석 동시 요청을 1건으로 수렴시키고, Outbox 발행 실패 재시도와 DLT replay의 멱등 복구를 통합 테스트로 검증했습니다.",
    tech: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Kafka"],
    evidenceIds: [
      "concert-seat-single-winner",
      "concert-queue-token-boundary",
      "concert-reservation-idempotency",
      "concert-database-constraints",
      "concert-outbox-retry",
      "concert-dlt-replay",
    ],
    caseStudySlugs: [
      "concert-seat-overselling-consistency",
      "concert-outbox-dlt-recovery",
    ],
    repoUrl: repositories.concert.repoUrl,
  },
  {
    slug: "realtime-chat",
    title: "Realtime Chat",
    positioning:
      "다중 인스턴스 채팅의 구독 인가·room ordering·receiver completeness·재연결 경계를 검증한 백엔드",
    domain: "Realtime Messaging",
    role: "Personal backend project",
    team: "개인 / BE 1",
    problem:
      "WebSocket 연결 성공만으로는 비멤버 구독, room 간 순서 혼선, 수신 누락, 재연결 이후 공백을 설명할 수 없었습니다.",
    decision:
      "SUBSCRIBE 단계 인가, roomId Kafka key, 수신자 기준 delivery matrix, afterMessageId sync API로 전달 경계를 나눴습니다.",
    result:
      "1,000-user 로컬 receiver matrix 3회에서 회차별 99,900건을 중복·누락 없이 검산하고, 구독 인가와 재연결 cursor 경계를 통합 테스트로 고정했습니다.",
    tech: ["Java", "Spring Boot", "WebSocket", "Kafka", "Redis"],
    evidenceIds: [
      "realtime-delivery-completeness",
      "realtime-subscription-authorization",
      "realtime-room-ordering",
      "realtime-reconnect-sync",
      "realtime-persisted-order-diagnostic",
      "realtime-room-query-shape",
    ],
    caseStudySlugs: ["realtime-delivery-consistency"],
    repoUrl: repositories.realtime.repoUrl,
  },
  {
    slug: "ai-usage-billing-gateway",
    title: "AI Usage Billing Gateway",
    positioning:
      "API Key·사용량 중복·Webhook 재전달·Ledger reversal 경계를 테스트로 고정한 과금 게이트웨이",
    domain: "Billing / Usage Gateway",
    role: "Personal backend project",
    team: "개인 / BE 1",
    problem:
      "API key 원문 유출, retry에 의한 사용량 중복, provider webhook 재전달, 환불 원장 불균형을 함께 통제해야 했습니다.",
    decision:
      "key prefix/hash 저장, request hash 기반 idempotency, providerEventId reserve, append-only reversal ledger로 책임을 분리했습니다.",
    result:
      "원문 미저장, usage duplicate/conflict, webhook 중복 흡수, 원 거래를 참조하는 balanced refund reversal을 통합 테스트로 검증했습니다.",
    tech: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Spring Security"],
    evidenceIds: [
      "billing-api-key-storage",
      "billing-usage-idempotency",
      "billing-webhook-idempotency",
      "billing-refund-ledger",
      "billing-local-mixed-safety",
    ],
    caseStudySlugs: ["billing-idempotency-webhook-ledger"],
    repoUrl: repositories.billing.repoUrl,
  },
  {
    slug: "borrow-me",
    title: "BorrowMe",
    positioning:
      "팀 프로젝트의 상품 목록 조회와 예약 재고 회귀를 현재 artifact와 query-count guard로 다시 고정",
    domain: "Rental / Team Project",
    role: "Backend developer",
    team: "11인 팀 프로젝트",
    problem:
      "상품·작성자·해시태그·팔로우 여부를 조립하는 목록 경로와 동시 예약 재고를 회귀 없이 유지해야 했습니다.",
    decision:
      "fetch join과 bulk follow lookup에 query-count guard를 두고, 현재 조건을 기록한 k6 snapshot을 과거 기록과 분리했습니다.",
    result:
      "현재 상품 목록 snapshot에서 p95 358.1088ms와 HTTP failure 0을 기록했고, 핵심 조회 경로의 SQL 상한과 예약 재고 정합성을 Testcontainers로 검증했습니다.",
    tech: ["Java", "Spring Boot", "JPA", "MySQL", "k6"],
    evidenceIds: [
      "borrowme-product-list-snapshot",
      "borrowme-product-query-guard",
      "borrowme-follow-query-guard",
      "borrowme-reservation-consistency",
    ],
    caseStudySlugs: ["borrowme-product-list-n-plus-one"],
    repoUrl: repositories.borrowMe.repoUrl,
  },
  {
    slug: "msa-shop",
    title: "MSA Shop",
    positioning: "서비스 경계와 보상 흐름을 실험한 분산 주문 학습 프로젝트",
    domain: "Commerce / Distributed Transaction",
    role: "Personal backend project",
    problem:
      "분리된 주문·재고·결제·정산 서비스의 실패를 단일 DB transaction으로 다룰 수 없었습니다.",
    decision:
      "RabbitMQ 이벤트와 SAGA/Outbox 보상 흐름으로 서비스 간 실패 경계를 나눴습니다.",
    result: "주문 흐름의 서비스 경계와 보상 책임을 코드와 문서로 정리했습니다.",
    tech: ["Java", "Spring Boot", "RabbitMQ", "PostgreSQL", "Docker"],
    evidenceIds: [],
    caseStudySlugs: [],
    repoUrl: "https://github.com/sjh9714/msa-shop",
  },
  {
    slug: "timedeal-service",
    title: "TimeDeal Service",
    positioning: "재고 경합·캐시·외부 장애 전파를 다룬 타임딜 API",
    domain: "Commerce / Flash Sale",
    role: "Personal backend project",
    problem: "타임딜 주문의 재고 경합과 외부 장애 전파를 제한해야 했습니다.",
    decision: "락, Redis/Caffeine cache, Resilience4j 경계를 조합했습니다.",
    result: "타임딜 주문의 경합과 장애 대응 흐름을 구현했습니다.",
    tech: ["Java", "Spring Boot", "Redis", "Caffeine", "Resilience4j"],
    evidenceIds: [],
    caseStudySlugs: [],
    repoUrl: "https://github.com/sjh9714/timedeal-service",
  },
  {
    slug: "running-app",
    title: "Running App",
    positioning: "러닝 기록·챌린지·플랜을 연결한 제품형 풀스택 프로젝트",
    domain: "Fitness / Product",
    role: "Full-stack developer",
    problem:
      "러닝 활동과 챌린지, 트레이닝 플랜을 한 사용자 흐름으로 연결해야 했습니다.",
    decision: "이벤트 기반 처리와 Redis cache를 백엔드 경계에 적용했습니다.",
    result: "웹과 iOS에서 이어지는 러닝 기록 제품 흐름을 구현했습니다.",
    tech: ["Java", "Spring Boot", "Redis", "Event-driven", "iOS"],
    evidenceIds: [],
    caseStudySlugs: [],
    repoUrl: "https://github.com/sjh9714/Running_App",
  },
  {
    slug: "ai-interview-coach",
    title: "AI Interview Coach",
    positioning: "JD 분석·질문 생성·SSE 피드백 흐름을 나눈 AI 백엔드 프로젝트",
    domain: "AI / Interview",
    role: "Personal backend project",
    problem:
      "LLM 작업과 실시간 피드백을 긴 요청 하나로 묶지 않고 경계를 나눌 필요가 있었습니다.",
    decision:
      "Spring Boot 서비스와 SSE 응답, RAG, Redis cache 역할을 분리했습니다.",
    result:
      "JD 분석부터 질문 생성과 피드백 전달까지의 서비스 흐름을 구현했습니다.",
    tech: ["Java", "Spring Boot", "SSE", "RAG", "Redis"],
    evidenceIds: [],
    caseStudySlugs: [],
    repoUrl: "https://github.com/sjh9714/interview-coach",
  },
  {
    slug: "memory-of-year",
    title: "Memory of Year",
    positioning: "인증과 파일 업로드를 경험한 초기 팀 프로젝트",
    domain: "Early Team Project",
    role: "Backend developer",
    team: "7인 팀 프로젝트",
    problem:
      "앨범·편지·사진·스티커 기능에 인증과 파일 저장 경계가 필요했습니다.",
    decision: "JWT 인증, S3 파일 저장, API 문서화 구조를 적용했습니다.",
    result: "초기 팀 협업에서 인증·파일 업로드 API를 구현했습니다.",
    tech: ["Java", "Spring Boot", "JWT", "S3", "Swagger"],
    evidenceIds: [],
    caseStudySlugs: [],
    repoUrl: "https://github.com/sjh9714/memory_of_year",
  },
];

const featuredProjectSlugs = [
  "concert-booking",
  "realtime-chat",
  "ai-usage-billing-gateway",
  "borrow-me",
] as const;

const archiveProjectSlugs = ["memory-of-year"] as const;

export const featuredProjects = featuredProjectSlugs.map((slug) => {
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    throw new Error(`Missing featured project: ${slug}`);
  }

  return project;
});

export const additionalProjects = projects.filter(
  (project) => !featuredProjectSlugs.some((slug) => slug === project.slug),
);

/** Compatibility export for consumers that still separate the oldest item. */
export const archiveProjects = projects.filter((project) =>
  archiveProjectSlugs.some((slug) => slug === project.slug),
);

const evidenceById = new Map(
  evidenceCatalog.map((evidence) => [evidence.id, evidence] as const),
);

const projectBySlug = new Map(
  projects.map((project) => [project.slug, project] as const),
);

export function getEvidenceById(id: string) {
  return evidenceById.get(id);
}

export function getEvidenceByIds(ids: readonly string[]) {
  return ids.map((id) => {
    const evidence = getEvidenceById(id);

    if (!evidence) {
      throw new Error(`Missing evidence: ${id}`);
    }

    return evidence;
  });
}

export function getProjectBySlug(slug: string) {
  return projectBySlug.get(slug);
}

export function getProjectEvidence(project: ProjectSummary) {
  return getEvidenceByIds(project.evidenceIds);
}

export function getEvidencePreview(project: ProjectSummary, limit = 2) {
  return getProjectEvidence(project).slice(0, limit);
}

export function validateProjectContent(): string[] {
  const issues: string[] = [];
  const evidenceIds = new Set<string>();
  const projectSlugs = new Set<string>();

  for (const evidence of evidenceCatalog) {
    if (evidenceIds.has(evidence.id)) {
      issues.push(`Duplicate evidence id: ${evidence.id}`);
    }
    evidenceIds.add(evidence.id);

    if (!evidence.label.trim() || !evidence.value.trim()) {
      issues.push(`Evidence ${evidence.id} has an empty label or value`);
    }
    if (
      !/^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(evidence.source.repoUrl)
    ) {
      issues.push(`Evidence ${evidence.id} has an invalid repository URL`);
    }
    if (
      !evidence.source.permalink.startsWith(
        `${evidence.source.repoUrl}/blob/`,
      ) ||
      !/\/blob\/[0-9a-f]{40}\//.test(evidence.source.permalink)
    ) {
      issues.push(`Evidence ${evidence.id} is not commit-pinned`);
    }

    if (evidence.status === "measured") {
      if (
        !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}Z)?$/.test(evidence.measuredAt)
      ) {
        issues.push(`Measured evidence ${evidence.id} has an invalid date`);
      }
      if (!evidence.scenario.trim() || !evidence.environment.trim()) {
        issues.push(`Measured evidence ${evidence.id} lacks provenance`);
      }
    } else if (!evidence.method.trim()) {
      issues.push(`Verified evidence ${evidence.id} lacks a method`);
    }
  }

  for (const project of projects) {
    if (projectSlugs.has(project.slug)) {
      issues.push(`Duplicate project slug: ${project.slug}`);
    }
    projectSlugs.add(project.slug);

    if (project.tech.length === 0 || project.tech.length > 5) {
      issues.push(`Project ${project.slug} must expose 1-5 technologies`);
    }
    for (const field of [
      project.title,
      project.positioning,
      project.domain,
      project.role,
      project.problem,
      project.decision,
      project.result,
      project.repoUrl,
    ]) {
      if (!field.trim()) {
        issues.push(`Project ${project.slug} has an empty required field`);
      }
    }
    for (const evidenceId of project.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) {
        issues.push(`Project ${project.slug} references ${evidenceId}`);
      }
    }
  }

  for (const project of featuredProjects) {
    if (
      project.evidenceIds.length === 0 ||
      project.caseStudySlugs.length === 0
    ) {
      issues.push(
        `Featured project ${project.slug} lacks proof or a case study`,
      );
    }
  }

  const publicPayload = JSON.stringify({ evidenceCatalog, projects });
  for (const unsupportedMetric of [
    "1,010",
    "1010",
    "201회",
    "201 queries",
    "201→3",
    "201 → 3",
    "23ms",
  ]) {
    if (publicPayload.includes(unsupportedMetric)) {
      issues.push(`Unsupported public metric: ${unsupportedMetric}`);
    }
  }

  return issues;
}

// Transitional type aliases keep isolated consumers compiling while the UI is
// migrated to the single-source names above.
export type Project = ProjectSummary;
export type ProjectEvidence = Evidence;
export type EvidenceStatus = Evidence["status"];
