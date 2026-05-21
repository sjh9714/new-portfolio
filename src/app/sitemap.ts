import type { MetadataRoute } from "next";

import { featuredProjects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes = ["", "/projects", "/resume", "/blog", "/about"];
  const caseStudyRoutes = featuredProjects.map(
    (project) => `/case-studies/${project.slug}`,
  );

  return [...routes, ...caseStudyRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
