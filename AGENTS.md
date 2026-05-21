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
- If a result is not measured, label it as `Pending` or `Verified`, never `Measured`.
- Do not overuse animations.
- Do not make the site look like a designer portfolio.
- Do not use vague copy such as "passionate developer" or "I love clean code".
- Prefer problem-solution-result-domain wording.
- All featured case studies must include:
  - TL;DR
  - Problem
  - Architecture / Flow
  - Design Decisions
  - Evidence
  - Limitations
  - Interview Questions

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
- Evidence badges: Measured, Verified, Pending

## Content Rules

Project cards should show:

1. problem
2. solution
3. evidence
4. tech stack, max 5 visible items
5. links to case study and GitHub

Case study pages should avoid long marketing copy.
They should read like an engineering design review.

## Done Criteria

A task is done only when:

- TypeScript compiles
- `npm test` passes
- `npm run lint` passes
- `npm run build` passes
- No fake metrics are introduced
- All primary pages are responsive
- All project cards have clear problem/solution/result
