import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://brimas.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.article.findMany({
      select: { slug: true, updated_at: true, created_at: true },
    });

    if (posts && posts.length > 0) {
      articleRoutes = posts.map((post) => ({
        url: `${baseUrl}/artikel/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at || Date.now()),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.warn("Sitemap fetch error:", err);
  }

  if (articleRoutes.length === 0) {
    const fallbackSlugs = [
      "membangun-ai-agent-automation-nextjs-supabase",
      "optimasi-performa-web-modern-server-components-edge-caching",
      "panduan-lengkap-arsitektur-database-supabase-prisma-orm",
    ];

    articleRoutes = fallbackSlugs.map((slug) => ({
      url: `${baseUrl}/artikel/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  }

  return [...staticRoutes, ...articleRoutes];
}
