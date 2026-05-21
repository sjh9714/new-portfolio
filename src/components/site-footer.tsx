import Link from "next/link";

import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
        <p>{profile.initials} Backend Portfolio</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/projects" className="hover:text-foreground">
            Projects
          </Link>
          <Link href="/resume" className="hover:text-foreground">
            Resume
          </Link>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
