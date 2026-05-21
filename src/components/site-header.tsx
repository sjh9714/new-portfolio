import Link from "next/link";

import { navigationItems, profile } from "@/content/profile";

export function SiteHeader() {
  return (
    <header className="border-border bg-background border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link
          href="/"
          className="text-foreground text-2xl font-bold tracking-tight"
          aria-label="성진혁 portfolio home"
        >
          {profile.initials}
        </Link>
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 md:flex"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground hover:text-primary text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/projects"
          className="text-primary text-sm font-semibold md:hidden"
        >
          Projects
        </Link>
      </div>
    </header>
  );
}
