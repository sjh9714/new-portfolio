# 성진혁 Backend Resume

Java/Spring 백엔드 개발자 · 신입 / 주니어

- Email: [jinhyuk9714@gmail.com](mailto:jinhyuk9714@gmail.com)
- GitHub: [github.com/sjh9714](https://github.com/sjh9714)
- Portfolio: [new-portfolio-smoky-one-41.vercel.app](https://new-portfolio-smoky-one-41.vercel.app)

## Summary

동시성, 이벤트 정합성, 실시간 메시징, 과금/정산 흐름을 테스트와 수치로 검증하는 Java/Spring 백엔드 개발자입니다. 프로젝트 소개보다 문제, 설계, 결과, 검증 근거를 먼저 설명할 수 있도록 대표 사례를 정리했습니다.

## Core Skills

| 영역                 | 기술                                                 |
| -------------------- | ---------------------------------------------------- |
| Backend              | Java, Spring Boot, JPA, REST API                     |
| Data / Consistency   | PostgreSQL, MySQL, Redis, 트랜잭션 경계, Idempotency |
| Messaging / Realtime | Kafka, RabbitMQ, WebSocket, STOMP, Outbox, DLT       |
| Testing / Operations | Testcontainers, k6, Docker, Prometheus, Grafana      |

## Representative Problem Solving

### Concert Booking

콘서트 예매 / 예약 정합성 · 개인 / BE 1

- 동일 좌석 100개 동시 예매 요청에서 좌석 락, Idempotency-Key, Outbox를 조합해 success 1, fail 99, overselling 0을 검증했습니다.
- DB commit 이후 Kafka 발행 실패를 Outbox, DLT, 수동 재처리 경로로 격리해 예약/결제/만료 이벤트를 복구 가능한 상태로 설계했습니다.
- Redis stock은 빠른 조회와 reconciliation 대상으로 두고, PostgreSQL Reservation / Seat 상태를 최종 기준 데이터로 유지했습니다.

### Realtime Chat

실시간 메시징 / 조회 성능 · 개인 / BE 1

- 채팅방 조회 API의 N+1 쿼리를 제거해 RPS 937에서 1,598, p95 212.85ms에서 149.22ms로 개선했습니다.
- WebSocket receiver matrix에서는 1,000-user local repeat3 기준 expected 99,900 / unique 99,900 / missing 0 / duplicate 0을 기록했고, mixed traffic local scenario에서는 10 rooms x 50 users repeat3 receiver p95 18-20ms와 mixed HTTP failed 0/30/run을 분리했습니다.
- STOMP 구독 인가, roomId 기반 Kafka ordering, Redis presence, reconnect sync를 다중 인스턴스 경계로 나눠 설명할 수 있게 구성했습니다.

### AI Usage Billing Gateway

멀티테넌트 SaaS 과금 / 보안 · 개인 / BE 1

- API Key는 원문을 1회만 반환하고 DB에는 prefix/hash를 저장하는 방식으로 구성했습니다.
- usage idempotency, webhook duplicate/conflict, append-only ledger invariant를 시나리오로 검증했습니다.
- quota reservation, monthly invoice scheduler, refund reversal ledger를 검증하고, mixed usage는 2026-05-23 local repeat3로 측정하되 운영 성능 claim과 분리했습니다.

### BorrowMe

대학생 물건 대여 / 팀 프로젝트 · 11인 팀 프로젝트

- 원본 README 기록 기준 상품 목록 조회 p95는 1,010ms에서 23ms, 쿼리 수는 201회에서 3회로 개선했습니다.
- 2026-05-23 로컬 재측정 기준으로 clean repeat3 k6 snapshot과 상품 목록 query-count guard, follow lookup guard, ranking data path guard, Flyway baseline validation을 회귀 방어 근거로 분리했습니다.
- 팀 프로젝트 맥락에서는 예약 정합성, 조회 성능 개선, 협업 범위를 분리해 설명합니다.

## Additional Projects

| 프로젝트           | 요약                                                                               |
| ------------------ | ---------------------------------------------------------------------------------- |
| MSA Shop           | RabbitMQ 이벤트와 SAGA/Outbox 보상 흐름을 검증한 서비스 경계 실험                  |
| TimeDeal Service   | Redis/Caffeine 캐시, Resilience4j, monitoring 구성을 정리한 커머스 회복성 프로젝트 |
| Running App        | 러닝 기록, 챌린지, 트레이닝 플랜을 다룬 풀스택 프로젝트                            |
| AI Interview Coach | SSE 기반 AI 면접 코칭과 RAG 흐름을 다룬 프로젝트                                   |

## Links

- Portfolio Case Studies: [new-portfolio-smoky-one-41.vercel.app/case-studies](https://new-portfolio-smoky-one-41.vercel.app/case-studies)
- Projects: [new-portfolio-smoky-one-41.vercel.app/projects](https://new-portfolio-smoky-one-41.vercel.app/projects)
