import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/case-studies",
        destination: "/cases",
        permanent: true,
      },
      {
        source: "/case-studies/concert-seat-overselling-consistency",
        destination: "/cases/concert-seat-contention",
        permanent: true,
      },
      {
        source: "/case-studies/concert-outbox-dlt-recovery",
        destination: "/cases/concert-event-recovery",
        permanent: true,
      },
      {
        source: "/case-studies/realtime-delivery-consistency",
        destination: "/cases/realtime-message-lifecycle",
        permanent: true,
      },
      {
        source: "/case-studies/borrowme-product-list-n-plus-one",
        destination: "/cases/borrowme-return-and-harden",
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
            value:
              "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
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
