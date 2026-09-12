import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

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
      url: `${baseUrl}/posts`,
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
    const supabase = await createClient();
    const { data: posts } = await supabase
      .from("Post")
      .select("slug, updated_at, created_at")
      .eq("published", true);

    if (posts && posts.length > 0) {
      articleRoutes = posts.map((post) => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at || Date.now()),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.warn("Sitemap Supabase fetch error:", err);
  }

  if (articleRoutes.length === 0) {
    const fallbackSlugs = [
      "membangun-ai-agent-automation-nextjs-supabase",
      "optimasi-performa-web-modern-server-components-edge-caching",
      "panduan-lengkap-arsitektur-database-supabase-prisma-orm",
    ];

    articleRoutes = fallbackSlugs.map((slug) => ({
      url: `${baseUrl}/posts/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  }

  return [...staticRoutes, ...articleRoutes];
}
