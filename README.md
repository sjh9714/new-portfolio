# 성진혁 Backend Portfolio

Korean backend developer portfolio site for presenting Java/Spring projects through problem-solving case studies, architecture flows, and honest evidence labels.

Public contact: [jinhyuk9714@gmail.com](mailto:jinhyuk9714@gmail.com)

Live site: [new-portfolio-smoky-one-41.vercel.app](https://new-portfolio-smoky-one-41.vercel.app)

## Positioning

동시성, 이벤트 정합성, 실시간 메시징, 과금/정산 도메인을 테스트와 수치로 검증하는 Java/Spring 백엔드 개발자 포트폴리오입니다.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui primitives
- MDX case-study prose
- Vitest content guard tests

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm run format:check
npm run typecheck
npm test
npm run lint
npm run build
```

For the full local verification pipeline:

```bash
npm run ci
```

## Content Rule

All project evidence is sourced from `src/content/projects.ts`.

- `Measured`: numeric result measured with tools.
- `Verified`: repeatable scenario or integration verification.
- `Pending`: not measured yet, or needs more operational data.

Do not invent metrics.
