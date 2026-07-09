import Link from "next/link";

import { SiteNavigation } from "@/components/site-navigation";
import { profile } from "@/content/profile";

export function SiteHeader() {
  return (
    <header
      data-print-hidden="true"
      className="border-border bg-background/95 relative z-50 border-b"
    >
      <div className="page-shell flex h-16 items-center justify-between gap-5">
        <Link
          href="/"
          prefetch={false}
          className="text-foreground flex min-h-11 items-center gap-3 font-mono text-sm font-bold tracking-[0.12em] uppercase"
          aria-label={`${profile.name} 포트폴리오 홈`}
        >
          <span className="border-input bg-card text-primary flex size-9 items-center justify-center rounded-md border text-xs">
            {profile.initials}
          </span>
          <span className="hidden sm:inline">Backend Portfolio</span>
        </Link>
        <SiteNavigation />
      </div>
    </header>
  );
}
