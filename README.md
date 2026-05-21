# 성진혁 백엔드 포트폴리오

> 동시성, 이벤트 정합성, 실시간 메시징, 과금/정산 도메인을 테스트와 수치로 검증하는 Java/Spring 백엔드 포트폴리오

- Live: [new-portfolio-smoky-one-41.vercel.app](https://new-portfolio-smoky-one-41.vercel.app)
- GitHub: [github.com/sjh9714](https://github.com/sjh9714)
- 이메일: [jinhyuk9714@gmail.com](mailto:jinhyuk9714@gmail.com)

한국 백엔드 채용용으로 Java/Spring 프로젝트를 문제 해결 사례, 구조도, 검증 근거 중심으로 보여주는 포트폴리오 사이트입니다.

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

## Environment

```bash
NEXT_PUBLIC_SITE_URL=https://new-portfolio-smoky-one-41.vercel.app
```

`NEXT_PUBLIC_SITE_URL` is used for metadata, sitemap, and robots output.

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

## Deployment

The production site is deployed on Vercel from the `main` branch.

- Install: `npm ci`
- Build: `npm run build`
- Production URL: [new-portfolio-smoky-one-41.vercel.app](https://new-portfolio-smoky-one-41.vercel.app)

## Content Rule

All project evidence is sourced from `src/content/projects.ts`.

- `측정 완료` (`measured`): numeric result measured with tools.
- `시나리오 검증` (`verified`): repeatable scenario or integration verification.
- `추가 측정 예정` (`pending`): not measured yet, or needs more operational data.

Do not invent metrics.
Benchmark numbers must come from committed/source-backed project evidence only.

The resume PDF button is shown only when `public/resume.pdf` exists.
