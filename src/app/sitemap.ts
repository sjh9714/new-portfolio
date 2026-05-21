import type { MetadataRoute } from "next";

import { featuredProjects } from "@/content/projects";
import { publishedBlogTopics } from "@/content/blog";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const routes = ["", "/projects", "/resume", "/about"];
  const blogRoutes = publishedBlogTopics.length > 0 ? ["/blog"] : [];
  const caseStudyRoutes = featuredProjects.map(
    (project) => `/case-studies/${project.slug}`,
  );

  return [...routes, ...blogRoutes, ...caseStudyRoutes].map((route) => {
    const url = route === "" ? `${baseUrl}/` : `${baseUrl}${route}`;

    return {
      url,
      lastModified: new Date(),
    };
  });
}
