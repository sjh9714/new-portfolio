import type { MetadataRoute } from "next";

import { publishedBlogTopics } from "@/content/blog";
import { featuredPortfolioCases } from "@/content/portfolio-cases";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const routes = ["", "/case-studies", "/projects", "/resume", "/about"];
  const blogRoutes = publishedBlogTopics.length > 0 ? ["/blog"] : [];
  const blogArticleRoutes = publishedBlogTopics.map(
    (topic) => `/blog/${topic.slug}`,
  );
  const caseStudyRoutes = featuredPortfolioCases.map(
    (portfolioCase) => `/case-studies/${portfolioCase.slug}`,
  );

  return [
    ...routes,
    ...blogRoutes,
    ...blogArticleRoutes,
    ...caseStudyRoutes,
  ].map((route) => {
    const url = route === "" ? `${baseUrl}/` : `${baseUrl}${route}`;

    return {
      url,
      lastModified: new Date(),
    };
  });
}
