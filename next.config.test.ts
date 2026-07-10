import { describe, expect, it } from "vitest";

import nextConfig, { createContentSecurityPolicy } from "./next.config";

describe("Content-Security-Policy", () => {
  it("does not allow eval in production", () => {
    expect(createContentSecurityPolicy("production")).not.toContain(
      "'unsafe-eval'",
    );
  });

  it("uses the environment-aware policy in the real response header config", async () => {
    const routeHeaders = await nextConfig.headers?.();
    const policy = routeHeaders?.[0]?.headers.find(
      (header) => header.key === "Content-Security-Policy",
    )?.value;

    expect(policy).toBe(createContentSecurityPolicy());
    expect(policy).not.toContain("'unsafe-eval'");
  });

  it("keeps eval available only for the Next.js development runtime", () => {
    expect(createContentSecurityPolicy("development")).toContain(
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    );
    expect(createContentSecurityPolicy("test")).not.toContain("'unsafe-eval'");
  });
});
