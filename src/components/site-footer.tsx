import Link from "next/link";

import { navigationItems, profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="border-border bg-background border-t">
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-8">
        <p>{profile.name} 백엔드 포트폴리오</p>
        <div className="flex flex-wrap gap-4">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
          <a href={`mailto:${profile.email}`} className="hover:text-foreground">
            이메일
          </a>
        </div>
      </div>
    </footer>
  );
}
