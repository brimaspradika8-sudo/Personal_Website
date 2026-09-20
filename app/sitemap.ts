import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brimaspradika.com";

  // Static routes
  const routes = ["", "/dashboard", "/about", "/artikel", "/profile"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1.0 : 0.8,
    })
  );

  // Dynamic article routes from database
  try {
    const articles = await prisma.article.findMany({
      select: {
        slug: true,
        updated_at: true,
      },
    });

    const articleRoutes = articles.map((art) => ({
      url: `${baseUrl}/artikel/${art.slug}`,
      lastModified: art.updated_at.toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...routes, ...articleRoutes];
  } catch {
    return routes;
  }
}
