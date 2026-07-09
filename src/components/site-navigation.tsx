"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { navigationItems } from "@/content/profile";
import { cn } from "@/lib/utils";

function isCurrentRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavigation() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  function openMenu() {
    dialogRef.current?.showModal();
  }

  function closeMenu() {
    dialogRef.current?.close();
    triggerRef.current?.focus();
  }

  return (
    <>
      <nav aria-label="주요 메뉴" className="hidden items-center gap-7 md:flex">
        {navigationItems.map((item) => {
          const current = isCurrentRoute(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={current ? "page" : undefined}
              className={cn(
                "text-muted-foreground hover:text-foreground relative flex min-h-11 items-center text-sm font-semibold transition-colors",
                current &&
                  "text-foreground after:bg-primary after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="메뉴 열기"
        onClick={openMenu}
      >
        <Menu aria-hidden="true" />
      </Button>

      <dialog
        ref={dialogRef}
        aria-label="모바일 메뉴"
        className="border-border bg-background text-foreground fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(88vw,360px)] max-w-none border-l p-0 backdrop:bg-slate-950/35 open:flex open:flex-col"
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            closeMenu();
          }
        }}
      >
        <div className="border-border flex h-16 items-center justify-between border-b px-5">
          <span className="text-muted-foreground font-mono text-xs font-semibold tracking-[0.14em] uppercase">
            Navigation
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="메뉴 닫기"
            onClick={closeMenu}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        <nav aria-label="모바일 주요 메뉴" className="flex flex-col px-5 py-6">
          {navigationItems.map((item) => {
            const current = isCurrentRoute(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "border-border text-muted-foreground flex min-h-14 items-center border-b text-lg font-semibold",
                  current && "border-primary text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </dialog>
    </>
  );
}
