import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center gap-6 px-5 py-12 md:px-8">
      <p className="text-muted-foreground text-sm font-semibold tracking-[0.18em] uppercase">
        404
      </p>
      <h1 className="text-foreground text-4xl font-bold tracking-tight">
        페이지를 찾을 수 없습니다.
      </h1>
      <p className="text-muted-foreground text-sm leading-7">
        존재하지 않는 case study이거나 아직 공개하지 않은 페이지입니다.
      </p>
      <div>
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
