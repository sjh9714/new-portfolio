import type { Metadata } from "next";

import { ProjectCard, ProjectRow } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  additionalProjects,
  archiveProjects,
  featuredProjects,
} from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Featured, additional, and archive backend projects grouped by evidence depth.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-12 md:px-8 md:py-16">
      <SectionHeader
        title="Projects"
        description="Featured case study와 additional project를 읽는 부담이 적은 단위로 나눴습니다."
      />
      <Tabs defaultValue="featured" className="gap-8">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>
        <TabsContent value="featured" className="grid gap-4 lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </TabsContent>
        <TabsContent value="additional">
          <div className="border-border border-y">
            {additionalProjects.map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="archive">
          <div className="border-border border-y">
            {archiveProjects.map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
