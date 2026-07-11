import type { ProjectStory } from "./types";

export const projects: readonly ProjectStory[] = [
  {
    kind: "team-product",
    slug: "memory-of-year",
    title: "Memory of Year",
    featuredOrder: 1,
    oneLiner:
      "7명이 만든 추억 앨범에서 인증과 콘텐츠 API를 맡고, 화면 연결부터 AWS 배포까지 처음 끝냈습니다.",
    period: "2024 · 약 2개월",
    overview: {
      context: "멋쟁이사자처럼 데모데이 · 7인 팀",
      role: "인증·앨범·편지·사진 백엔드, AWS 배포",
      turningPoint: "로컬 API를 팀 화면이 호출하는 배포 API로 바꾼 순간",
      proof: "원본 기여 커밋과 2026년 소유권·S3 경계 테스트",
      primaryProofId: "memory-original-contribution",
    },
    context:
      "사진과 편지를 한 해의 앨범으로 남기는 제품을 디자인 1명, 프론트엔드 2명, 백엔드 4명이 함께 만들었습니다.",
    duration: "약 2개월",
    team: "7명 · 디자인 1, 프론트엔드 2, 백엔드 4",
    role: "JWT 인증과 앨범·편지·사진의 백엔드 기반을 맡고, 프론트엔드 연동과 AWS 배포를 담당했습니다.",
    collaboration: [
      "프론트엔드가 바로 연결할 수 있도록 인증과 앨범 응답을 함께 맞췄습니다.",
      "EC2, 데이터베이스, S3, HTTPS를 직접 구성해 로컬 API를 팀 시연 환경으로 옮겼습니다.",
      "디자인과 프론트엔드가 만든 실제 화면에서 사진과 편지가 저장되는 흐름을 확인했습니다.",
    ],
    shippedOutcome: [
      "회원가입과 로그인 뒤 앨범을 만들고 사진·편지를 남기는 흐름을 팀 화면에 연결했습니다.",
      "배포된 API를 사용해 데모데이에서 팀 시연을 진행했습니다.",
      "2026년에는 당시 작업과 분리해 앨범 소유권, MySQL, S3 경계를 통합 테스트로 다시 확인했습니다.",
    ],
    chapters: [
      {
        id: "memory-product",
        eyebrow: "실제 화면",
        title: "사용자가 앨범을 만들고 추억을 여는 흐름",
        summary:
          "생성 시안의 가상 화면 대신, 당시 팀이 실제로 연결해 시연한 화면을 그대로 남겼습니다.",
        body: [
          "회원가입과 로그인 뒤 자신의 앨범을 만들고 꾸밉니다.",
          "사진과 편지를 저장하고, 완성된 앨범에서 다시 열어 봅니다.",
        ],
        sourceIds: ["memory-team-context", "memory-original-contribution"],
        visualIds: [
          "memory-start",
          "memory-auth",
          "memory-album",
          "memory-letter",
        ],
      },
      {
        id: "memory-role",
        eyebrow: "팀과 역할",
        title: "화면이 필요로 하는 백엔드 경계를 맡았습니다",
        summary:
          "프로젝트 전체를 혼자 만들었다고 말하지 않고, 원본 팀 저장소에서 확인되는 기여만 구분합니다.",
        body: [
          "JWT 인증과 사용자 저장소, 앨범·편지·사진의 초기 도메인과 API를 구현했습니다.",
          "프론트엔드 개발자와 요청·응답을 맞추며 실제 화면에 연결했습니다.",
        ],
        sourceIds: ["memory-team-context", "memory-original-contribution"],
        proofId: "memory-original-contribution",
      },
      {
        id: "memory-deployment",
        eyebrow: "첫 배포",
        title: "EC2에서 HTTPS와 데이터 저장 경계까지 직접 연결했습니다",
        summary:
          "서버만 실행하는 데서 끝내지 않고, 팀 클라이언트가 호출할 주소와 사진 저장소를 함께 구성했습니다.",
        body: [
          "API 서버는 EC2에, 데이터는 DB와 S3에 나눠 배치했습니다.",
          "HTTPS를 적용한 배포 API로 팀 시연을 진행했습니다.",
        ],
        sourceIds: ["memory-deployment-context"],
        visualIds: ["memory-deployment-map"],
      },
    ],
    revisit: [
      {
        id: "memory-revisit",
        eyebrow: "2026년 재검토",
        title: "당시 결과와 지금의 보강을 섞지 않았습니다",
        summary:
          "오래된 팀 코드를 다시 열어 다른 사용자의 앨범 수정과 S3 HTTP 경계를 현재 테스트로 고정했습니다.",
        body: [
          "다른 사용자의 앨범 수정 요청이 거부되는지 실제 HTTP·MySQL 경계에서 확인했습니다.",
          "S3 업로드 요청이 AWS SDK를 거쳐 기대한 HTTP 계약으로 나가는지 별도 경계 테스트를 남겼습니다.",
        ],
        sourceIds: [
          "memory-album-authorization-test",
          "memory-s3-boundary-test",
        ],
        proofId: "memory-album-authorization-test",
      },
    ],
    visualIds: ["memory-gallery"],
    tech: ["Java", "Spring Boot", "MySQL", "JPA", "AWS"],
    sourceIds: [
      "memory-team-context",
      "memory-deployment-context",
      "memory-original-contribution",
      "memory-album-authorization-test",
      "memory-s3-boundary-test",
    ],
    limitations: [
      "데모데이 시연 이후의 운영 기간, 사용자 수, 가용성은 확인되지 않아 주장하지 않습니다.",
      "2026년 테스트는 당시 팀 결과가 아니라 개인 저장소에서 별도로 보강한 작업입니다.",
    ],
    repoUrl: "https://github.com/sjh9714/memory_of_year",
  },
  {
    kind: "productized-system",
    slug: "concert-booking",
    title: "Concert Booking",
    featuredOrder: 2,
    oneLiner:
      "좌석을 한 명에게만 주는 코드에서 출발해, 충돌한 사용자도 예매를 이어 가는 화면과 복구 경로를 만들었습니다.",
    period: "2026 · 개인 프로젝트",
    overview: {
      context: "동시성 실험에서 실제 React 예약 흐름으로 확장",
      role: "백엔드 설계·클라이언트·브라우저 E2E",
      turningPoint: "경합의 패자가 오류 화면에 갇히는 문제를 발견",
      proof: "두 브라우저 좌석 경합과 예약 복구 E2E",
      primaryProofId: "concert-product-journey-e2e",
    },
    hypothesis:
      "정합성이 맞는 예약 시스템이라면 승자 한 명만 만드는 데서 끝나지 않고, 응답을 잃거나 좌석을 놓친 사용자도 다음 행동을 선택할 수 있어야 합니다.",
    acceptanceCriteria: [
      "두 사용자가 같은 좌석을 선택해도 한 건만 예약되고, 패자는 최신 좌석표에서 다시 선택할 수 있습니다.",
      "Queue Token 발급 응답을 잃어도 같은 토큰을 되찾아 대기 흐름을 이어 갑니다.",
      "같은 요청의 재시도는 한 건으로 수렴하고, 취소·만료 뒤 좌석은 다시 선택할 수 있습니다.",
    ],
    userJourney: [
      "공연을 고르고 로그인한 뒤 대기열에 들어갑니다.",
      "입장 토큰을 받아 키보드로 좌석을 고릅니다.",
      "충돌하면 최신 좌석표에서 다른 좌석을 선택합니다.",
      "만료 시간을 확인하며 데모 결제를 끝내거나 취소합니다.",
    ],
    milestones: [
      {
        id: "concert-lab",
        eyebrow: "2026년 2월",
        title: "동일 좌석을 한 건으로 수렴시키는 실험",
        summary:
          "DB lock과 constraint가 좌석 경합을 맡고, Queue Token과 Idempotency-Key가 서로 다른 중복 경계를 맡도록 나눴습니다.",
        body: [
          "동일 좌석에 동시에 접근해도 한 건만 성공하는지 통합 테스트로 확인했습니다.",
          "토큰 발급과 재진입이 같은 사용자에게 같은 결과로 수렴하도록 만들었습니다.",
        ],
        sourceIds: ["concert-seat-contention-test", "concert-queue-token-test"],
        proofId: "concert-seat-contention-test",
      },
      {
        id: "concert-product",
        eyebrow: "2026년 7월",
        title: "실패 시나리오를 화면과 브라우저 두 개로 재현",
        summary:
          "실제 클라이언트를 붙이자 통합 테스트에서는 보이지 않던 응답 유실과 패자 복구 동선이 드러났습니다.",
        body: [
          "좌석 충돌의 패자는 최신 좌석표를 다시 받아 예매를 계속합니다.",
          "SSE가 끊기면 다시 연결하고, 반복 실패하면 polling으로 대기 상태를 확인합니다.",
        ],
        sourceIds: [
          "concert-product-rebuild-commit",
          "concert-product-journey-e2e",
          "concert-seat-release-e2e",
        ],
        visualIds: ["concert-seat-client", "concert-seat-recovery-map"],
        proofId: "concert-product-journey-e2e",
      },
      {
        id: "concert-recovery",
        eyebrow: "실패 복구",
        title: "예약 commit 뒤 이벤트가 실패해도 되돌아올 경로를 남김",
        summary:
          "좌석 경쟁과 이벤트 전달 실패는 다른 문제이므로, Outbox와 DLT를 별도 사례로 분리했습니다.",
        body: [
          "이벤트 발행 실패를 Outbox 상태로 남겨 다시 처리합니다.",
          "반복 실패는 DLT로 격리하고 replay해 좌석 반환 같은 후속 작업을 복구합니다.",
        ],
        sourceIds: ["concert-outbox-test", "concert-dlt-test"],
        visualIds: ["concert-event-recovery-map"],
        proofId: "concert-outbox-test",
      },
    ],
    guidedFlows: [
      {
        id: "seat-contention",
        title: "같은 좌석을 눌렀을 때, 패자는 어떻게 다시 예매하는가",
        summary:
          "정합성 검사와 사용자 복구 동선이 한 여정에서 어떻게 만나는지 단계별로 확인합니다.",
        initialVariant: "designed",
        variants: [
          {
            id: "designed",
            label: "복구가 있는 흐름",
            steps: [
              {
                id: "seat-ready",
                title: "두 사용자가 입장 토큰을 받고 같은 좌석을 봅니다",
                body: "두 브라우저에는 아직 선택 가능한 같은 좌석이 보입니다.",
                state: "같은 좌석 · 두 사용자",
                visualId: "concert-seat-client",
                sourceIds: ["concert-product-journey-e2e"],
              },
              {
                id: "seat-race",
                title: "두 요청이 거의 동시에 예약 경계에 도착합니다",
                body: "서버는 좌석 row와 고유 제약으로 한 요청만 확정합니다.",
                state: "동시 요청 · 승자 결정",
                visualId: "concert-seat-client",
                sourceIds: ["concert-seat-contention-test"],
              },
              {
                id: "seat-loser",
                title: "패자에게 충돌 이유와 다음 행동을 돌려줍니다",
                body: "오류 화면에 가두지 않고 최신 좌석표를 다시 요청합니다.",
                state: "충돌 응답 · 좌석표 갱신",
                visualId: "concert-seat-client",
                sourceIds: ["concert-product-journey-e2e"],
              },
              {
                id: "seat-recover",
                title: "패자는 다른 좌석을 골라 예매를 이어 갑니다",
                body: "두 사용자 모두 화면에서 결과와 가능한 다음 행동을 확인합니다.",
                state: "다른 좌석 선택 · 여정 계속",
                visualId: "concert-seat-client",
                sourceIds: ["concert-product-journey-e2e"],
              },
            ],
          },
        ],
      },
      {
        id: "event-recovery",
        title: "이벤트 발행이 실패해도 좌석 상태를 복구하는 과정",
        summary:
          "예약 트랜잭션 이후의 실패를 상태로 남기고 다시 처리하는 별도 흐름입니다.",
        initialVariant: "designed",
        variants: [
          {
            id: "designed",
            label: "Outbox와 DLT 복구",
            steps: [
              {
                id: "outbox-write",
                title: "예약과 이벤트 기록을 같은 트랜잭션에 남깁니다",
                body: "예약만 저장되고 발행할 이벤트가 사라지는 틈을 막습니다.",
                state: "예약 commit · Outbox NEW",
                sourceIds: ["concert-outbox-test"],
              },
              {
                id: "outbox-retry",
                title: "발행 실패를 지우지 않고 재시도 상태로 바꿉니다",
                body: "다음 처리기가 실패 횟수와 상태를 보고 다시 시도합니다.",
                state: "발행 실패 · RETRY",
                sourceIds: ["concert-outbox-test"],
              },
              {
                id: "outbox-dead",
                title: "반복 실패는 DEAD 상태와 DLT로 격리합니다",
                body: "무한 재시도 대신 확인 가능한 실패 경계로 이동합니다.",
                state: "격리 · DLT",
                sourceIds: ["concert-dlt-test"],
              },
              {
                id: "outbox-replay",
                title: "replay가 같은 이벤트를 중복 없이 복구합니다",
                body: "이미 처리된 이벤트는 건너뛰고 빠진 후속 작업만 다시 수행합니다.",
                state: "멱등 replay · 복구 완료",
                sourceIds: ["concert-dlt-test"],
              },
            ],
          },
        ],
      },
    ],
    visualIds: ["concert-seat-client"],
    tech: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Kafka"],
    sourceIds: [
      "concert-product-rebuild-commit",
      "concert-seat-contention-test",
      "concert-queue-token-test",
      "concert-product-journey-e2e",
      "concert-seat-release-e2e",
      "concert-outbox-test",
      "concert-dlt-test",
    ],
    limitations: [
      "결제는 실제 PG가 아닌 데모 확정 흐름이며 공개 서버는 운영하지 않습니다.",
      "테스트는 로컬 Docker·브라우저 환경의 재현 결과이며 production 처리량을 뜻하지 않습니다.",
    ],
    repoUrl: "https://github.com/sjh9714/concert-booking",
  },
  {
    kind: "productized-system",
    slug: "realtime-chat",
    title: "Realtime Chat",
    featuredOrder: 3,
    oneLiner:
      "메시지가 보이는 순간이 아니라 저장된 순간을 기준으로 전달 순서를 다시 만들고, 재연결 뒤 빠진 대화를 보충했습니다.",
    period: "2026 · 개인 프로젝트",
    overview: {
      context: "Kafka·WebSocket 실험에서 실제 1:1 채팅으로 확장",
      role: "영속화 경계·React 클라이언트·두 사용자 E2E",
      turningPoint: "DB에 없는 메시지가 상대 화면에 먼저 보일 수 있던 구조",
      proof: "DB 실패·Redis 재전달·오프라인 재연결 E2E",
      primaryProofId: "realtime-lifecycle-e2e",
    },
    hypothesis:
      "실시간 채팅의 완료 기준은 소켓 전송이 아니라, 메시지가 저장되고 끊긴 사용자가 다시 찾을 수 있는 상태여야 합니다.",
    acceptanceCriteria: [
      "발신자는 보내는 중, 큐 접수, 저장 완료를 구분해서 봅니다.",
      "상대방에게는 DB commit이 끝난 메시지만 전달됩니다.",
      "오프라인 사용자는 재연결 뒤 마지막 저장 ID 이후의 메시지를 중복 없이 보충합니다.",
    ],
    userJourney: [
      "닉네임으로 상대를 찾아 1:1 대화방을 엽니다.",
      "메시지를 보내면 보내는 중에서 큐 접수, 저장 완료로 상태가 바뀝니다.",
      "상대가 오프라인이어도 재연결 뒤 빠진 메시지를 순서대로 받습니다.",
    ],
    milestones: [
      {
        id: "realtime-lab",
        eyebrow: "2026년 2월",
        title: "연결보다 구독 권한과 room 순서를 먼저 검증",
        summary:
          "handshake 인증만 믿지 않고 구독 시점의 방 멤버십과 room 단위 메시지 순서를 나눠 확인했습니다.",
        body: [
          "방에 속하지 않은 사용자는 STOMP 구독과 REST 조회 모두 거부합니다.",
          "메시지 순서를 방 단위 partition 안에서 유지합니다.",
        ],
        sourceIds: ["realtime-subscribe-auth-test"],
        proofId: "realtime-subscribe-auth-test",
      },
      {
        id: "realtime-turning-point",
        eyebrow: "전환점",
        title: "DB 저장 전 broadcast되는 구조를 제거",
        summary:
          "독립 consumer 두 개가 같은 이벤트를 처리하면 상대가 DB에 없는 메시지를 먼저 볼 수 있었습니다.",
        body: [
          "한 consumer가 DB commit을 끝낸 뒤 Redis broadcast와 발신자 저장 완료 응답을 보냅니다.",
          "Redis publish 실패를 삼키지 않고 Kafka 재전달로 넘깁니다.",
        ],
        sourceIds: [
          "realtime-product-rebuild-commit",
          "realtime-persistence-boundary-test",
          "realtime-redelivery-test",
        ],
        visualIds: ["realtime-persist-map"],
        proofId: "realtime-persistence-boundary-test",
      },
      {
        id: "realtime-product",
        eyebrow: "2026년 7월",
        title: "Alice와 Bob의 화면에서 저장·전달·재연결을 확인",
        summary:
          "실패 시나리오를 먼저 정하고 실제 클라이언트와 두 브라우저 E2E로 결과를 확인했습니다.",
        body: [
          "clientMessageId로 임시 행을 저장된 메시지로 교체하고 DB ID로 중복 수신을 제거합니다.",
          "재연결 시 마지막 저장 ID 이후를 조회해 실시간 전달 공백만 보충합니다.",
        ],
        sourceIds: ["realtime-lifecycle-e2e"],
        visualIds: ["realtime-client"],
        proofId: "realtime-lifecycle-e2e",
      },
    ],
    guidedFlows: [
      {
        id: "message-lifecycle",
        title: "보낸 메시지가 저장되고 다시 이어질 때까지",
        summary:
          "사용자에게 보이는 상태와 서버 내부의 저장·전달 순서를 같은 단계에서 읽습니다.",
        initialVariant: "designed",
        variants: [
          {
            id: "designed",
            label: "저장 뒤 전달",
            steps: [
              {
                id: "message-sending",
                title: "클라이언트가 임시 메시지를 먼저 표시합니다",
                body: "clientMessageId를 가진 행을 보내는 중 상태로 화면에 둡니다.",
                state: "보내는 중",
                visualId: "realtime-client",
                sourceIds: ["realtime-lifecycle-e2e"],
              },
              {
                id: "message-accepted",
                title: "서버가 요청을 검증하고 큐 접수를 알립니다",
                body: "접수와 저장 완료를 같은 상태로 꾸미지 않습니다.",
                state: "큐 접수",
                visualId: "realtime-client",
                sourceIds: ["realtime-lifecycle-e2e"],
              },
              {
                id: "message-persisted",
                title: "같은 room 순서 안에서 DB commit을 먼저 끝냅니다",
                body: "저장된 DB ID와 clientMessageId가 이후 전달의 기준이 됩니다.",
                state: "DB 저장 완료",
                visualId: "realtime-client",
                sourceIds: ["realtime-persistence-boundary-test"],
              },
              {
                id: "message-broadcast",
                title: "저장된 메시지만 상대와 발신자에게 전달합니다",
                body: "상대는 DB에 다시 조회할 수 있는 메시지만 받습니다.",
                state: "상대 수신 · 저장됨",
                visualId: "realtime-client",
                sourceIds: ["realtime-redelivery-test"],
              },
              {
                id: "message-offline",
                title: "오프라인 동안의 메시지는 DB에 남아 있습니다",
                body: "소켓 연결 여부가 메시지의 보존 여부를 결정하지 않습니다.",
                state: "오프라인 · DB 보존",
                visualId: "realtime-client",
                sourceIds: ["realtime-lifecycle-e2e"],
              },
              {
                id: "message-sync",
                title: "재연결 뒤 빠진 구간만 순서대로 보충합니다",
                body: "마지막 저장 ID 이후를 반복 조회하고 DB ID로 중복을 제거합니다.",
                state: "재연결 · 공백 보충",
                visualId: "realtime-client",
                sourceIds: ["realtime-lifecycle-e2e"],
              },
            ],
          },
        ],
      },
    ],
    visualIds: ["realtime-client"],
    tech: ["Java", "Spring Boot", "WebSocket", "Kafka", "Redis"],
    sourceIds: [
      "realtime-product-rebuild-commit",
      "realtime-persistence-boundary-test",
      "realtime-redelivery-test",
      "realtime-subscribe-auth-test",
      "realtime-lifecycle-e2e",
    ],
    limitations: [
      "상대방의 읽음 여부를 표시하는 receipt는 구현하지 않았습니다.",
      "공개 테스트는 로컬 Kafka·Redis·DB 환경의 정합성 검증이며 운영 사용자 수를 뜻하지 않습니다.",
    ],
    repoUrl: "https://github.com/sjh9714/realtime-chat",
  },
  {
    kind: "team-product",
    slug: "borrow-me",
    title: "BorrowMe",
    featuredOrder: 4,
    oneLiner:
      "첫 백엔드 협업에서 알림을 화면에 연결했고, 2년 뒤 돌아와 비어 있던 대여 생명주기를 직접 완성했습니다.",
    period: "2024 팀 프로젝트 · 2026 개인 보강",
    overview: {
      context: "GGUM 해커톤 · 준비 약 2주 · 본 행사 1박 2일 · 11인 팀",
      role: "2024 알림·REST 연동, 2026 대여 생명주기",
      turningPoint: "예약 버튼 이후 승인·인도·반납 경로가 비어 있던 코드",
      proof: "역할·상태·재고 복원을 검증하는 MySQL 통합 테스트",
      primaryProofId: "borrow-lifecycle-proof",
    },
    context:
      "교내 물품 대여 서비스를 11명이 함께 만든 첫 백엔드 팀 프로젝트였습니다.",
    duration: "준비 약 2주 · 본 행사 1박 2일",
    team: "11인 팀",
    role: "2024년에는 댓글 기반 알림과 읽음·삭제, REST 전환과 프론트 연동을 맡았습니다. 예약 기능 전체를 당시 기여로 주장하지 않습니다.",
    collaboration: [
      "댓글이 생기면 상품 소유자에게 알림을 남기는 흐름을 구현했습니다.",
      "서버 화면 중심 controller를 REST API로 바꾸고 프론트엔드와 연결했습니다.",
      "연동 결과를 팀 시연에서 확인했습니다.",
    ],
    shippedOutcome: [
      "첫 백엔드 역할을 실제 프론트엔드 호출까지 연결했습니다.",
      "현재 남아 있는 공개 커밋으로 알림과 REST 전환 범위를 확인할 수 있습니다.",
    ],
    chapters: [
      {
        id: "borrow-team",
        eyebrow: "2024년 팀 협업",
        title: "댓글 알림을 화면이 사용할 REST 경계로 연결",
        summary:
          "작은 기능이었지만 저장, 조회, 읽음·삭제와 프론트 호출까지 처음 함께 맞췄습니다.",
        body: [
          "댓글 저장 시 상품 소유자에게 알림을 만들었습니다.",
          "NotificationController를 REST 응답으로 전환해 팀 화면과 연결했습니다.",
        ],
        sourceIds: [
          "borrow-team-context",
          "borrow-notification-commit",
          "borrow-rest-notification-commit",
        ],
        proofId: "borrow-notification-commit",
      },
    ],
    revisit: [
      {
        id: "borrow-lifecycle",
        eyebrow: "2026년 개인 보강",
        title: "요청 이후 비어 있던 대여의 끝까지 구현",
        summary:
          "요청, 승인, 인도, 반납·취소를 역할·상태·재고·알림·이력이 함께 움직이는 하나의 서비스로 묶었습니다.",
        body: [
          "예약자와 상품 소유자에게 허용된 행동을 나누고 관계없는 사용자는 차단합니다.",
          "요청 시 재고를 hold하고 거절·취소·반납에서 정확히 한 번 복원합니다.",
          "중복 action은 상태, transition history, 알림 한 건으로 수렴합니다.",
        ],
        sourceIds: ["borrow-lifecycle-proof"],
        visualIds: ["borrow-lifecycle-map"],
        proofId: "borrow-lifecycle-proof",
      },
    ],
    guidedFlows: [
      {
        id: "rental-lifecycle",
        title: "대여 요청부터 반납까지 누가 무엇을 바꾸는가",
        summary:
          "과거 화면을 꾸며내지 않고 역할, 상태, 재고 변화만 읽을 수 있게 정리했습니다.",
        initialVariant: "return",
        variants: [
          {
            id: "return",
            label: "정상 반납",
            steps: [
              {
                id: "rental-request",
                title: "예약자가 대여를 요청합니다",
                body: "인증 사용자로 행위자를 정하고 상품 재고 한 개를 hold합니다.",
                state: "REQUESTED · 재고 hold",
                sourceIds: ["borrow-lifecycle-proof"],
              },
              {
                id: "rental-approve",
                title: "상품 소유자가 요청을 승인합니다",
                body: "소유자에게만 APPROVE를 허용하고 transition과 알림을 한 번 기록합니다.",
                state: "APPROVED · 인도 대기",
                sourceIds: ["borrow-lifecycle-proof"],
              },
              {
                id: "rental-borrowed",
                title: "상품을 인도한 사실을 소유자가 표시합니다",
                body: "진행 중 대여는 상품이 archive되어도 이력을 잃지 않습니다.",
                state: "BORROWED · 대여 중",
                sourceIds: ["borrow-lifecycle-proof"],
              },
              {
                id: "rental-returned",
                title: "반납 확인과 재고 복원을 한 번에 끝냅니다",
                body: "중복 요청이 와도 재고, transition, 알림은 한 번만 바뀝니다.",
                state: "RETURNED · 재고 복원",
                sourceIds: ["borrow-lifecycle-proof"],
              },
            ],
          },
        ],
      },
    ],
    visualIds: [],
    tech: ["Java", "Spring Boot", "MySQL", "JPA", "Testcontainers"],
    sourceIds: [
      "borrow-team-context",
      "borrow-notification-commit",
      "borrow-rest-notification-commit",
      "borrow-lifecycle-proof",
    ],
    limitations: [
      "2024년 당시 화면은 남아 있지 않아 가상의 제품 UI를 만들지 않았습니다.",
      "2024년 예약 기능 전체를 본인 기여로 주장하지 않으며, 새 생명주기는 2026년 개인 작업입니다.",
    ],
    repoUrl: "https://github.com/sjh9714/borrow_me",
  },
];

export const featuredProjects = [...projects].sort(
  (a, b) => a.featuredOrder - b.featuredOrder,
);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
