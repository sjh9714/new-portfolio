import type { ProjectStory } from "./types";

export const projects: readonly ProjectStory[] = [
  {
    slug: "borrow-me",
    title: "BorrowMe",
    kind: "team-product",
    featured: true,
    oneLiner:
      "팀에서 알림을 화면에 연결한 뒤, 시간이 지난 코드를 다시 열어 조회와 재고 경계를 검증했습니다.",
    origin:
      "교내에서 쓰지 않는 물건을 빌리고 돌려주는 흐름을 짧은 해커톤 안에 제품으로 연결했습니다.",
    audience: "가톨릭대학교 이메일을 사용하는 교내 구성원",
    setting: "2024 GGUM 해커톤 · 11인 팀",
    role: "댓글 기반 알림과 REST 전환, 이후 개인 품질 보강",
    contributions: [
      "댓글이 달리면 소유자에게 알림을 남기는 entity·repository·controller 흐름을 구현했습니다.",
      "서버 화면 중심 controller를 REST API로 바꾸고 프론트엔드와 연결해 팀 시연에 포함했습니다.",
      "2026년에는 현재 코드를 다시 검토해 상품 목록 query-count와 동시 예약 재고 불변식을 회귀 테스트로 고정했습니다.",
    ],
    userJourney: [
      "사용자가 대여 물품에 댓글을 남깁니다.",
      "서버가 물품 소유자의 알림 목록에 새 댓글 알림을 기록합니다.",
      "프론트엔드가 REST API로 알림을 불러와 소유자가 댓글로 돌아가게 합니다.",
    ],
    timeline: [
      {
        label: "2024 · Team build",
        title: "알림이 실제 제품 흐름에 들어가게 만들기",
        body: "댓글 알림을 구현하고 프론트엔드가 호출할 REST 경계로 전환해 팀 시연까지 연결했습니다.",
        sourceIds: [
          "borrow-comment-notification-commit",
          "borrow-rest-notification-commit",
          "borrow-team-demo",
        ],
      },
      {
        label: "2026 · Return",
        title: "과거 코드를 현재 기준으로 다시 보기",
        body: "과거 성능 숫자를 반복하는 대신 현재 저장소에서 재현되는 SQL 상한과 재고 불변식만 남겼습니다.",
        sourceIds: ["borrow-query-guard", "borrow-stock-invariant"],
      },
    ],
    turningPoint:
      "팀 시연을 끝낸 코드는 시간이 지나면 설명보다 회귀 방지 장치가 더 중요해진다는 점을 확인했습니다.",
    outcomes: [
      "팀 개발과 이후 개인 보강의 기여 시점을 분리했습니다.",
      "상품 수가 늘어도 조회 SQL 상한이 깨지지 않도록 테스트했습니다.",
      "동시 예약에서도 성공 수와 남은 재고의 합이 초기 재고와 일치하도록 검증했습니다.",
    ],
    currentState:
      "현재 저장소는 과거 팀 제품을 운영 서비스로 주장하지 않고, 다시 검증 가능한 Spring 프로젝트로 유지합니다.",
    limitations: [
      "당시 프론트엔드와 시연은 사용자 확인 사실이며 현재 공개 클라이언트는 없습니다.",
      "공개 회귀 검증은 로컬 실행 범위이며 출처가 불완전한 과거 비교 수치는 사용하지 않습니다.",
    ],
    tech: ["Java", "Spring Boot", "MySQL", "JPA", "Testcontainers"],
    sourceIds: [
      "borrow-comment-notification-commit",
      "borrow-rest-notification-commit",
      "borrow-team-demo",
      "borrow-query-guard",
      "borrow-stock-invariant",
    ],
    caseSlugs: ["borrowme-return-and-harden"],
    flowSlugs: [],
    repoUrl: "https://github.com/sjh9714/borrow_me",
    media: [
      {
        kind: "story-timeline",
        title: "Team demo → Return & verify",
        description:
          "알림 구현에서 시작해 조회·재고 회귀 검증으로 이어진 두 시기",
        accent: "green",
        eyebrow: "TWO CHAPTERS",
        milestones: [
          {
            label: "2024",
            title: "Team demo",
            detail: "댓글 알림 → REST → Client",
          },
          {
            label: "2026",
            title: "Return & verify",
            detail: "Query guard → Stock invariant",
          },
        ],
      },
    ],
  },
  {
    slug: "concert-booking",
    title: "Concert Booking",
    kind: "systems-product",
    featured: true,
    oneLiner:
      "좌석 경합을 통과시키는 코드에서, 실패해도 다음 행동을 알 수 있는 예약 경험으로 확장했습니다.",
    origin:
      "동일 좌석을 한 번만 확정하는 동시성 실험으로 시작했지만 테스트만으로는 대기·충돌·만료를 겪는 사용자의 경험을 설명하기 어려웠습니다.",
    audience: "예약 경합과 재시도를 직접 확인하려는 포트폴리오 방문자",
    setting: "개인 시스템 프로젝트 → 실제 React 예약 클라이언트",
    role: "예약 백엔드 설계, 실패 경계 수정, 제품 클라이언트와 E2E 연결",
    contributions: [
      "대기열 입장부터 좌석 선택, 예약, 만료 카운트다운, 데모 결제까지 한 흐름으로 연결했습니다.",
      "Queue Token 응답을 잃어도 같은 토큰을 되찾고, SSE가 반복 실패하면 polling으로 전환하게 했습니다.",
      "좌석 경합의 패자는 최신 좌석표로 복구하고 만료·취소 뒤 좌석이 다시 반환되게 했습니다.",
    ],
    userJourney: [
      "공연을 고르고 로그인한 뒤 대기열에서 입장 순서를 기다립니다.",
      "READY 토큰으로 좌석을 선택하고, 충돌하면 최신 좌석표에서 다시 고릅니다.",
      "예약 만료 시간을 확인하며 데모 결제를 완료하거나 예약을 취소합니다.",
    ],
    timeline: [
      {
        label: "Lab",
        title: "동일 좌석을 한 건으로 수렴시키기",
        body: "DB lock과 unique constraint, Queue Token, Idempotency-Key가 서로 다른 중복 경계를 맡게 했습니다.",
        sourceIds: [
          "concert-seat-contention-test",
          "concert-idempotency-test",
          "concert-queue-token-test",
        ],
      },
      {
        label: "Product client",
        title: "실패가 사용자에게 어떻게 보이는지 연결하기",
        body: "대기·좌석 충돌·응답 유실·만료를 화면 상태와 다음 행동으로 번역했습니다.",
        sourceIds: [
          "concert-product-rebuild-commit",
          "concert-product-journey-e2e",
          "concert-queue-transport-e2e",
          "concert-seat-release-e2e",
        ],
      },
      {
        label: "Recovery",
        title: "commit 이후 실패도 되돌아올 경로 남기기",
        body: "Outbox와 DLT는 성공을 꾸미는 장치가 아니라 실패를 관찰하고 다시 처리하는 운영 경계로 사용했습니다.",
        sourceIds: [
          "concert-outbox-test",
          "concert-dlt-test",
          "concert-seat-release-e2e",
        ],
      },
    ],
    turningPoint:
      "실제 클라이언트를 붙이자 Queue Token 재발급과 응답 유실처럼 통합 테스트만으로는 보이지 않던 제품 결함이 드러났습니다.",
    outcomes: [
      "예약의 성공·충돌·만료·취소를 하나의 사용자 여정으로 재현합니다.",
      "동일 좌석과 동일 요청의 중복을 서로 다른 경계에서 흡수합니다.",
      "이벤트 발행·소비 실패를 상태로 남기고 replay할 수 있습니다.",
    ],
    currentState:
      "React 클라이언트와 Docker demo, 브라우저 E2E까지 저장소에 포함하며 공개 서버는 아직 운영하지 않습니다.",
    limitations: [
      "결제는 실제 PG가 아닌 데모 확정 흐름입니다.",
      "공개 근거는 Testcontainers와 로컬 브라우저 E2E 범위이며 production 처리량을 뜻하지 않습니다.",
    ],
    tech: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Kafka"],
    sourceIds: [
      "concert-seat-contention-test",
      "concert-idempotency-test",
      "concert-outbox-test",
      "concert-dlt-test",
      "concert-product-rebuild-commit",
      "concert-queue-token-test",
      "concert-product-journey-e2e",
      "concert-seat-release-e2e",
      "concert-queue-transport-e2e",
    ],
    caseSlugs: ["concert-seat-contention", "concert-event-recovery"],
    flowSlugs: ["concert-seat-contention", "concert-event-recovery"],
    repoUrl: "https://github.com/sjh9714/concert-booking",
    media: [
      {
        kind: "product-preview",
        title: "Seat selection & recovery",
        description: "대기열, 좌석 상태, 예약 만료가 이어지는 실제 클라이언트",
        accent: "blue",
        imageSrc: "/work/concert-seat-selection.webp",
        imageAlt:
          "Concert Booking React 클라이언트에서 VIP 1열 5번 좌석을 선택한 화면",
      },
    ],
  },
  {
    slug: "realtime-chat",
    title: "Realtime Chat",
    kind: "systems-product",
    featured: true,
    oneLiner:
      "연결 성공이 아니라, 메시지가 저장되고 끊긴 뒤 다시 이어지는 순간까지 채팅 제품으로 만들었습니다.",
    origin:
      "구독 인가와 Kafka ordering을 검증한 메시징 실험에서 출발했지만 실제 사용자는 연결보다 메시지가 사라지지 않는지를 경험합니다.",
    audience: "두 브라우저에서 전송·수신·재연결을 확인하려는 포트폴리오 방문자",
    setting: "개인 메시징 프로젝트 → 실제 React 채팅 클라이언트",
    role: "메시지 영속화 경계 재설계, WebSocket 클라이언트, 재연결 E2E",
    contributions: [
      "메시지를 SENDING·ACCEPTED·PERSISTED·FAILED 상태로 구분해 낙관적 UI와 서버 결과를 합쳤습니다.",
      "DB commit 전에 상대에게 보일 수 있던 독립 broadcast 경로를 제거했습니다.",
      "오프라인 동안 빠진 메시지를 마지막 DB ID 이후부터 다시 가져오고 중복 없이 합쳤습니다.",
    ],
    userJourney: [
      "닉네임으로 상대를 찾아 1:1 대화방을 엽니다.",
      "메시지는 SENDING에서 ACCEPTED, DB 저장이 끝나면 PERSISTED로 바뀝니다.",
      "상대가 오프라인이었다면 재연결 뒤 마지막 persisted ID 이후 메시지를 보충합니다.",
    ],
    timeline: [
      {
        label: "Lab",
        title: "구독 권한과 room ordering을 나누어 검증하기",
        body: "handshake 인증만 믿지 않고 SUBSCRIBE 시점 membership과 room 단위 partition을 확인했습니다.",
        sourceIds: ["realtime-subscribe-auth-test", "realtime-ordering-test"],
      },
      {
        label: "Product client",
        title: "사용자가 보는 메시지 상태 만들기",
        body: "발신자의 임시 메시지를 서버가 저장한 DB message로 치환하고 상대 수신을 분리했습니다.",
        sourceIds: [
          "realtime-client-state-test",
          "realtime-persisted-ack-test",
          "realtime-lifecycle-e2e",
        ],
      },
      {
        label: "Repair",
        title: "저장보다 먼저 보이는 phantom delivery 없애기",
        body: "DB commit 뒤에만 broadcast하고, 재연결 cursor가 실시간 전달 공백을 메우게 했습니다.",
        sourceIds: [
          "realtime-lifecycle-refactor-commit",
          "realtime-persistence-boundary-test",
          "realtime-redelivery-test",
          "realtime-lifecycle-e2e",
        ],
      },
    ],
    turningPoint:
      "실제 화면에서 상대가 본 메시지가 DB에 없을 수 있다는 사실이 드러나면서 전달 순서를 다시 설계했습니다.",
    outcomes: [
      "발신자는 accepted와 persisted를 구분해 확인합니다.",
      "비멤버는 REST와 STOMP 양쪽에서 방에 접근할 수 없습니다.",
      "연결이 끊겨도 마지막 persisted ID 이후를 동기화해 대화를 이어갑니다.",
    ],
    currentState:
      "React 채팅 클라이언트와 두 사용자 브라우저 E2E를 포함하며 공개 서버는 아직 운영하지 않습니다.",
    limitations: [
      "상대방의 읽음 여부를 실시간으로 전달하는 receipt UI는 제공하지 않습니다.",
      "공개 테스트는 로컬 Kafka·Redis·DB 환경의 정합성 검증이며 운영 사용자 수를 뜻하지 않습니다.",
    ],
    tech: ["Java", "Spring Boot", "WebSocket", "Kafka", "Redis"],
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
    caseSlugs: ["realtime-message-lifecycle"],
    flowSlugs: ["realtime-message-lifecycle"],
    repoUrl: "https://github.com/sjh9714/realtime-chat",
    media: [
      {
        kind: "product-preview",
        title: "Persisted conversation",
        description:
          "전송 상태와 reconnect sync를 드러내는 실제 채팅 클라이언트",
        accent: "rose",
        imageSrc: "/work/realtime-conversation.webp",
        imageAlt:
          "Realtime Chat React 클라이언트에서 Alice와 Bob이 저장 완료 상태를 확인하며 대화하는 화면",
      },
    ],
  },
  {
    slug: "memory-of-year",
    title: "Memory of Year",
    kind: "team-product",
    featured: true,
    oneLiner:
      "팀 시연을 위해 인증에서 앨범·편지·사진까지 이어지는 백엔드 첫 흐름을 만들었습니다.",
    origin:
      "한 해의 사진과 편지를 앨범 안에 모으는 경험을 간지톤 팀 프로젝트로 구현했습니다.",
    audience: "사진과 편지를 하나의 추억 앨범으로 남기려는 사용자",
    setting: "2024 간지톤 팀 프로젝트",
    role: "로그인·회원가입과 앨범·편지·사진 백엔드 기반",
    contributions: [
      "JWT 기반 로그인·회원가입과 사용자 repository를 구현했습니다.",
      "앨범 생성·조회와 앨범에 속한 편지·사진 저장의 초기 도메인 경계를 만들었습니다.",
      "프론트엔드와 API를 연결해 팀 시연에 포함했습니다.",
    ],
    userJourney: [
      "사용자가 회원가입과 로그인을 거쳐 자신의 앨범을 만듭니다.",
      "앨범 안에 편지와 사진을 저장합니다.",
      "팀 프론트엔드가 같은 API를 호출해 시연 화면에 앨범 내용을 보여줍니다.",
    ],
    timeline: [
      {
        label: "2024 · Foundation",
        title: "사용자가 앨범을 만들기까지의 첫 API 연결",
        body: "인증과 앨범·편지·사진의 repository·controller 기반을 한 커밋 흐름으로 만들었습니다.",
        sourceIds: ["memory-original-contribution"],
      },
      {
        label: "Team demo",
        title: "프론트엔드가 사용할 응답으로 맞추기",
        body: "팀 클라이언트와 API를 연결해 앨범 경험을 시연했습니다.",
        sourceIds: ["memory-team-demo"],
      },
      {
        label: "Personal archive",
        title: "내가 맡은 범위를 개인 저장소로 정리하기",
        body: "팀 전체 결과를 소유한 것처럼 보이지 않도록 원본 저장소와 담당 범위를 함께 남기고, 앨범 소유권과 S3 경계를 다시 검증했습니다.",
        sourceIds: [
          "memory-current-repository",
          "memory-album-authorization-test",
          "memory-s3-boundary-test",
        ],
      },
    ],
    turningPoint:
      "팀 저장소의 전체 결과와 내 초기 기여를 분리해 설명할 provenance가 필요했습니다.",
    outcomes: [
      "인증에서 앨범 콘텐츠 저장까지 프론트가 호출할 초기 API 흐름을 제공했습니다.",
      "원본 팀 저장소의 사용자 커밋으로 담당 범위를 추적할 수 있습니다.",
      "개인 정리본에서 앨범 소유권과 MySQL·S3 경계를 통합 테스트로 다시 검증했습니다.",
    ],
    currentState:
      "현재는 당시 시연 서비스가 아니라 담당 백엔드 범위를 보존하고 다시 검증하는 개인 저장소입니다.",
    limitations: [
      "전체 팀 규모·행사 기간·외부 배포·사용자 수는 공개 자료로 확인되지 않아 쓰지 않습니다.",
      "프론트엔드 연동과 시연은 사용자 확인 사실이며 현재 공개 클라이언트는 없습니다.",
    ],
    tech: ["Java", "Spring Boot", "MySQL", "JPA", "S3"],
    sourceIds: [
      "memory-original-contribution",
      "memory-team-demo",
      "memory-current-repository",
      "memory-album-authorization-test",
      "memory-s3-boundary-test",
    ],
    caseSlugs: [],
    flowSlugs: [],
    repoUrl: "https://github.com/sjh9714/memory_of_year",
    media: [
      {
        kind: "scope-map",
        title: "Auth → Album → Letter & Photo",
        description: "팀 제품 안에서 직접 맡은 백엔드 범위를 분리한 기능 맵",
        accent: "amber",
        eyebrow: "OWNED BACKEND SCOPE",
        stages: [
          { index: "01", label: "Auth" },
          { index: "02", label: "Album" },
          { index: "03", label: "Letter" },
          { index: "04", label: "Photo" },
        ],
        note: "Team client integration & demo",
      },
    ],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export const alsoShipped = [
  {
    label: "Public Tool",
    title: "Agent-Gate",
    description:
      "AI-generated PR의 위험한 권한·설정 변경을 검사하는 Action과 CLI를 Marketplace와 npm에 공개했고, 첫 외부 기여 PR이 열렸습니다.",
    href: "https://github.com/sjh9714/Agent-Gate",
    sourceIds: [
      "agent-gate-marketplace",
      "agent-gate-npm-v031",
      "agent-gate-external-pr",
    ],
  },
  {
    label: "Side Product",
    title: "FocusYou",
    description:
      "차단 상태와 해제 실패를 단위 테스트로 고정하고, 서명·공증한 DMG 릴리스를 반복했습니다.",
    href: "https://github.com/sjh9714/FocusYou",
    sourceIds: [
      "focusyou-blocking-lifecycle-test",
      "focusyou-macos-test-run",
      "focusyou-release-v2312",
      "focusyou-release",
    ],
  },
] as const;

export const additionalSystemsWork = [
  {
    title: "AI Usage Billing Boundary Simulator",
    description:
      "API Key 원문 비저장, usage retry 중복 처리, webhook 중복 수신, debit·credit 균형을 통합 테스트로 검증한 mock provider 기반 시스템 프로젝트입니다.",
    href: "https://github.com/sjh9714/ai-usage-billing-gateway",
    sourceIds: [
      "billing-repository",
      "billing-api-key-storage-test",
      "billing-usage-idempotency-test",
      "billing-webhook-idempotency-test",
      "billing-ledger-balance-test",
    ],
  },
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
