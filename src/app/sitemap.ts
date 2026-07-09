import type { MetadataRoute } from "next";

import { publishedBlogTopics } from "@/content/blog";
import { featuredPortfolioCases } from "@/content/portfolio-cases";
import { getAbsoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/case-studies", "/projects", "/resume", "/about"];
  const blogRoutes = publishedBlogTopics.length > 0 ? ["/blog"] : [];
  const routeEntries = [...routes, ...blogRoutes].map((route) => ({
    url: getAbsoluteUrl(route || "/"),
  }));
  const blogArticleEntries = publishedBlogTopics.map((topic) => ({
    url: getAbsoluteUrl(`/blog/${topic.slug}`),
    lastModified: topic.publishedAt,
  }));
  const caseStudyEntries = featuredPortfolioCases.map((portfolioCase) => ({
    url: getAbsoluteUrl(`/case-studies/${portfolioCase.slug}`),
  }));

  return [...routeEntries, ...blogArticleEntries, ...caseStudyEntries];
}
