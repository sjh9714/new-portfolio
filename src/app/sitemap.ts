import type { MetadataRoute } from "next";

import { engineeringCases } from "@/content/cases";
import { flows } from "@/content/flows";
import { projects } from "@/content/projects";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${base}/cases`, changeFrequency: "monthly", priority: 0.75 },
    ...engineeringCases.map((item) => ({
      url: `${base}/cases/${item.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${base}/flows`, changeFrequency: "monthly", priority: 0.8 },
    ...flows.map((flow) => ({
      url: `${base}/flows/${flow.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    { url: `${base}/resume`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
