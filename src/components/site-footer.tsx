import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { navigationItems, profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="page-shell footer-grid">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>함께 일할 사람을 찾고 계신가요?</h2>
          <p className="footer-copy">
            프로젝트의 결과보다 어떤 경계를 선택했고 무엇을 다시 확인했는지
            이야기하고 싶습니다.
          </p>
          <a
            className="text-link footer-email"
            href={`mailto:${profile.email}`}
          >
            {profile.email}
            <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </div>
        <div className="footer-links" aria-label="하단 메뉴">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false}>
              {item.label}
            </Link>
          ))}
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="성진혁 GitHub (새 창)"
          >
            GitHub ↗
          </a>
        </div>
      </div>
      <div className="page-shell footer-bottom">
        <span>
          © {new Date().getFullYear()} {profile.englishName}
        </span>
        <span>Built from source-backed project stories.</span>
      </div>
    </footer>
  );
}
