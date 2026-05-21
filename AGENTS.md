# AGENTS.md

## Product Goal

This repository is a Korean backend developer portfolio site.

The site must make a busy Korean engineering interviewer understand the candidate's backend strengths within 30 seconds.

Primary positioning:

- Java/Spring backend engineer
- concurrency, consistency, event-driven architecture, realtime messaging, billing/tenant security
- evidence-driven portfolio with tests, diagrams, and measured/verified/pending labels

## Non-negotiable Rules

- Do not invent metrics.
- Use only metrics explicitly present in `src/content/projects.ts` or MDX files.
- If a result is not measured, label it as `추가 측정 예정` or `시나리오 검증`, never `측정 완료`.
- Do not overuse animations.
- Do not make the site look like a designer portfolio.
- Do not use vague copy such as "passionate developer" or "I love clean code".
- Prefer problem-solution-result-domain wording.
- All featured case studies must include:
  - 요약
  - 문제
  - 단순 구현에서의 문제
  - 구조와 흐름
  - 설계 판단
  - 검증 결과
  - 한계와 다음 검증
  - 예상 면접 질문

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MDX prose for case-study body text
- shadcn/ui primitives
- lucide-react for icons

## Commands

Use these commands before finishing work:

```bash
npm run format:check
npm run typecheck
npm test
npm run lint
npm run build
```

## Design Direction

- Minimal, readable, technical
- White or near-white background
- Strong typography
- Dense but scannable cards
- Mobile-first
- Diagrams over screenshots
- Evidence badges: 측정 완료, 시나리오 검증, 추가 측정 예정

## Content Rules

Project cards should show:

1. 문제
2. 설계
3. 결과
4. 근거
5. 기술 스택, max 5 visible items
6. links to case study and GitHub

Case study pages should avoid long marketing copy.
They should read like an engineering design review.

## Done Criteria

A task is done only when:

- TypeScript compiles
- `npm run format:check` passes
- `npm test` passes
- `npm run lint` passes
- `npm run build` passes
- No fake metrics are introduced
- All primary pages are responsive
- All project cards have clear problem/solution/result
