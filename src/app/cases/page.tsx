import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { engineeringCases } from "@/content/cases";
import { getProject } from "@/content/projects";
import { createTopLevelMetadata } from "@/lib/site";

const description = "프로젝트 안의 하나의 실패 경계를 깊게 다룬 사례.";

export const metadata: Metadata = {
  title: "Engineering Cases",
  description,
  ...createTopLevelMetadata({
    title: "Engineering Cases",
    description,
    path: "/cases",
  }),
};

export default function CasesPage() {
  return (
    <>
      <header className="inner-hero page-shell">
        <p className="eyebrow">Engineering cases</p>
        <h1>
          하나의 실패 경계를
          <br />
          끝까지 따라갑니다.
        </h1>
        <p>
          프로젝트의 전체 기능을 반복하지 않고, 사용자에게 영향을 주는 한 가지
          경계와 선택한 trade-off만 다룹니다.
        </p>
      </header>
      <section
        className="page-shell case-index"
        aria-label="엔지니어링 사례 목록"
      >
        {engineeringCases.map((item, index) => {
          const project = getProject(item.projectSlug);
          return (
            <Link key={item.slug} href={`/cases/${item.slug}`} prefetch={false}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p>{project?.title}</p>
                <h2>{item.title}</h2>
                <small>{item.summary}</small>
              </div>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          );
        })}
      </section>
    </>
  );
}
