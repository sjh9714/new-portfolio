import Link from "next/link";

import { navigationItems, profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer data-print-hidden="true" className="border-border bg-card border-t">
      <div className="page-shell grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-xl space-y-2">
          <p className="text-primary font-mono text-xs font-semibold tracking-[0.14em] uppercase">
            {profile.initials} / Backend
          </p>
          <p className="text-muted-foreground text-sm leading-6">
            동시성·이벤트 복구·실시간 메시징·과금 정합성을 재현 가능한 근거로
            설명합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className="text-muted-foreground hover:text-foreground min-h-11 content-center"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground min-h-11 content-center"
            aria-label="GitHub (새 창)"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
