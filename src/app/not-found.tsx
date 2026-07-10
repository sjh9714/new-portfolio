import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  description: "요청한 포트폴리오 페이지를 찾을 수 없습니다.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="not-found page-shell">
      <p className="eyebrow">404 / Not found</p>
      <h1>
        이 이야기는
        <br />
        여기에 없습니다.
      </h1>
      <p>
        주소가 바뀌었거나 공개하지 않은 작업입니다. 존재하지 않는 사례를 다른
        프로젝트로 대신 연결하지 않습니다.
      </p>
      <Link className="primary-action" href="/">
        <ArrowLeft aria-hidden="true" size={18} /> 홈으로 돌아가기
      </Link>
    </section>
  );
}
