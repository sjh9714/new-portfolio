import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { navigationItems, profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="page-shell footer-grid">
        <div>
          <p className="eyebrow">연락</p>
          <h2>프로젝트의 맥락과 판단을 더 이야기할 수 있습니다.</h2>
          <p className="footer-copy">
            팀에서 맡았던 범위, 클라이언트를 연결하며 발견한 문제, 테스트로 남긴
            경계를 편하게 물어봐 주세요.
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
        <span>프로젝트 사실과 공개 근거로 작성했습니다.</span>
      </div>
    </footer>
  );
}
