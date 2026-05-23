# 성진혁 Java/Spring 백엔드 포트폴리오

고동시성 예약, 이벤트 정합성, 실시간 메시징, 멀티테넌트 과금 흐름을
문제-설계-검증 근거로 읽히게 만든 한국 백엔드 개발자 포트폴리오입니다.

- Live: [new-portfolio-smoky-one-41.vercel.app](https://new-portfolio-smoky-one-41.vercel.app)
- GitHub: [github.com/sjh9714](https://github.com/sjh9714)
- Email: [jinhyuk9714@gmail.com](mailto:jinhyuk9714@gmail.com)
- Redis 글: [Redis를 캐시로만 쓰지 않기 위해 구현한 대기열, 분산 락, Presence, 정합성 복구][redis-blog]

## 대표 사례

### [Concert Booking](https://new-portfolio-smoky-one-41.vercel.app/case-studies/concert-booking)

- 문제: 동일 좌석 경합, 대기열 우회, 결제/만료 race, Kafka publish 실패
- 설계: 좌석 락 전략, Queue token, Idempotency-Key, Outbox/DLT, Redis reconciliation
- 근거: 동일 좌석 100 concurrent requests -> success 1, fail 99, overselling 0
- 검증: 예약/결제/만료 정합성 Testcontainers 시나리오 검증

### [Realtime Chat](https://new-portfolio-smoky-one-41.vercel.app/case-studies/realtime-chat)

- 문제: WebSocket 구독 권한, 순서, presence, reconnect 복구
- 설계: STOMP 구독 인가, roomId key ordering, Redis presence, reconnect sync
- 근거: 채팅방 조회 API 937 -> 1,598 RPS, p95 212.85ms -> 149.22ms
- 경계: production/mixed delivery benchmark는 추가 측정 예정

### [AI Usage Billing Gateway](https://new-portfolio-smoky-one-41.vercel.app/case-studies/ai-usage-billing-gateway)

- 문제: organization 단위 사용량 수집, API key 보안, usage/webhook 중복 처리
- 설계: tenant isolation, prefix/hash API key, idempotency, quota reservation, ledger
- 근거: usage duplicate/conflict, webhook duplicate/conflict, ledger invariant 시나리오 검증
- 측정: 2026-05-23 local full mixed repeat3

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- MDX case-study content
- shadcn/ui primitives
- lucide-react
- Vitest content guard tests

## GitHub 메타데이터

- 실제 GitHub About topics:
  `backend`, `portfolio`, `java`, `spring-boot`, `kafka`, `redis`, `rabbitmq`,
  `postgresql`, `testcontainers`, `k6`, `event-driven`, `idempotency`,
  `outbox-pattern`, `websocket`, `nextjs`

## 검증 명령

```bash
npm run ci
```

`npm run ci`는 아래 순서로 실행됩니다.

```bash
npm run format:check
npm run typecheck
npm test
npm run lint
npm run build
```

## 콘텐츠 원칙

프로젝트 근거는 `src/content/projects.ts`와 `src/content/case-studies/*.mdx`에 커밋된 내용만 사용합니다.

- 수치가 있는 결과만 `측정 완료`로 표시합니다.
- 반복 가능한 통합 테스트나 시나리오는 `시나리오 검증`으로 표시합니다.
- 공개 운영 데이터나 추가 측정이 필요한 항목은 `추가 측정 예정`으로 표시합니다.
- 운영 트래픽, production benchmark, compliance 같은 근거 없는 주장은 하지 않습니다.
- README와 사이트 문구는 문제-설계-결과-근거 순서로 작성합니다.

[redis-blog]: https://new-portfolio-smoky-one-41.vercel.app/blog/redis-queue-lock-presence-reconciliation
