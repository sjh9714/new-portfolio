import type { NextConfig } from "next";

export function createContentSecurityPolicy(
  environment = process.env.NODE_ENV,
) {
  const scriptSources = ["'self'", "'unsafe-inline'"];
  if (environment === "development") scriptSources.push("'unsafe-eval'");

  return [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${scriptSources.join(" ")}`,
    "connect-src 'self'",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/case-studies",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/case-studies/concert-seat-overselling-consistency",
        destination:
          "/projects/concert-booking?flow=seat-contention&variant=designed&step=1#seat-contention",
        permanent: true,
      },
      {
        source: "/case-studies/concert-outbox-dlt-recovery",
        destination:
          "/projects/concert-booking?flow=event-recovery&variant=designed&step=1#event-recovery",
        permanent: true,
      },
      {
        source: "/case-studies/realtime-delivery-consistency",
        destination:
          "/projects/realtime-chat?flow=message-lifecycle&variant=designed&step=1#message-lifecycle",
        permanent: true,
      },
      {
        source: "/case-studies/borrowme-product-list-n-plus-one",
        destination: "/projects/borrow-me#borrow-lifecycle",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: createContentSecurityPolicy(),
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
