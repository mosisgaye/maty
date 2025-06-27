import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_CONFIG.domain;
  const currentDate = new Date();

  // Pages principales avec priorités optimisées
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/forfaits-mobiles`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/telephones`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/box-internet`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Pages légales
  const legalPages: MetadataRoute.Sitemap = [
    "/mentions-legales",
    "/politique-confidentialite",
    "/politique-cookies",
    "/cgv",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.3,
  }));

  // Combiner toutes les pages
  return [...mainPages, ...legalPages];
}
