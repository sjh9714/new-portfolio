import { describe, expect, it } from "vitest";

import nextConfig, { securityHeaders } from "../../next.config";

describe("security headers", () => {
  it("disables the framework signature", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it("applies defense-in-depth headers to every route", async () => {
    const configuredHeaders = await nextConfig.headers?.();

    expect(configuredHeaders).toEqual([
      {
        source: "/:path*",
        headers: [...securityHeaders],
      },
    ]);
  });

  it("prevents framing, MIME sniffing, and broad device access", () => {
    const headers = new Map(
      securityHeaders.map(({ key, value }) => [key, value]),
    );
    const csp = headers.get("Content-Security-Policy");

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers.get("Permissions-Policy")).toContain("camera=()");
    expect(headers.get("Permissions-Policy")).toContain("microphone=()");
  });
});
