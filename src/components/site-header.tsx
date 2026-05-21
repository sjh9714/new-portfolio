import Link from "next/link";

import { navigationItems, profile } from "@/content/profile";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-foreground"
          aria-label="SJH portfolio home"
        >
          {profile.initials}
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/projects"
          className="text-sm font-semibold text-primary md:hidden"
        >
          Projects
        </Link>
      </div>
    </header>
  );
}
