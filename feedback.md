아래 4개를 **대표 레포**로 보고 냉정하게 분석하겠습니다.

1. `concert-booking`
2. `realtime-chat`
3. `ai-usage-billing-gateway`
4. `borrow_me`

MSA Shop은 포트폴리오에서는 보조 프로젝트로 두는 게 맞습니다. 지금 대표 레포 4개는 “동시성/정합성”, “실시간/메시징”, “과금/보안”, “조회 성능/팀 프로젝트”를 각각 담당하므로 조합이 좋습니다.

PDF 기준으로도 이력서와 포트폴리오는 프로젝트를 전부 나열하는 게 아니라, 이력서의 `문제 + 해결 + 결과 + 도메인` 한 줄을 포트폴리오에서 확장하는 방식이 핵심입니다. 또 신입/주니어는 프로젝트 3~4개 정도가 부담이 적고, 기본기 60%와 본인 강점 40%를 함께 보여주는 게 좋다고 설명합니다.

---

# 전체 결론

현재 4개 레포의 역할은 이렇게 잡아야 합니다.

| 레포                         | 포트폴리오 역할                      | 현재 상태                       | 개선 방향                                                         |
| ---------------------------- | ------------------------------------ | ------------------------------- | ----------------------------------------------------------------- |
| **concert-booking**          | 메인 1번, 동시성·정합성·Outbox       | 이미 강함                       | 운영성, pending k6, runbook, alerting 보강                        |
| **realtime-chat**            | 메인 2번, 실시간 메시징·Kafka·Redis  | 구조 좋음, 핵심 latency pending | send-to-receive, delivery completeness, mixed traffic 측정        |
| **ai-usage-billing-gateway** | 차별화 레포, 과금·보안·멀티테넌트    | 도메인은 최고, 아직 미완성      | invoice scheduler, quota reservation, refund ledger, k6 benchmark |
| **borrow_me**                | 기본기 증명, N+1·팀 협업·예약 정합성 | 수치 좋음, repo 마감 약함       | CI, Testcontainers, Flyway, 패키지 구조, 성능 문서 보강           |

가장 냉정하게 말하면:

> **사이트는 이제 괜찮습니다. 다음 합격률은 레포의 “증거 밀도”가 결정합니다.**

특히 `realtime-chat`과 `ai-usage-billing-gateway`의 pending 지표를 줄이면 포트폴리오 전체가 확 올라갑니다.

---

# 0. 4개 레포 공통 개선 원칙

각 레포는 지금부터 “기능 저장소”가 아니라 **포트폴리오 증거 저장소**가 되어야 합니다.

README의 목적은 예쁘게 설명하는 게 아니라, 면접관이 1분 안에 아래를 알게 하는 것입니다.

```txt
1. 어떤 도메인인가?
2. 어떤 문제가 있었나?
3. 어떤 설계로 해결했나?
4. 어떤 수치 또는 테스트로 검증했나?
5. 무엇은 아직 주장하지 않는가?
```

현재 포트폴리오 사이트는 이 구조가 잘 잡혔습니다. 이제 각 GitHub repo도 같은 구조로 맞춰야 합니다.

## 공통 README 템플릿

4개 레포의 README 상단을 전부 아래 순서로 통일하세요.

```md
# 프로젝트명

한 줄 요약:
문제 + 해결 + 결과 + 도메인

## 이 레포가 증명하는 것

- 측정 완료:
- 시나리오 검증:
- 추가 측정 예정:

## 문제 구간 아키텍처

- 사각형 구조도
- 트랜잭션 경계
- 비동기 경계
- 실패/복구 경로
- 최종 기준 데이터

## 대표 문제 해결

1. 문제
2. 해결
3. 결과

## 검증 근거

- k6
- Testcontainers
- 통합 테스트
- EXPLAIN ANALYZE
- 장애/복구 시나리오

## 실행 방법

- docker compose
- app boot
- test
- k6

## 한계

- 운영 성능 주장 아님
- local Docker 기준
- pending 항목
```

## 공통 `docs/` 구조

4개 레포에 아래 문서 구조를 통일하면 좋습니다.

```txt
docs/
├── DESIGN.md
├── PERF_RESULT.md
├── TESTING.md
├── RUNBOOK.md
├── LIMITATIONS.md
└── INTERVIEW_GUIDE.md
```

각 문서 역할은 명확해야 합니다.

```txt
DESIGN.md
- 왜 이 구조를 선택했는지
- 트랜잭션 경계
- 비동기 경계
- 실패/복구 경로

PERF_RESULT.md
- 측정 환경
- k6 시나리오
- 결과
- 해석
- 한계

TESTING.md
- 단위/통합/Testcontainers 테스트 목록
- 각 테스트가 검증하는 정책

RUNBOOK.md
- 장애 상황
- 확인할 metric/log
- 수동 복구 방법

LIMITATIONS.md
- 아직 주장하지 않는 것
- pending 항목

INTERVIEW_GUIDE.md
- 면접에서 설명할 핵심 질문/답변
```

PDF에서도 구현 코드 캡처보다 그림, 흐름, 테스트 결과, 수치가 더 중요하다고 설명합니다. 따라서 레포도 “코드가 많다”보다 “증거를 찾기 쉽다”가 중요합니다.

---

# 1. Concert Booking 개선안

## 현재 평가

**점수: 8.8 / 10**

이 레포는 4개 중 가장 강합니다. README도 “동일 좌석 경합, 대기열 입장 제어, 중복 요청, 결제/만료 race, Outbox/Kafka 이벤트 발행 실패”를 다루는 Spring Boot 백엔드 프로젝트라고 명확히 설명하고 있고, 핵심 문제도 overselling, queue token, idempotency, Outbox, DLT, Redis stock reconciliation으로 잘 정리되어 있습니다. ([GitHub][1])

검증 근거도 좋습니다. README에는 동일 좌석 100 concurrent requests에서 success 1, fail 99, overselling 0, 50명 분산 예약에서 비관적/Redis 분산 락 50/50, mixed load 200 VU 기준 총 RPS 969~1,005가 기록되어 있습니다. ([GitHub][1]) `docs/PERF_RESULT.md`에는 Apple M4, RAM 16GB, Docker Desktop, PostgreSQL 16, Redis 7, Kafka 7.6.0, Spring Boot 3.4.1, JVM 21, k6 v1.5.0 같은 측정 환경도 들어가 있습니다. ([GitHub][2])

즉, Concert Booking은 이미 “대표 레포” 자격이 있습니다. 여기서 새 기능을 많이 추가하기보다, **운영형 설득력**을 보강해야 합니다.

---

## 가장 큰 약점

현재 약점은 기능 부족이 아닙니다. 약점은 이겁니다.

```txt
1. D/E/F k6 시나리오가 아직 pending
2. 운영 복구 runbook이 부족함
3. 관측성은 metric 설명 수준이고 alert/dashboard/tracing/SLO는 아직 주장하지 않음
4. Outbox/DLT/reconciliation이 강한데 운영자가 어떻게 판단하고 실행하는지까지는 약함
```

`docs/PERF_RESULT.md`에도 Payment Expiration Race, Duplicate Request / Idempotency, Queue Token Abuse 시나리오는 script는 있으나 정식 수치가 pending이라고 되어 있습니다. ([GitHub][2]) README의 observability 섹션도 metric은 설명하지만 alerting, dashboard, tracing, SLO 운영 체계 구현 주장은 하지 않는다고 명시합니다. ([GitHub][1])

이 정직함은 좋습니다. 이제 할 일은 pending을 하나씩 없애는 것입니다.

---

## Concert Booking 개선 우선순위

### 1순위: D/E/F k6 정식 측정 완료

현재 pending인 3개를 측정하세요.

```txt
D. Payment Expiration Race
- 결제 요청과 예약 만료 scheduler가 동시에 실행되는 상황
- 기대 결과:
  - confirmed reservation은 만료 처리되지 않음
  - expired reservation은 payment success로 되살아나지 않음
  - 중복 상태 전이 없음

E. Duplicate Request / Idempotency
- 같은 Idempotency-Key로 N회 재요청
- 기대 결과:
  - 같은 payload는 같은 결과 반환
  - 다른 payload는 409 Conflict
  - 중복 reservation/payment row 없음

F. Queue Token Abuse
- token 없음
- 다른 사용자 token
- 다른 schedule token
- 만료 token
- 기대 결과:
  - unauthorized success 0
```

`docs/PERF_RESULT.md`에서 이미 D/E/F를 pending으로 분리해둔 구조가 좋습니다. 이제 표를 채우면 됩니다. ([GitHub][2])

### 2순위: `docs/RUNBOOK.md` 추가

이 레포는 runbook을 넣으면 확 강해집니다.

```md
# Concert Booking Runbook

## 1. Outbox DEAD 증가

증상:

- concert.booking.outbox.dead 증가
- Kafka publish 실패 또는 consumer 실패 가능

확인:

- /actuator/prometheus
- outbox_events status count
- Kafka broker 상태
- DLT topic lag

조치:

1. 원인 확인
2. DEAD event payload 확인
3. 중복 처리 가능 여부 확인
4. ROLE_ADMIN으로 manual replay 실행
5. replay 후 outbox status / consumer result 확인

주의:

- Outbox는 exactly-once를 보장하지 않음
- consumer idempotency가 중복을 흡수해야 함
```

```md
## 2. Redis stock mismatch

증상:

- Redis stock과 DB Seat.status count 불일치

확인:
POST /api/admin/schedules/{scheduleId}/stock/reconcile?repair=false

조치:
POST /api/admin/schedules/{scheduleId}/stock/reconcile?repair=true

주의:

- Redis는 최종 기준 데이터가 아님
- DB Seat.status 기준으로 보정
```

이 문서가 있으면 면접에서 이렇게 말할 수 있습니다.

> “구현만 한 게 아니라, 장애가 났을 때 어떤 지표를 보고 어떤 순서로 복구할지도 문서화했습니다.”

### 3순위: Outbox 상태 전이 문서 보강

현재 README에는 Outbox 흐름이 있습니다. 다만 `FAILED`, `RETRYING`, `DEAD`, `PUBLISHED`, `CONSUMED` 등의 상태 전이를 더 명확히 표로 만들면 좋습니다. README는 Outbox가 DB commit 이후 Kafka publish 실패를 줄이기 위한 장치이며, exactly-once를 보장하지 않고 consumer 멱등성으로 중복을 흡수한다고 설명합니다. ([GitHub][1])

추천 표:

```txt
상태 | 의미 | 전이 조건 | 운영 조치
PENDING | 발행 대기 | business transaction commit | relay 대상
PUBLISHED | Kafka 발행 성공 | Kafka send success | consumer 처리 대기
FAILED | 발행 실패 | Kafka send failure | retry 대상
DEAD | retry 초과 | max retry exceeded | manual replay 후보
CONSUMED | consumer 처리 완료 | consumer success | 완료
```

### 4순위: Grafana dashboard JSON 추가

지금 metric은 있습니다. README도 reservation attempt/success/failure/latency, queue token, outbox, stock reconciliation metric을 설명합니다. ([GitHub][1])

다음은 `monitoring/` 폴더를 추가하세요.

```txt
monitoring/
├── prometheus.yml
├── grafana/
│   └── dashboards/
│       └── concert-booking-dashboard.json
└── alert-rules.yml
```

대시보드 패널:

```txt
- reservation attempts / success / failure
- reservation p95 latency
- queue token validation failures
- outbox pending / failed / dead
- stock reconciliation mismatches
- Kafka consumer error count
```

Alert rule 예시:

```txt
OutboxDeadEventsHigh
- outbox dead count > 0 for 5m

StockMismatchDetected
- stock mismatch count > 0

ReservationFailureRateHigh
- fail / attempt > 0.2 for 10m
```

### 5순위: 락 전략 선택 가이드 추가

이미 비관적/낙관적/Redis 분산 락 비교가 좋습니다. README는 낙관적 락이 서로 다른 좌석 예매에서도 `ConcertSchedule.availableSeats` 공유 row 때문에 충돌한다고 설명합니다. ([GitHub][1])

여기에 `docs/LOCK_STRATEGY_GUIDE.md`를 추가하세요.

```txt
상황 | 추천 전략 | 이유
동일 좌석 경합이 높음 | 비관적 락 | 결과 예측 가능
소진 이후 실패 요청이 많음 | Redis 분산 락 | DB 진입 전 차단
충돌이 낮고 공유 카운터 없음 | 낙관적 락 | lock wait 감소
공유 counter row 있음 | 낙관적 락 주의 | version conflict 증가
```

---

## Concert Booking에 바로 넣을 Codex 프롬프트

```txt
concert-booking 레포를 포트폴리오 증거 저장소로 더 강화해줘.

목표:
- 새 기능을 무리하게 추가하지 말고, 이미 구현된 동시성/Outbox/Redis 정합성의 운영 설득력을 높인다.
- 가짜 수치 추가 금지.
- pending은 pending으로 유지하되, 실제 실행한 시나리오만 measured로 바꾼다.

작업:
1. docs/RUNBOOK.md 추가
   - Outbox DEAD 증가 대응
   - DLT replay 절차
   - Redis stock mismatch reconciliation 절차
   - queue token abuse 확인 절차
   - 각 절차에 확인할 metric, endpoint, 주의사항 작성

2. docs/LOCK_STRATEGY_GUIDE.md 추가
   - pessimistic / optimistic / Redis distributed lock 선택 기준
   - 현재 k6 결과를 근거로 해석
   - optimistic lock이 공유 counter row에서 충돌한 이유 설명

3. docs/PERF_RESULT.md 개선
   - D/E/F pending 시나리오를 유지하되, 실행 방법을 더 명확히 작성
   - 측정하지 않은 값은 절대 추가하지 않음

4. monitoring/ 추가
   - prometheus.yml
   - grafana dashboard json 초안
   - alert-rules.yml 초안
   - 실제 운영 claim 금지. local verification용이라고 명시

5. 테스트
   - ./gradlew test
   - ./gradlew build
```

---

# 2. Realtime Chat 개선안

## 현재 평가

**점수: 8.3 / 10**

이 레포는 설계 방향이 좋습니다. README는 단순 WebSocket 채팅이 아니라, 다중 인스턴스 환경에서 구독 권한, Kafka ACK/NACK, room 단위 순서, 읽음 정합성, DLT 격리, 수동 replay, Redis presence, cache invalidation을 검증한다고 설명합니다. ([GitHub][3])

Measured 결과도 좋습니다. README 기준 채팅방 조회 API는 937 → 1,598 RPS, p95 212.85ms → 149.22ms, N+1은 2N+1 쿼리 → 1회 쿼리로 개선됐습니다. 반면 mixed traffic p95, send-to-receive latency, WebSocket delivery completeness는 pending으로 남아 있습니다. ([GitHub][3])

성능 문서도 좋습니다. `docs/PERF_RESULT.md`는 N+1 발견, 분석, JPQL projection 해결, EXPLAIN ANALYZE, Redis cache aside, k6 환경까지 꽤 자세히 기록합니다. ([GitHub][4])

---

## 가장 큰 약점

Realtime Chat의 핵심 약점은 아주 명확합니다.

```txt
실시간 채팅인데, 실제 메시지 end-to-end 지연 시간과 delivery completeness가 아직 pending
```

README도 WebSocket 공개 수치는 connection smoke 성격이며, send-to-receive p95 latency, delivery completeness, room별 수신 순서 정확도, mixed traffic RPS/p95는 pending이라고 명시합니다. ([GitHub][3])

이건 정직해서 좋지만, 대표 레포로 계속 쓰려면 반드시 줄여야 합니다.

---

## Realtime Chat 개선 우선순위

### 1순위: send-to-receive latency 측정

이 레포의 제일 큰 개선입니다.

측정 정의를 먼저 명확히 하세요.

```txt
send-to-receive latency =
sender client가 SEND frame을 보낸 시각
→ receiver client가 MESSAGE frame을 받은 시각
```

측정 대상:

```txt
- 1 room, 50 users
- 10 rooms, room당 50 users
- 500 concurrent WebSocket sessions
- 1,000 concurrent WebSocket sessions
- message rate: 10 msg/s, 50 msg/s, 100 msg/s
```

기록할 값:

```txt
- p50
- p90
- p95
- p99
- max
- message loss rate
- duplicate receive count
- out-of-order count per room
```

주의할 점:

```txt
ACK는 Kafka publish accepted만 의미함
PERSISTED는 DB 저장 완료만 의미함
상대 client 수신 완료와 구분해야 함
```

이 구분은 README에서 이미 잘 설명합니다. README는 ACCEPTED ACK가 Kafka broker accepted를 의미하고, PERSISTED ACK가 DB 저장 완료 또는 기존 idempotent row 확인을 의미하며, Redis Pub/Sub broadcast 완료나 상대 클라이언트 수신 완료를 뜻하지 않는다고 명시합니다. ([GitHub][3])

### 2순위: delivery completeness 측정

실시간 채팅에서 면접관이 바로 물을 질문입니다.

```txt
“보낸 메시지가 실제로 몇 % 도착했나요?”
```

측정 방식:

```txt
각 sender가 clientMessageId를 가진 메시지 전송
각 receiver는 받은 messageKey/clientMessageId 기록
테스트 종료 후 expected matrix와 actual receive log 비교
```

검증 지표:

```txt
- expected deliveries
- actual deliveries
- missing deliveries
- duplicate deliveries
- delivery completeness %
```

예시:

```txt
room users: 50
messages sent: 1,000
expected deliveries: 49,000
actual deliveries: 48,998
missing: 2
duplicate: 0
completeness: 99.995%
```

수치가 좋지 않아도 괜찮습니다. 오히려 왜 빠졌는지 분석하면 강합니다.

### 3순위: room ordering 성능 검증

현재 room 단위 ordering은 같은 roomId를 Kafka key로 사용하고, partition offset 순서를 검증합니다. README는 전역 순서를 보장하지 않고, 동일 room 내 partition ordering만 검증한다고 설명합니다. ([GitHub][3])

다음은 성능 상황에서 검증해야 합니다.

```txt
- 같은 room에 100명
- 동시에 1,000 messages
- receiver별 수신 순서가 messageId 또는 kafkaOffset 기준으로 단조 증가하는지 확인
```

주의:

```txt
Kafka partition order
DB 저장 order
WebSocket receive order

이 세 가지는 동일하지 않을 수 있음
```

이 차이를 문서화하면 면접에서 강합니다.

### 4순위: Redis rate limit 개선

현재 Redis fixed-window 방식이고, 초 경계에서 burst가 생길 수 있으며, 더 엄밀한 smoothing은 token bucket 또는 sliding window Lua script가 개선 과제라고 README에 적혀 있습니다. ([GitHub][3])

이건 구현하면 좋습니다.

```txt
현재:
fixed-window
rate:ws:send:user:{userId}:{epochSecond}

개선:
Redis Lua sliding window or token bucket

측정:
초 경계 burst 상황에서 기존 fixed-window와 비교
```

이 개선은 “Redis를 그냥 썼다”가 아니라 **알고리즘 선택과 한계 인식**을 보여줍니다.

### 5순위: cache hit rate 측정

`docs/PERF_RESULT.md`는 cache aside 설계와 선택적 eviction을 잘 설명하지만, mixed k6 시나리오로 cache hit rate와 latency를 별도 측정하겠다고 남겨둡니다. ([GitHub][4])

추가할 지표:

```txt
- rooms cache hit count
- rooms cache miss count
- cache hit ratio
- evict count
- hot room message rate별 hit ratio 변화
```

---

## Realtime Chat에 바로 넣을 Codex 프롬프트

```txt
realtime-chat 레포의 pending 지표를 줄이는 작업을 진행해줘.

목표:
- 실시간 채팅의 핵심인 send-to-receive latency와 delivery completeness를 측정 가능하게 만든다.
- ACK/PERSISTED/RECEIVED 의미를 명확히 분리한다.
- 가짜 수치 추가 금지. 실제 실행 결과만 docs/PERF_RESULT.md에 기록한다.

작업:
1. k6 또는 Node 기반 WebSocket benchmark 추가
   - 500 sessions
   - 1,000 sessions 옵션
   - room당 user 수 configurable
   - message rate configurable
   - sender timestamp와 receiver timestamp 기록

2. delivery completeness 계산기 추가
   - expected deliveries
   - actual deliveries
   - missing
   - duplicate
   - out-of-order
   - completeness %

3. docs/PERF_RESULT.md 갱신
   - 기존 REST 조회 API 결과 유지
   - WebSocket latency/delivery 섹션 추가
   - 측정 전에는 Pending 유지

4. Redis rate limit 개선 문서 추가
   - fixed-window 한계
   - token bucket/sliding window 개선안
   - 구현하지 않으면 LIMITATIONS.md에 남김

5. metrics 추가
   - send accepted count
   - persisted count
   - received count
   - dlt count
   - cache hit/miss
   - room fan-out latency

6. 테스트
   - ./gradlew test
   - ./gradlew build
```

---

# 3. AI Usage Billing Gateway 개선안

## 현재 평가

**점수: 7.6 / 10**

이 레포는 도메인 차별화가 가장 큽니다. README는 멀티테넌트 SaaS 환경에서 API Key 인증, 사용량 수집, quota/rate limit, invoice, payment webhook, append-only ledger, audit log를 검증한다고 설명합니다. ([GitHub][5])

핵심 문제도 좋습니다. tenant isolation, API key hash 저장, usage idempotency, invoice idempotency, webhook duplicate delivery, ledger consistency, audit secret hygiene, Redis rate limit, plan quota check를 다룹니다. ([GitHub][5])

하지만 냉정하게 말하면, 아직 **가장 미완성인 대표 레포**입니다. 레포가 3 commits밖에 없고, k6 mixed usage scenario는 script만 있으며 throughput/latency/error rate는 pending입니다. ([GitHub][5]) ([GitHub][5])

---

## 가장 큰 약점

README의 한계 섹션이 매우 정직합니다. Gateway 자체 retry idempotency는 아직 구현하지 않았고, quota check는 DB usage sum 기반이라 strict quota reservation을 보장하지 않으며, invoice scheduler는 background scheduler가 아니라 수동 endpoint이고, refund reversal ledger, audit sanitizer, alerting/dashboard/tracing/SLO, performance benchmark도 아직 개선 과제입니다. ([GitHub][5])

이 레포는 좋아 보이지만, 아직 면접에서 이렇게 공격받을 수 있습니다.

```txt
“실제 과금 시스템이라면 월말 invoice를 누가 언제 돌리나요?”
“동시 요청으로 quota를 초과하면 어떻게 막나요?”
“refund가 발생하면 ledger는 어떻게 되돌리나요?”
“gateway 호출 자체의 idempotency는요?”
“운영 지표와 알림은요?”
```

이 질문에 답할 수 있게 만들어야 합니다.

---

## AI Billing 개선 우선순위

### 1순위: invoice scheduler 또는 Spring Batch 구현

현재 invoice generation은 수동 endpoint입니다. README도 `POST /api/organizations/{orgId}/invoices/generate?period=YYYY-MM`로 invoice를 생성한다고 설명합니다. ([GitHub][5])

대표 레포로 만들려면 scheduler가 필요합니다.

추천 구현:

```txt
MonthlyInvoiceScheduler
- 매월 1일 00:10 실행
- active subscription organization 조회
- period 계산
- InvoiceGenerationService.generate(orgId, period)
- organizationId + billingPeriod unique constraint로 중복 방지
```

더 강하게 하려면 Spring Batch:

```txt
Job: monthlyInvoiceJob
Step 1: target organization reader
Step 2: usage aggregate processor
Step 3: invoice + ledger writer
```

문서에 이렇게 쓰세요.

```txt
수동 endpoint는 테스트/운영자 재처리용
정기 invoice는 scheduler/batch로 생성
중복 실행은 organizationId + billingPeriod unique constraint로 방지
```

### 2순위: strict quota reservation 구현

현재 quota check는 DB usage sum 기반이고, strict quota reservation을 보장하지 않는다고 한계에 적혀 있습니다. ([GitHub][5])

이건 개선하면 굉장히 강합니다.

문제:

```txt
동시 요청 100개가 들어오면
각 요청이 같은 usage sum을 읽고
quota 초과 전이라고 판단할 수 있음
```

개선안:

```txt
QuotaReservationService
- Redis atomic counter 또는 DB row lock 사용
- organizationId + period 기준 reservedUsage 관리
- 요청 시작 시 reserve
- 성공 시 usage event commit
- 실패/timeout 시 release 또는 TTL 만료
```

선택지는 두 가지입니다.

```txt
A. DB row lock 방식
- quota_period_usage row를 SELECT FOR UPDATE
- 정확하지만 DB 병목 가능

B. Redis atomic counter 방식
- INCRBY + TTL + Lua
- 빠르지만 Redis 장애/복구 고려 필요
```

추천은 **DB row lock 방식으로 먼저 구현**입니다. 과금은 정확성이 성능보다 중요합니다.

### 3순위: refund reversal ledger 구현

현재 `payment.refunded` event type은 받지만, refund reversal ledger는 개선 과제입니다. ([GitHub][5])

구현:

```txt
Payment refunded event
→ original payment ledger group 조회
→ reversal ledger group 생성
```

예시:

```txt
Payment success:
DEBIT  CASH                  75
CREDIT ACCOUNTS_RECEIVABLE   75

Refund:
DEBIT  ACCOUNTS_RECEIVABLE   75
CREDIT CASH                  75
```

주의:

```txt
- 기존 ledger row를 수정하지 않음
- append-only 유지
- originalLedgerGroupId 참조
- 중복 refund webhook idempotency 처리
```

이건 면접에서 매우 강합니다.

### 4순위: gateway request idempotency 추가

README 한계에 `/api/usage/events`는 idempotent하지만 `/v1/gateway/mock-completion` 자체의 retry idempotency는 아직 구현하지 않았다고 되어 있습니다. ([GitHub][5])

이걸 개선하세요.

```txt
POST /v1/gateway/mock-completion
X-API-Key
Idempotency-Key

정책:
- 같은 API key + same idempotency key + same payload → 같은 gateway response / usage event 반환
- same key + different payload → 409 Conflict
- no idempotency key → normal non-idempotent request, or require header
```

이건 AI gateway 과금에서 매우 중요합니다. timeout 이후 client retry가 정상 입력이기 때문입니다.

### 5순위: k6 mixed usage benchmark 실제 측정

현재 README는 k6 script inspect와 실행 명령은 있지만, 실제 benchmark 결과는 없고 throughput/latency/error rate가 pending입니다. ([GitHub][5])

측정 시나리오:

```txt
70% gateway mock-completion
20% explicit usage events
5% invoice generate
5% webhook payment events
```

기록:

```txt
- throughput
- p50 / p95 / p99 latency
- error rate
- duplicate request success
- conflict count
- quota exceeded count
- Redis rate limit rejection count
```

### 6순위: dashboard와 alerting

현재 Micrometer metrics는 등록되어 있지만 Prometheus scraping 운영 노출에는 인증/네트워크 정책이 필요하다고 README가 설명합니다. ([GitHub][5])

추가하면 좋은 metric:

```txt
billing.gateway.requests
billing.gateway.rate_limited
billing.usage.events.created
billing.usage.events.duplicate
billing.idempotency.conflicts
billing.invoice.generated
billing.invoice.duplicates
billing.webhook.processed
billing.webhook.duplicates
billing.webhook.conflicts
billing.ledger.groups.created
billing.ledger.balance.failures
```

Alert:

```txt
WebhookConflictDetected
IdempotencyConflictSpike
LedgerBalanceFailure
InvoiceGenerationFailure
RateLimitUnavailable
```

---

## AI Billing에 바로 넣을 Codex 프롬프트

```txt
ai-usage-billing-gateway 레포를 대표 포트폴리오 수준으로 끌어올려줘.

목표:
- SaaS 과금 백엔드로서 invoice, quota, webhook, ledger의 실무 설득력을 강화한다.
- 가짜 수치 추가 금지.
- 실제 구현하지 않은 운영 claim 금지.

작업:
1. invoice scheduler 추가
   - MonthlyInvoiceScheduler
   - active organization/subscription 대상
   - organizationId + billingPeriod 기준 idempotent generation
   - 기존 수동 endpoint는 admin retry 용도로 유지

2. quota reservation 구현
   - DB row lock 방식 우선
   - organizationId + period 기준 quota usage row
   - reserve / commit / rollback 정책 문서화
   - 동시 요청에서 quota 초과 방지 테스트 추가

3. refund reversal ledger 구현
   - payment.refunded webhook 처리
   - original ledger group을 수정하지 않고 reversal entry group 생성
   - duplicate refund webhook idempotency 테스트

4. gateway request idempotency 추가
   - /v1/gateway/mock-completion에 Idempotency-Key 지원
   - same payload duplicate 반환
   - different payload 409 Conflict

5. k6 mixed usage benchmark 실행 준비
   - 70% gateway
   - 20% usage events
   - 5% invoice
   - 5% webhook
   - 실행 결과 없으면 Pending 유지

6. docs 갱신
   - docs/DESIGN.md
   - docs/PERF_RESULT.md
   - docs/RUNBOOK.md
   - docs/LIMITATIONS.md

7. 테스트
   - ./gradlew test
   - ./gradlew build
```

---

# 4. BorrowMe 개선안

## 현재 평가

**점수: 7.4 / 10**

BorrowMe는 대표 레포 중 가장 “기본기 증명”에 좋습니다. README는 가톨릭대 GGUM 해커톤 11인 팀 프로젝트로 시작했고, 대학생 간 물건 대여 REST API이며, 본인이 예약 시스템, pessimistic lock 기반 동시성 제어, N+1 개선, k6 성능 테스트, 알림 시스템을 담당했다고 정리합니다. ([GitHub][6])

성능 수치도 좋습니다. 상품 목록 조회 p95는 1,010ms → 23ms, 처리량은 30 req/s → 253 req/s, DB 쿼리는 201회 → 3회로 개선됐고, 동시 예약 100 VU/재고 50개에서 예약 성공 50건, 최종 재고 불일치 0으로 정리되어 있습니다. ([GitHub][6])

다만 repo 마감은 나머지 대표 레포보다 약합니다. 파일 트리 기준 `.github/workflows`가 보이지 않고, `.ebextensions`, `k6`, `src`, `build.gradle` 중심입니다. ([GitHub][6]) 즉, 이 레포는 수치는 좋지만 “포트폴리오 증거 저장소”로는 아직 덜 정리되어 있습니다.

---

## 가장 큰 약점

BorrowMe의 약점은 다음입니다.

```txt
1. README는 좋아졌지만 docs/가 부족함
2. CI가 약하거나 보이지 않음
3. Testcontainers/Flyway/마이그레이션 문서가 약함
4. N+1 개선의 Before/After 코드와 EXPLAIN이 별도 문서로 분리되어 있지 않음
5. 팀 프로젝트라 본인 기여 범위를 더 엄격하게 증명해야 함
6. 패키지 구조가 controller/dto/entity/repository/service 중심이라 도메인별 응집도가 약해 보일 수 있음
```

PDF에서는 프로젝트를 쓸 때 참여 인력은 포지션별로 적는 게 좋고, 협업 도구보다 핵심 기술을 적어야 하며, 문제 해결 역량을 최상단에 두라고 설명합니다. BorrowMe는 11인 팀 프로젝트이므로 이 기준이 특히 중요합니다.

---

## BorrowMe 개선 우선순위

### 1순위: CI 추가

가장 먼저 `.github/workflows/ci.yml`을 추가하세요.

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17
      - uses: gradle/actions/setup-gradle@v4
      - run: ./gradlew test
      - run: ./gradlew build
```

README 상단에 CI badge 추가:

```md
![CI](https://github.com/sjh9714/borrow_me/actions/workflows/ci.yml/badge.svg)
```

이거 하나만 해도 repo 신뢰도가 올라갑니다.

### 2순위: N+1 개선 문서 분리

`docs/PRODUCT_LIST_PERF.md`를 만드세요.

구조:

```md
# 상품 목록 조회 N+1 개선

## 문제

상품 100개 조회 시 이미지/예약/상태 조회로 201회 쿼리 발생

## Before

- query count: 201
- p95: 1,010ms
- throughput: 30 req/s

## 원인

- Product 목록 조회 후 연관 데이터 lazy loading
- 이미지/예약/상태를 상품별 반복 조회

## 해결

- JOIN FETCH
- batch 조회
- 필요한 응답 DTO projection
- 페이징과 fetch join 충돌 여부 검토

## After

- query count: 3
- p95: 23ms
- throughput: 253 req/s

## 측정 환경

- k6 30 VU, 30초
- dataset: 상품 100개
- DB:
- JVM:
- local 환경 한계
```

현재 README에 기록된 수치는 매우 좋습니다. 이걸 별도 문서로 확장하면 포트폴리오 증거가 됩니다. ([GitHub][6])

### 3순위: 예약 정합성 문서 분리

`docs/RESERVATION_CONSISTENCY.md`

```md
# 예약 정합성

## 문제

재고 50개 상품에 100명이 동시에 예약하면 재고 초과 예약 가능

## 기존 결과

예약 성공 100건, 전부 성공

## 개선

- @Lock(PESSIMISTIC_WRITE)
- SELECT FOR UPDATE
- entityManager.detach()로 Hibernate L1 cache 우회

## 결과

- 예약 성공 50건
- 최종 재고 불일치 0
```

README에 이미 `@Lock(PESSIMISTIC_WRITE)`, `SELECT FOR UPDATE`, `entityManager.detach()`가 언급되어 있습니다. ([GitHub][6])
이 부분은 면접에서 매우 좋은 질문을 유도합니다.

면접 예상 질문:

```txt
왜 entityManager.detach()가 필요했나요?
PESSIMISTIC_WRITE와 SELECT FOR UPDATE는 언제 SQL로 나가나요?
트랜잭션 격리 수준은 무엇이었나요?
재고 감소와 예약 생성은 같은 트랜잭션인가요?
```

### 4순위: 패키지 구조 개선

현재 README에 구조가 `config/controller/dto/entity/repository/security/service`로 나옵니다. ([GitHub][6])
이 구조가 틀린 건 아니지만, 프로젝트가 커질수록 도메인 응집도가 약해 보입니다.

추천 구조:

```txt
com.ardkyer.borrowme
├── global
│   ├── config
│   ├── security
│   ├── exception
│   └── infra
├── member
│   ├── api
│   ├── application
│   ├── domain
│   └── infra
├── product
│   ├── api
│   ├── application
│   ├── domain
│   └── infra
├── reservation
│   ├── api
│   ├── application
│   ├── domain
│   └── infra
├── notification
└── search
```

다만 리팩토링은 위험합니다. 먼저 문서에서 “현재 구조의 한계와 개선 계획”으로만 남겨도 됩니다.

### 5순위: Flyway 추가

현재 기술 스택에는 Spring Data JPA, MySQL, H2 for tests가 있고 Flyway는 보이지 않습니다. ([GitHub][6])

포트폴리오 레포라면 schema migration이 있으면 좋습니다.

```txt
src/main/resources/db/migration/
├── V1__init_schema.sql
├── V2__add_product_indexes.sql
├── V3__add_reservation_indexes.sql
```

N+1 개선과 연결되는 index를 migration으로 남기면 좋습니다.

### 6순위: Testcontainers 추가 또는 강화

현재 기술 스택에 Testcontainers가 언급되어 있습니다. ([GitHub][6])
그렇다면 README에 대표 테스트 목록을 추가하세요.

```txt
테스트 | 검증 내용
ProductListPerformanceTest | 쿼리 수 3회 이하
ReservationConcurrencyTest | 재고 50개에 100명 요청 시 성공 50건
ReservationRollbackTest | 실패 시 재고 불일치 없음
SearchApiIntegrationTest | 검색 조건별 응답
NotificationReadStatusTest | 알림 읽음 처리
```

특히 쿼리 수 검증은 `datasource-proxy` 또는 Hibernate statistics로 자동화하면 좋습니다.

```txt
상품 목록 조회 시 query count <= 3
```

이게 있으면 N+1 개선이 README 주장에 그치지 않습니다.

---

## BorrowMe에 바로 넣을 Codex 프롬프트

```txt
borrow_me 레포를 대표 포트폴리오 레포 수준으로 정리해줘.

목표:
- 팀 프로젝트 맥락은 유지하되, 본인 백엔드 기여인 N+1 개선과 예약 정합성을 증거 중심으로 강화한다.
- 가짜 수치 추가 금지.
- 기존 README 수치만 사용하고, 새 수치는 실제 측정 후에만 추가한다.

작업:
1. GitHub Actions CI 추가
   - Java 17
   - ./gradlew test
   - ./gradlew build
   - README CI badge 추가

2. docs/PRODUCT_LIST_PERF.md 추가
   - 문제
   - Before 수치: p95 1,010ms, 201 queries, 30 req/s
   - 해결: JOIN FETCH / batch / projection 중 실제 구현 기준
   - After 수치: p95 23ms, 3 queries, 253 req/s
   - 측정 한계

3. docs/RESERVATION_CONSISTENCY.md 추가
   - 재고 50개 / 100 VU 문제
   - PESSIMISTIC_WRITE / SELECT FOR UPDATE
   - entityManager.detach()를 사용한 이유
   - 결과: 성공 50건, 재고 불일치 0

4. docs/TEAM_CONTRIBUTION.md 추가
   - 팀 11명 구성
   - 본인 담당 범위
   - BE 6명 중 본인이 맡은 기능
   - 협업 중 조율한 기술적 의사결정

5. 테스트 보강
   - ProductListQueryCountTest
   - ReservationConcurrencyTest
   - ReservationRollbackConsistencyTest
   - 가능하면 Testcontainers MySQL 사용

6. Flyway 도입 검토
   - 도입하면 schema migration 추가
   - 도입하지 않으면 LIMITATIONS.md에 이유 작성

7. 실행
   - ./gradlew test
   - ./gradlew build
```

---

# 5. 4개 레포 우선순위 로드맵

## 1주차: 가장 점수 많이 오르는 작업

```txt
1. realtime-chat
   - send-to-receive latency 측정
   - delivery completeness 측정

2. ai-usage-billing-gateway
   - invoice scheduler 추가
   - k6 mixed usage 실제 측정 1회

3. borrow_me
   - CI 추가
   - PRODUCT_LIST_PERF.md / RESERVATION_CONSISTENCY.md 작성

4. concert-booking
   - RUNBOOK.md 작성
```

## 2주차: 깊이 보강

```txt
1. concert-booking
   - D/E/F k6 pending 중 1~2개 측정
   - Grafana dashboard 초안

2. realtime-chat
   - mixed traffic p95 측정
   - cache hit rate 측정

3. ai-usage-billing-gateway
   - quota reservation
   - refund reversal ledger

4. borrow_me
   - Testcontainers 기반 query count / reservation concurrency test
```

## 3주차: 면접용 문서화

```txt
각 레포마다:
- docs/INTERVIEW_GUIDE.md
- docs/LIMITATIONS.md
- docs/RUNBOOK.md
```

---

# 6. 최종 순위와 냉정한 판단

## 지금 당장 가장 강한 레포

```txt
1. concert-booking
2. realtime-chat
3. borrow_me
4. ai-usage-billing-gateway
```

## 개선 후 가장 강해질 가능성

```txt
1. ai-usage-billing-gateway
2. realtime-chat
3. concert-booking
4. borrow_me
```

AI Billing은 현재는 미완성이지만, 제대로 보강하면 가장 차별화됩니다. 과금, API Key, idempotency, webhook, ledger, audit log는 흔한 포트폴리오 주제가 아닙니다. 반대로 BorrowMe는 신선함은 낮지만, 기본기 증명에는 아주 좋습니다.

---

# 7. 대표 레포 4개별 최종 할 일 요약

## Concert Booking

```txt
해야 할 것:
- D/E/F k6 pending 측정
- RUNBOOK.md
- LOCK_STRATEGY_GUIDE.md
- monitoring dashboard / alert rule
- Outbox 상태 전이 문서 보강

하지 말 것:
- 기능 추가를 더 늘리기
- “운영 가능한 대규모 예매 시스템”이라고 과장하기
```

## Realtime Chat

```txt
해야 할 것:
- send-to-receive latency p50/p95/p99 측정
- delivery completeness 측정
- room ordering 성능 검증
- cache hit rate 측정
- Redis rate limit 개선 또는 한계 문서화

하지 말 것:
- connection smoke를 실시간 메시지 성능처럼 말하기
```

## AI Usage Billing Gateway

```txt
해야 할 것:
- invoice scheduler / batch
- strict quota reservation
- refund reversal ledger
- gateway request idempotency
- k6 mixed usage benchmark
- dashboard / alerting

하지 말 것:
- 실제 PG/실제 AI provider/운영 과금 시스템처럼 포장하기
```

## BorrowMe

```txt
해야 할 것:
- CI 추가
- N+1 개선 문서 분리
- 예약 정합성 문서 분리
- 팀 기여 문서
- Testcontainers / query count test
- Flyway 또는 migration 전략

하지 말 것:
- 해커톤 기능 나열 중심으로 되돌아가기
- 팀 프로젝트인데 본인 기여 범위를 흐리게 쓰기
```

---

# 최종 결론

지금 포트폴리오 사이트는 많이 좋아졌습니다. 이제 다음 승부는 GitHub 레포입니다.

가장 먼저 해야 할 작업은 이 순서입니다.

```txt
1. realtime-chat의 send-to-receive latency / delivery completeness 측정
2. ai-usage-billing-gateway의 invoice scheduler + k6 mixed usage 측정
3. borrow_me의 CI + N+1/예약 정합성 문서 분리
4. concert-booking의 RUNBOOK + pending k6 측정
```

이 네 가지를 하면, 포트폴리오 사이트에 적힌 문제 해결 문장이 GitHub 레포에서 그대로 증명됩니다. 그때부터는 면접관이 GitHub를 열어도 “README만 잘 쓴 사람”이 아니라 **측정하고 검증하고 한계를 구분하는 백엔드 지원자**로 보입니다.

[1]: https://github.com/sjh9714/concert-booking "GitHub - sjh9714/concert-booking: 콘서트 좌석 예매 동시성 전략을 비교하는 Spring Boot 백엔드 · GitHub"
[2]: https://raw.githubusercontent.com/sjh9714/concert-booking/main/docs/PERF_RESULT.md "raw.githubusercontent.com"
[3]: https://github.com/sjh9714/realtime-chat "GitHub - sjh9714/realtime-chat: Kafka 기반 실시간 메시징의 권한·ACK/NACK·DLT·순서·읽음 정합성을 검증한 Spring Boot 채팅 백엔드 · GitHub"
[4]: https://raw.githubusercontent.com/sjh9714/realtime-chat/main/docs/PERF_RESULT.md "raw.githubusercontent.com"
[5]: https://github.com/sjh9714/ai-usage-billing-gateway "GitHub - sjh9714/ai-usage-billing-gateway: AI API Gateway and multi-tenant usage billing backend portfolio project · GitHub"
[6]: https://github.com/sjh9714/borrow_me "GitHub - sjh9714/borrow_me: 대학생 물건 대여 플랫폼을 위한 Spring Boot 예약·검색·소셜 API (가톨릭대 GGUM 해커톤 11인 팀 프로젝트) · GitHub"
