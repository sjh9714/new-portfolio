import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[65vh] max-w-3xl flex-col justify-center gap-6 py-12">
      <p className="section-kicker">404</p>
      <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
        페이지를 찾을 수 없습니다.
      </h1>
      <p className="text-muted-foreground max-w-xl text-base leading-7">
        존재하지 않는 문제 해결 사례이거나 아직 공개하지 않은 페이지입니다.
      </p>
      <div>
        <Button asChild>
          <Link href="/" prefetch={false}>
            홈으로 돌아가기
          </Link>
        </Button>
      </div>
    </div>
  );
}
