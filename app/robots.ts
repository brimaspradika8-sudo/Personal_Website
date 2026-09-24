import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProductionEnv =
    (process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV ?? "production") === "production";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brimas.vercel.app";

  if (!isProductionEnv) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
