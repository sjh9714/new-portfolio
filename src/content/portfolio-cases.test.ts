import { describe, expect, it } from "vitest";

import { getProjectBySlug } from "./projects";
import {
  caseStudies,
  featuredPortfolioCases,
  featuredPortfolioProjectSlugs,
  getCardEvidence,
  getCaseStudiesByProjectSlug,
  getCaseStudyBySlug,
  getCaseStudyEvidence,
  getHeroEvidence,
  getPortfolioCaseProjectBadge,
  legacyCaseStudyAliases,
  validateCaseStudyContent,
} from "./portfolio-cases";

describe("portfolio case studies", () => {
  it("passes the semantic case-study validator", () => {
    expect(validateCaseStudyContent()).toEqual([]);
  });

  it("keeps four projects expanded into five focused cases", () => {
    expect(caseStudies.map((caseStudy) => caseStudy.slug)).toEqual([
      "concert-seat-overselling-consistency",
      "concert-outbox-dlt-recovery",
      "realtime-delivery-consistency",
      "billing-idempotency-webhook-ledger",
      "borrowme-product-list-n-plus-one",
    ]);
    expect(featuredPortfolioCases).toBe(caseStudies);
    expect(featuredPortfolioProjectSlugs).toEqual([
      "concert-booking",
      "realtime-chat",
      "ai-usage-billing-gateway",
      "borrow-me",
    ]);
    expect(getCaseStudiesByProjectSlug("concert-booking")).toHaveLength(2);
    expect(getCaseStudiesByProjectSlug("realtime-chat")).toHaveLength(1);
  });

  it("connects each case to a project and registered evidence IDs", () => {
    for (const caseStudy of caseStudies) {
      const project = getProjectBySlug(caseStudy.projectSlug);

      expect(project).toBeDefined();
      expect(project?.caseStudySlugs).toContain(caseStudy.slug);
      expect(getCaseStudyBySlug(caseStudy.slug)).toBe(caseStudy);
      expect(getCaseStudyEvidence(caseStudy).map((item) => item.id)).toEqual(
        caseStudy.evidenceIds,
      );
      expect(caseStudy.evidenceIds).toContain(caseStudy.cardEvidenceId);
      expect(
        caseStudy.heroEvidenceIds.every((id) =>
          caseStudy.evidenceIds.includes(id),
        ),
      ).toBe(true);
    }
  });

  it("derives card and hero proof from the shared evidence catalog", () => {
    for (const caseStudy of caseStudies) {
      expect(getCardEvidence(caseStudy).id).toBe(caseStudy.cardEvidenceId);
      expect(getHeroEvidence(caseStudy).map((item) => item.id)).toEqual(
        caseStudy.heroEvidenceIds,
      );
    }

    expect(
      getCardEvidence(getCaseStudyBySlug("concert-outbox-dlt-recovery")!).id,
    ).toBe("concert-dlt-replay");
    expect(
      getCardEvidence(getCaseStudyBySlug("billing-idempotency-webhook-ledger")!)
        .id,
    ).toBe("billing-usage-idempotency");
  });

  it("separates seat consistency from Outbox and DLT recovery", () => {
    const seat = getCaseStudyBySlug("concert-seat-overselling-consistency")!;
    const recovery = getCaseStudyBySlug("concert-outbox-dlt-recovery")!;
    const seatPayload = JSON.stringify(seat);
    const recoveryPayload = JSON.stringify(recovery);

    expect(seat.evidenceIds).toEqual([
      "concert-seat-single-winner",
      "concert-queue-token-boundary",
      "concert-reservation-idempotency",
      "concert-database-constraints",
    ]);
    expect(seatPayload).not.toContain("concert-outbox-retry");
    expect(seatPayload).not.toContain("concert-dlt-replay");
    expect(recovery.evidenceIds).toEqual([
      "concert-outbox-retry",
      "concert-dlt-replay",
    ]);
    expect(recoveryPayload).toContain("manual replay");
  });

  it("positions realtime around delivery consistency instead of N+1", () => {
    const realtime = getCaseStudyBySlug("realtime-delivery-consistency")!;

    expect(realtime.title).toContain("수신자 기준");
    expect(realtime.cardEvidenceId).toBe("realtime-delivery-completeness");
    expect(realtime.decisions.join(" ")).toContain("SUBSCRIBE");
    expect(realtime.decisions.join(" ")).toContain("afterMessageId");
    expect(realtime.evidenceIds).toContain("realtime-room-ordering");
    expect(realtime.evidenceIds).toContain("realtime-room-query-shape");
  });

  it("keeps billing claims to implemented API key, idempotency, webhook, and ledger boundaries", () => {
    const billing = getCaseStudyBySlug("billing-idempotency-webhook-ledger")!;
    const claimedSections = JSON.stringify({
      summary: billing.summary,
      decisions: billing.decisions,
      results: billing.results,
    });

    expect(claimedSections).toContain("API key");
    expect(claimedSections).toContain("providerEventId");
    expect(claimedSections).toContain("ledger");
    expect(claimedSections).not.toContain("tenant isolation");
    expect(claimedSections).not.toContain("멀티테넌트 격리");
  });

  it("keeps concise review sections and responsive architecture steps", () => {
    for (const caseStudy of caseStudies) {
      for (const section of [
        caseStudy.problem,
        caseStudy.naiveApproach,
        caseStudy.decisions,
        caseStudy.results,
      ]) {
        expect(section.length).toBeGreaterThan(0);
        expect(section.length).toBeLessThanOrEqual(3);
      }

      expect(caseStudy.architecture.imageSrc).toBe(
        `/architecture/cases/${caseStudy.slug}.svg`,
      );
      expect(caseStudy.architecture.alt.trim()).not.toBe("");
      expect(caseStudy.architecture.caption.trim()).not.toBe("");
      expect(caseStudy.architecture.mobileSteps.length).toBeGreaterThan(0);
      expect(caseStudy.limitations.length).toBeGreaterThan(0);
      expect(caseStudy.nextValidation.length).toBeGreaterThan(0);
      expect(caseStudy.interviewQuestions.length).toBeGreaterThan(0);
    }
  });

  it("uses a Map for legacy redirects and never resolves prototype keys", () => {
    expect(legacyCaseStudyAliases).toBeInstanceOf(Map);
    expect(legacyCaseStudyAliases.get("chat-room-n-plus-one-rps")).toBe(
      "realtime-delivery-consistency",
    );

    for (const prototypeKey of [
      "toString",
      "constructor",
      "__proto__",
      "valueOf",
      "hasOwnProperty",
    ]) {
      expect(legacyCaseStudyAliases.get(prototypeKey)).toBeUndefined();
      expect(getCaseStudyBySlug(prototypeKey)).toBeUndefined();
    }
  });

  it("labels the two concert deep dives without duplicating project titles", () => {
    const seat = getCaseStudyBySlug("concert-seat-overselling-consistency")!;
    const outbox = getCaseStudyBySlug("concert-outbox-dlt-recovery")!;

    expect(getPortfolioCaseProjectBadge(seat)).toBe(
      "Concert Booking · Deep Dive 1/2",
    );
    expect(getPortfolioCaseProjectBadge(outbox)).toBe(
      "Concert Booking · Deep Dive 2/2",
    );
  });

  it("does not publish unsupported BorrowMe history or pending proof", () => {
    const publicPayload = JSON.stringify(caseStudies);

    for (const unsupported of [
      "1,010",
      "1010",
      "201회",
      "201 queries",
      "201→3",
      "201 → 3",
      "23ms",
      '"status":"pending"',
    ]) {
      expect(publicPayload).not.toContain(unsupported);
    }
  });
});
