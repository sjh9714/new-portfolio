import Link from "next/link";

import { navigationItems, profile } from "@/content/profile";

export function SiteHeader() {
  return (
    <header className="border-border bg-background border-b">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:gap-6 md:px-8">
        <Link
          href="/"
          className="text-foreground text-2xl font-bold tracking-tight"
          aria-label="성진혁 portfolio home"
        >
          {profile.initials}
        </Link>
        <nav
          aria-label="Primary navigation"
          className="flex w-full items-center gap-5 overflow-x-auto md:w-auto md:gap-7"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground hover:text-primary shrink-0 text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
