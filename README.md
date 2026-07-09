# 성진혁 Java/Spring 백엔드 포트폴리오

동시성, 이벤트 복구, 실시간 메시징, 과금 정합성을 `문제 → 설계 판단 → 결과 → 근거` 순서로 읽히게 만든 한국어 백엔드 개발자 포트폴리오입니다.

- Live: [new-portfolio-smoky-one-41.vercel.app](https://new-portfolio-smoky-one-41.vercel.app)
- Resume PDF: [resume-sung-jinhyuk-backend.pdf](public/resume-sung-jinhyuk-backend.pdf)
- GitHub: [github.com/sjh9714](https://github.com/sjh9714)
- Email: [jinhyuk9714@gmail.com](mailto:jinhyuk9714@gmail.com)

## 대표 사례

1. [좌석 경합 정합성](https://new-portfolio-smoky-one-41.vercel.app/case-studies/concert-seat-overselling-consistency) — Queue Token, DB lock, Idempotency-Key의 책임 분리
2. [Outbox / DLT 복구](https://new-portfolio-smoky-one-41.vercel.app/case-studies/concert-outbox-dlt-recovery) — commit 이후 발행·소비 실패를 복구 가능한 상태로 보존
3. [Realtime 전달 정합성](https://new-portfolio-smoky-one-41.vercel.app/case-studies/realtime-delivery-consistency) — 구독 인가, room ordering, receiver completeness, reconnect 경계
4. [Billing 정합성](https://new-portfolio-smoky-one-41.vercel.app/case-studies/billing-idempotency-webhook-ledger) — API Key 원문 미저장, usage/webhook 중복, reversal ledger
5. [BorrowMe 목록 회귀](https://new-portfolio-smoky-one-41.vercel.app/case-studies/borrowme-product-list-n-plus-one) — 현재 snapshot과 query-count guard 분리

## 콘텐츠 원칙

- 프로젝트와 evidence는 [`src/content/projects.ts`](src/content/projects.ts)에서 관리합니다.
- 사례 본문은 [`src/content/portfolio-cases.ts`](src/content/portfolio-cases.ts)에서 관리합니다.
- 공개 evidence는 commit-pinned GitHub permalink가 있을 때만 허용합니다.
- 성능 수치는 측정 날짜, 시나리오, 환경을 함께 기록합니다.
- 향후 검증은 evidence 상태로 만들지 않고 사례의 `nextValidation`에만 둡니다.
- 운영 트래픽, production benchmark, 확인되지 않은 기간·학력·경력·기여는 주장하지 않습니다.

## 기술 스택

- Next.js App Router, React, TypeScript
- Tailwind CSS, lucide-react
- Vitest
- Playwright, axe

## 아키텍처 구조도

문제 구간 SVG는 `src/architecture/specs/*.ts`에서 생성합니다. raw SVG를 직접 수정하지 않습니다.

```bash
npm run generate:architecture
npm run check:architecture
```

생성된 자산은 `public/architecture/cases`에 있습니다. 중복되던 구형 전체 아키텍처 SVG는 제거했고, 상세 규칙은 [`docs/ARCHITECTURE_SVG_RULES.md`](docs/ARCHITECTURE_SVG_RULES.md)에 있습니다.

## 검증

```bash
npm run ci
```

CI는 아래 순서로 실행합니다.

```text
architecture → format → typecheck → unit → lint → build → Playwright/axe → production audit
```

이력서 PDF를 다시 만들 때는 production build 후 실행합니다.

```bash
npm run build
npm run resume:pdf
```

PDF 생성기는 A4 한 페이지가 아니면 실패합니다.
