import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createRootMetadata } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = createRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="bg-foreground fixed top-3 left-3 z-[100] -translate-y-20 rounded-md px-4 py-3 text-sm font-semibold text-white transition-transform focus:translate-y-0"
        >
          본문 바로가기
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
