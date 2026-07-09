import {
  getEvidenceByIds,
  getProjectBySlug,
  type Evidence,
  type ProjectSummary,
} from "@/content/projects";

export type CaseStudy = {
  slug: string;
  projectSlug: string;
  title: string;
  summary: string;
  problem: string[];
  naiveApproach: string[];
  decisions: string[];
  results: string[];
  evidenceIds: string[];
  cardEvidenceId: string;
  heroEvidenceIds: string[];
  architecture: {
    imageSrc: string;
    alt: string;
    caption: string;
    mobileSteps: string[];
  };
  limitations: string[];
  nextValidation: string[];
  interviewQuestions: string[];
};

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "concert-seat-overselling-consistency",
    projectSlug: "concert-booking",
    title: "좌석 경합을 Queue Token·락·멱등성으로 한 건에 수렴시키기",
    summary:
      "진입 권한, 좌석 변경, 재시도 중복을 한 장치에 몰지 않고 각각 Queue Token·DB lock·Idempotency-Key 경계로 나눴습니다.",
    problem: [
      "같은 좌석을 여러 사용자가 동시에 읽고 갱신하면 두 예약이 모두 성공할 수 있었습니다.",
      "대기열 token 오사용과 client retry가 좌석 락 바깥에서 중복 예약을 만들 수 있었습니다.",
    ],
    naiveApproach: [
      "애플리케이션의 조회 후 상태 변경만으로는 다른 instance의 동시 요청을 직렬화할 수 없습니다.",
      "Redis 재고만 기준으로 삼으면 DB 예약과 어긋났을 때 복구 기준이 흐려집니다.",
    ],
    decisions: [
      "Queue Token을 사용자와 공연 일정에 바인딩하고 성공한 요청에서만 소비합니다.",
      "좌석 변경은 PostgreSQL transaction과 lock 안에서 처리합니다.",
      "Idempotency-Key와 DB unique constraint는 동일 요청 replay와 persistence 중복을 마지막 경계에서 분리합니다.",
    ],
    results: [
      "Testcontainers에서 동일 좌석 10개 동시 요청을 성공 1건, 실패 9건으로 수렴시켰습니다.",
      "세 예약 전략 모두 token 오사용·만료·동시 재사용과 same-key retry를 거부하거나 기존 결과로 수렴시켰습니다.",
    ],
    evidenceIds: [
      "concert-seat-single-winner",
      "concert-queue-token-boundary",
      "concert-reservation-idempotency",
      "concert-database-constraints",
    ],
    cardEvidenceId: "concert-seat-single-winner",
    heroEvidenceIds: [
      "concert-seat-single-winner",
      "concert-queue-token-boundary",
    ],
    architecture: {
      imageSrc: "/architecture/cases/concert-seat-overselling-consistency.svg",
      alt: "사용자 요청이 Queue Token 검증, 예약 트랜잭션의 멱등성 확인과 좌석 락, PostgreSQL 저장으로 이어지는 좌석 정합성 구조",
      caption:
        "진입 권한은 Queue Token, 중복 요청은 Idempotency-Key, 최종 좌석 상태는 PostgreSQL transaction이 책임집니다.",
      mobileSteps: [
        "Queue Token을 userId와 scheduleId에 바인딩해 요청 진입 권한을 확인합니다.",
        "예약 transaction 안에서 Idempotency-Key와 기존 결과를 먼저 확인합니다.",
        "대상 좌석을 lock한 뒤 예약과 좌석 상태를 함께 commit합니다.",
        "동일 key 재시도는 기존 예약을 반환하고 다른 payload는 conflict로 종료합니다.",
      ],
    },
    limitations: [
      "공개 대표 수치는 Testcontainers 통합 테스트 범위이며 production capacity를 뜻하지 않습니다.",
      "세 락 전략의 처리량 비교는 측정 날짜가 명시된 artifact가 없어 주요 근거에서 제외했습니다.",
    ],
    nextValidation: [
      "Redis 장애 시 Queue Token의 fail-open/fail-closed 정책을 별도 장애 시나리오로 고정합니다.",
      "production과 유사한 네트워크 지연에서 lock timeout과 retry budget을 측정합니다.",
    ],
    interviewQuestions: [
      "Queue Token과 좌석 락은 각각 어떤 경쟁 조건을 막나요?",
      "Redis를 좌석의 최종 기준 데이터로 두지 않은 이유는 무엇인가요?",
      "같은 Idempotency-Key에 다른 좌석 payload가 오면 어떻게 처리하나요?",
    ],
  },
  {
    slug: "concert-outbox-dlt-recovery",
    projectSlug: "concert-booking",
    title:
      "DB commit 이후 이벤트 실패를 Outbox·DLT로 복구 가능한 상태에 남기기",
    summary:
      "트랜잭션 성공과 Kafka 발행 성공을 같은 것으로 보지 않고, Outbox 상태 전이와 DLT replay를 명시적인 복구 경로로 만들었습니다.",
    problem: [
      "예약 또는 결제 commit 뒤 Kafka 발행이 실패하면 DB 상태와 downstream 처리가 갈라질 수 있었습니다.",
      "consumer 실패를 무한 재시도하면 poison message가 정상 메시지 처리를 막을 수 있었습니다.",
    ],
    naiveApproach: [
      "transaction 종료 직후 Kafka를 직접 호출하면 process crash 구간에서 발행 여부를 복구하기 어렵습니다.",
      "consumer 예외를 같은 queue에서 계속 retry하면 실패 원인과 재처리 이력이 남지 않습니다.",
    ],
    decisions: [
      "도메인 변경과 Outbox insert를 같은 DB transaction에 묶습니다.",
      "relay는 PENDING·FAILED·PUBLISHED·DEAD 상태와 backoff를 통해 발행 책임을 추적합니다.",
      "consumer 실패는 DLT로 격리하고 운영자가 원인을 확인한 뒤 원 topic으로 replay합니다.",
    ],
    results: [
      "강제 Kafka 실패 뒤 Outbox가 FAILED로 남고 다음 retry에서 PUBLISHED로 전이되는 경로를 검증했습니다.",
      "강제 consumer 실패를 DLT로 옮긴 뒤 replay해 좌석과 Redis 재고를 복구하고, 두 번째 replay에도 값이 늘지 않음을 검증했습니다.",
    ],
    evidenceIds: ["concert-outbox-retry", "concert-dlt-replay"],
    cardEvidenceId: "concert-dlt-replay",
    heroEvidenceIds: ["concert-outbox-retry", "concert-dlt-replay"],
    architecture: {
      imageSrc: "/architecture/cases/concert-outbox-dlt-recovery.svg",
      alt: "예약 트랜잭션과 Outbox, relay, Kafka, consumer, DLT, replay가 PostgreSQL과 Redis 복구로 이어지는 이벤트 실패 구조",
      caption:
        "Outbox는 발행 실패를 DB에 남기고, DLT는 consumer 실패를 정상 흐름에서 격리합니다.",
      mobileSteps: [
        "예약 transaction이 도메인 변경과 Outbox event를 함께 commit합니다.",
        "relay가 event를 claim하고 Kafka 발행 결과에 따라 상태를 바꿉니다.",
        "consumer 실패 메시지는 원인 정보와 함께 DLT에 격리합니다.",
        "manual replay가 원 topic으로 되돌리고 좌석 반환은 멱등하게 처리합니다.",
      ],
    },
    limitations: [
      "Outbox와 DLT는 exactly-once가 아니라 중복을 흡수할 상태와 키가 있다는 의미입니다.",
      "공개 근거는 로컬 Testcontainers 복구 시나리오이며 장시간 broker 장애 운영 수치는 아닙니다.",
    ],
    nextValidation: [
      "Outbox backlog 크기와 oldest event age를 기준으로 alert threshold를 검증합니다.",
      "broker 장시간 중단 후 relay catch-up 시간과 downstream 중복률을 측정합니다.",
    ],
    interviewQuestions: [
      "Outbox insert와 도메인 변경은 왜 같은 transaction이어야 하나요?",
      "FAILED와 DEAD를 분리한 이유는 무엇인가요?",
      "DLT replay가 중복 실행돼도 좌석 재고가 늘지 않는 근거는 무엇인가요?",
    ],
  },
  {
    slug: "realtime-delivery-consistency",
    projectSlug: "realtime-chat",
    title: "연결 성공이 아닌 수신자 기준으로 채팅 전달 경계를 검증하기",
    summary:
      "구독 권한, room ordering, 수신자별 누락·중복, reconnect cursor를 분리해 WebSocket 전달 정합성을 검증했습니다.",
    problem: [
      "WebSocket handshake 성공만으로는 비멤버 구독과 수신자별 메시지 누락을 발견할 수 없었습니다.",
      "재연결한 client가 어느 메시지부터 다시 받아야 하는지 명시적인 경계가 필요했습니다.",
    ],
    naiveApproach: [
      "발신자 self-echo 성공률은 모든 room member가 메시지를 받았다는 근거가 아닙니다.",
      "메시지 timestamp만 비교하면 broker partition과 DB 저장 순서를 정확히 진단하기 어렵습니다.",
    ],
    decisions: [
      "room topic SUBSCRIBE 시점에 membership을 다시 확인합니다.",
      "roomId를 Kafka key로 사용하고 persisted messageId로 room 전체 순서를 진단합니다.",
      "receiver matrix와 afterMessageId sync API로 실시간 수신과 재연결 복구를 분리합니다.",
    ],
    results: [
      "1,000-user 로컬 receiver matrix를 3회 실행해 회차별 expected 99,900과 unique 99,900, missing 0, duplicate 0을 확인했습니다.",
      "비멤버 SUBSCRIBE 거부와 afterMessageId 이후 오름차순 복구, 타 방 cursor 거부를 통합 테스트로 고정했습니다.",
      "persisted messageId 기반 사후 검산에서 3회 모두 room-global out-of-order 0을 기록했습니다.",
    ],
    evidenceIds: [
      "realtime-subscription-authorization",
      "realtime-room-ordering",
      "realtime-reconnect-sync",
      "realtime-delivery-completeness",
      "realtime-persisted-order-diagnostic",
      "realtime-room-query-shape",
    ],
    cardEvidenceId: "realtime-delivery-completeness",
    heroEvidenceIds: [
      "realtime-delivery-completeness",
      "realtime-subscription-authorization",
      "realtime-reconnect-sync",
    ],
    architecture: {
      imageSrc: "/architecture/cases/realtime-delivery-consistency.svg",
      alt: "STOMP 구독 인가에서 roomId Kafka partition, 메시지 저장과 fan-out, receiver matrix, reconnect sync API로 이어지는 채팅 전달 구조",
      caption:
        "실시간 fan-out 결과와 재연결 이후 DB sync를 별도로 검증해 전달 공백을 찾습니다.",
      mobileSteps: [
        "STOMP SUBSCRIBE 시 채팅방 membership을 확인합니다.",
        "SEND 메시지는 roomId key로 Kafka 같은 partition에 전달합니다.",
        "저장된 messageId와 수신자별 raw row로 누락·중복·순서를 검산합니다.",
        "재연결 client는 마지막 messageId 이후 내역을 sync API로 보충합니다.",
      ],
    },
    limitations: [
      "1,000-user 결과는 동일한 로컬 Docker Compose 환경의 scenario evidence이며 production benchmark가 아닙니다.",
      "persisted ID 순서 0건은 해당 세 실행의 진단 결과이지 모든 장애 상황의 전역 순서 보장은 아닙니다.",
    ],
    nextValidation: [
      "다중 room mixed traffic과 instance 재시작을 함께 넣은 장시간 soak를 측정합니다.",
      "Kafka rebalance와 reconnect 폭주 구간의 누락·중복·복구 시간을 분리해 측정합니다.",
    ],
    interviewQuestions: [
      "SUBSCRIBE 인가를 handshake 인증과 별도로 둔 이유는 무엇인가요?",
      "roomId key가 보장하는 순서의 범위는 어디까지인가요?",
      "receiver matrix의 expected delivery 분모는 어떻게 계산했나요?",
    ],
  },
  {
    slug: "billing-idempotency-webhook-ledger",
    projectSlug: "ai-usage-billing-gateway",
    title: "API Key·사용량 retry·Webhook 재전달을 Ledger 정합성까지 연결하기",
    summary:
      "보안 경계를 API Key 원문 미저장으로 좁히고, 사용량과 webhook의 서로 다른 중복 키를 원장 결과까지 검증했습니다.",
    problem: [
      "API key 원문이 저장되면 DB 또는 목록 응답 유출이 즉시 인증 우회로 이어질 수 있었습니다.",
      "client retry와 provider webhook 재전달은 사용량·결제·환불을 중복 반영할 수 있었습니다.",
    ],
    naiveApproach: [
      "idempotency key 존재 여부만 보면 같은 key의 다른 payload를 정상 retry로 오인합니다.",
      "invoice status만 수정하면 결제와 환불 금액이 어떻게 이동했는지 추적하기 어렵습니다.",
    ],
    decisions: [
      "raw API key는 생성 시 한 번만 반환하고 prefix와 hash만 저장합니다.",
      "사용량은 Idempotency-Key와 request hash, webhook은 providerEventId와 payload hash로 중복과 conflict를 나눕니다.",
      "환불은 원 거래 group을 참조하는 append-only ledger debit/credit reversal로 기록합니다.",
    ],
    results: [
      "DB와 key 목록 응답에 raw key가 남지 않는 경계를 통합 테스트로 검증했습니다.",
      "동일 usage retry를 row 1건으로 유지하고 payload mismatch를 conflict로 분리했습니다.",
      "중복 refund를 1건으로 흡수하고 원 거래를 참조하는 debit/credit reversal의 균형을 검증했습니다.",
    ],
    evidenceIds: [
      "billing-api-key-storage",
      "billing-usage-idempotency",
      "billing-webhook-idempotency",
      "billing-refund-ledger",
      "billing-local-mixed-safety",
    ],
    cardEvidenceId: "billing-usage-idempotency",
    heroEvidenceIds: [
      "billing-api-key-storage",
      "billing-usage-idempotency",
      "billing-webhook-idempotency",
    ],
    architecture: {
      imageSrc: "/architecture/cases/billing-idempotency-webhook-ledger.svg",
      alt: "API Key hash 인증에서 사용량 멱등 처리, invoice, payment webhook 중복 처리, append-only ledger와 audit로 이어지는 과금 구조",
      caption:
        "사용량 retry와 provider webhook은 서로 다른 식별자와 payload hash로 중복을 흡수합니다.",
      mobileSteps: [
        "Gateway가 원문을 저장하지 않은 API Key hash로 요청을 인증합니다.",
        "사용량 요청은 organization과 Idempotency-Key 범위에서 request hash를 비교합니다.",
        "Webhook은 providerEventId를 먼저 reserve하고 payload hash conflict를 차단합니다.",
        "결제와 환불은 원 거래를 참조하는 append-only ledger entry로 남깁니다.",
      ],
    },
    limitations: [
      "이 사례는 API Key, 중복 처리, webhook, ledger 경계만 다루며 tenant isolation 전체를 증명하지 않습니다.",
      "Ledger는 단순화한 balanced-entry model이며 회계 기준 준수를 주장하지 않습니다.",
    ],
    nextValidation: [
      "서로 다른 organization 자원 접근을 막는 cross-tenant negative test matrix를 별도로 공개합니다.",
      "실제 provider sandbox의 지연·재전달 패턴을 포함한 webhook 장애 시나리오를 측정합니다.",
    ],
    interviewQuestions: [
      "사용량 idempotency와 webhook duplicate key를 다르게 잡은 이유는 무엇인가요?",
      "같은 key에 다른 payload가 오면 왜 conflict여야 하나요?",
      "환불을 기존 ledger row 수정 대신 reversal entry로 남긴 이유는 무엇인가요?",
    ],
  },
  {
    slug: "borrowme-product-list-n-plus-one",
    projectSlug: "borrow-me",
    title: "상품 목록 조회를 현재 artifact와 query-count guard로 다시 검증하기",
    summary:
      "과거 개선 수치를 반복하지 않고, 현재 repository에서 재현 가능한 local snapshot과 SQL 상한만 공개 근거로 남겼습니다.",
    problem: [
      "상품, 작성자, 해시태그, 팔로우 여부를 응답으로 조립하며 collection lazy loading이 다시 늘어날 수 있었습니다.",
      "팀 프로젝트의 과거 성능 기록과 현재 실행 조건이 달라 직접적인 전후 비교를 만들 수 없었습니다.",
    ],
    naiveApproach: [
      "DTO 변환 중 연관 객체를 순회하면 상품 수에 비례해 SQL이 증가할 수 있습니다.",
      "실행 환경과 raw artifact가 없는 과거 숫자를 현재 결과와 비교하면 개선 효과를 과장하게 됩니다.",
    ],
    decisions: [
      "상품·작성자·해시태그는 fetch path를 고정하고 Hibernate Statistics로 SQL 상한을 검증합니다.",
      "인증 사용자의 팔로우 여부는 후보 사용자 ID를 모아 bulk lookup합니다.",
      "현재 k6 snapshot의 날짜·fixture·runtime을 함께 공개하고 과거 기록은 화면에서 제거합니다.",
    ],
    results: [
      "현재 local 상품 목록 snapshot에서 p95 358.1088ms, HTTP failure 0, checks 10,683/10,683을 기록했습니다.",
      "20개 상품 fetch path는 SQL 1회, 공개 API 응답 조립은 SQL 3회 이하로 고정했습니다.",
      "팔로우 여부를 포함한 인증 응답은 SQL 5회 이하로 유지했습니다.",
    ],
    evidenceIds: [
      "borrowme-product-list-snapshot",
      "borrowme-product-query-guard",
      "borrowme-follow-query-guard",
    ],
    cardEvidenceId: "borrowme-product-query-guard",
    heroEvidenceIds: [
      "borrowme-product-list-snapshot",
      "borrowme-product-query-guard",
    ],
    architecture: {
      imageSrc: "/architecture/cases/borrowme-product-list-n-plus-one.svg",
      alt: "상품 목록 API가 fetch join으로 상품과 작성자와 해시태그를 조회하고 bulk follow lookup을 합쳐 응답하는 조회 구조",
      caption:
        "연관 데이터 fetch와 팔로우 여부 lookup을 분리하고 각각의 SQL 상한을 회귀 테스트로 고정합니다.",
      mobileSteps: [
        "상품 목록 요청이 상품·작성자·해시태그 fetch path를 한 번 호출합니다.",
        "조회한 작성자 ID를 모아 현재 사용자의 팔로우 여부를 bulk lookup합니다.",
        "두 결과를 DTO로 조립해 lazy loading 없이 응답합니다.",
        "Hibernate Statistics가 상품 수 증가 시 SQL 상한 회귀를 감지합니다.",
      ],
    },
    limitations: [
      "현재 snapshot은 local 환경의 한 실행 조건이며 production 성능을 뜻하지 않습니다.",
      "공개 결과는 현재 p95와 query-count guard뿐이며 과거 전후 수치는 근거 부족으로 제거했습니다.",
    ],
    nextValidation: [
      "동일 fixture에서 pagination 크기별 p95와 DB 실행 계획을 반복 측정합니다.",
      "상품 수와 팔로우 관계 cardinality를 늘려 query 상한과 응답 크기 변화를 함께 확인합니다.",
    ],
    interviewQuestions: [
      "fetch join과 bulk lookup을 한 쿼리로 합치지 않은 이유는 무엇인가요?",
      "query-count guard가 실제 응답 속도 측정을 대체할 수 없는 이유는 무엇인가요?",
      "현재 snapshot을 과거 개선 수치와 직접 비교하지 않은 이유는 무엇인가요?",
    ],
  },
];

const caseStudyBySlug = new Map(
  caseStudies.map((caseStudy) => [caseStudy.slug, caseStudy] as const),
);

export const legacyCaseStudyAliases: ReadonlyMap<string, string> = new Map([
  ["concert-booking", "concert-seat-overselling-consistency"],
  ["realtime-chat", "realtime-delivery-consistency"],
  ["chat-room-n-plus-one-rps", "realtime-delivery-consistency"],
  ["ai-usage-billing-gateway", "billing-idempotency-webhook-ledger"],
  ["msa-shop", "/projects#msa-shop"],
]);

export const featuredPortfolioCases = caseStudies;

export const featuredPortfolioProjectSlugs = Array.from(
  new Set(caseStudies.map((caseStudy) => caseStudy.projectSlug)),
);

export type FeaturedProjectGroup = {
  projectSlug: string;
  project: ProjectSummary;
  cases: CaseStudy[];
  primaryEvidence: Evidence[];
};

export const featuredProjectGroups: FeaturedProjectGroup[] =
  featuredPortfolioProjectSlugs.map((projectSlug) => {
    const project = getProjectBySlug(projectSlug);

    if (!project) {
      throw new Error(`Missing project for case study group: ${projectSlug}`);
    }

    const cases = getCaseStudiesByProjectSlug(projectSlug);

    return {
      projectSlug,
      project,
      cases,
      primaryEvidence: getEvidenceByIds(
        Array.from(new Set(cases.map((caseStudy) => caseStudy.cardEvidenceId))),
      ),
    };
  });

export function getCaseStudyBySlug(slug: string) {
  return caseStudyBySlug.get(slug);
}

export function getCaseStudiesByProjectSlug(projectSlug: string) {
  return caseStudies.filter(
    (caseStudy) => caseStudy.projectSlug === projectSlug,
  );
}

export function getCaseStudyEvidence(caseStudy: CaseStudy) {
  return getEvidenceByIds(caseStudy.evidenceIds);
}

export function getCardEvidence(caseStudy: CaseStudy) {
  return getEvidenceByIds([caseStudy.cardEvidenceId])[0];
}

export function getHeroEvidence(caseStudy: CaseStudy) {
  return getEvidenceByIds(caseStudy.heroEvidenceIds);
}

export function getFeaturedPortfolioProjectGroups() {
  return featuredProjectGroups;
}

export function isFeaturedPortfolioProject(projectSlug: string) {
  return featuredPortfolioProjectSlugs.includes(projectSlug);
}

export function getSupportingProjects<TProject extends { slug: string }>(
  projectList: readonly TProject[],
) {
  return projectList.filter(
    (project) => !isFeaturedPortfolioProject(project.slug),
  );
}

export function getPortfolioCaseProjectBadge(caseStudy: CaseStudy) {
  const project = getProjectBySlug(caseStudy.projectSlug);
  const projectCases = getCaseStudiesByProjectSlug(caseStudy.projectSlug);

  if (!project) {
    throw new Error(`Missing project for case study: ${caseStudy.slug}`);
  }

  if (projectCases.length === 1) {
    return project.title;
  }

  return `${project.title} · Deep Dive ${
    projectCases.findIndex((item) => item.slug === caseStudy.slug) + 1
  }/${projectCases.length}`;
}

export function validateCaseStudyContent(): string[] {
  const issues: string[] = [];
  const slugs = new Set<string>();

  for (const caseStudy of caseStudies) {
    if (slugs.has(caseStudy.slug)) {
      issues.push(`Duplicate case study slug: ${caseStudy.slug}`);
    }
    slugs.add(caseStudy.slug);

    const project = getProjectBySlug(caseStudy.projectSlug);
    if (!project) {
      issues.push(
        `Case study ${caseStudy.slug} references ${caseStudy.projectSlug}`,
      );
    } else if (!project.caseStudySlugs.includes(caseStudy.slug)) {
      issues.push(
        `Project ${project.slug} does not reference case ${caseStudy.slug}`,
      );
    }

    const referencedIds = new Set(caseStudy.evidenceIds);
    for (const evidenceId of [
      caseStudy.cardEvidenceId,
      ...caseStudy.heroEvidenceIds,
    ]) {
      if (!referencedIds.has(evidenceId)) {
        issues.push(
          `Case study ${caseStudy.slug} highlights unlisted evidence ${evidenceId}`,
        );
      }
    }

    try {
      getEvidenceByIds(caseStudy.evidenceIds);
    } catch (error) {
      issues.push(
        error instanceof Error ? error.message : `Invalid evidence reference`,
      );
    }

    for (const section of [
      caseStudy.problem,
      caseStudy.naiveApproach,
      caseStudy.decisions,
      caseStudy.results,
    ]) {
      if (section.length === 0 || section.length > 3) {
        issues.push(
          `Case study ${caseStudy.slug} sections must contain 1-3 bullets`,
        );
      }
    }

    if (
      !caseStudy.architecture.imageSrc.endsWith(`${caseStudy.slug}.svg`) ||
      !caseStudy.architecture.alt.trim() ||
      !caseStudy.architecture.caption.trim() ||
      caseStudy.architecture.mobileSteps.length === 0
    ) {
      issues.push(`Case study ${caseStudy.slug} has invalid architecture data`);
    }
    if (
      caseStudy.limitations.length === 0 ||
      caseStudy.nextValidation.length === 0 ||
      caseStudy.interviewQuestions.length === 0
    ) {
      issues.push(`Case study ${caseStudy.slug} lacks folded review content`);
    }
  }

  for (const [legacySlug, destination] of legacyCaseStudyAliases) {
    if (Object.prototype.hasOwnProperty.call(Object.prototype, legacySlug)) {
      issues.push(`Unsafe prototype alias: ${legacySlug}`);
    }
    if (!destination.startsWith("/") && !slugs.has(destination)) {
      issues.push(`Alias ${legacySlug} points to missing case ${destination}`);
    }
  }

  const publicPayload = JSON.stringify(caseStudies);
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

// Compatibility aliases for page modules being migrated in parallel.
export type PortfolioCase = CaseStudy;
export const getPortfolioCaseBySlug = getCaseStudyBySlug;
export const getPortfolioCasesByProjectSlug = getCaseStudiesByProjectSlug;
