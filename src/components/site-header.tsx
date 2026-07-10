"use client";

import { Code2, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navigationItems, profile } from "@/content/profile";

function isCurrent(pathname: string, href: string) {
  if (href === "/projects" && pathname.startsWith("/cases")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          href="/"
          prefetch={false}
          className="brand-link"
          aria-label="성진혁 홈"
        >
          <span className="brand-mark" aria-hidden="true">
            SJH
          </span>
          <span>{profile.name}</span>
        </Link>

        <nav className="desktop-nav" aria-label="주요 메뉴">
          {navigationItems.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                aria-current={current ? "page" : undefined}
                className="nav-link"
              >
                {item.label}
              </Link>
            );
          })}
          <a
            className="nav-link nav-external"
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="성진혁 GitHub (새 창)"
          >
            <Code2 size={17} aria-hidden="true" />
            GitHub
          </a>
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-menu" className="mobile-nav" aria-label="모바일 메뉴">
          {navigationItems.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                aria-current={current ? "page" : undefined}
                className="mobile-nav-link"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            className="mobile-nav-link"
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="성진혁 GitHub (새 창)"
            onClick={() => setOpen(false)}
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </nav>
      ) : null}
    </header>
  );
}
