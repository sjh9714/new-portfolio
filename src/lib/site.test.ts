import { afterEach, describe, expect, it, vi } from "vitest";

import { getSiteUrl } from "./site";

describe("getSiteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns an origin without a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://portfolio.example.com/");
    vi.stubEnv("NODE_ENV", "production");

    expect(getSiteUrl()).toBe("https://portfolio.example.com");
  });

  it.each([
    "https://user:password@portfolio.example.com",
    "https://portfolio.example.com/work",
    "https://portfolio.example.com?preview=1",
    "https://portfolio.example.com#profile",
  ])("rejects a site URL that is not origin-only: %s", (candidate) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", candidate);
    vi.stubEnv("NODE_ENV", "production");

    expect(() => getSiteUrl()).toThrow(/origin-only/);
  });

  it("requires HTTPS in production", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://portfolio.example.com");
    vi.stubEnv("NODE_ENV", "production");

    expect(() => getSiteUrl()).toThrow(/HTTPS/);
  });

  it("allows an HTTP localhost origin outside production", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000/");
    vi.stubEnv("NODE_ENV", "development");

    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});
