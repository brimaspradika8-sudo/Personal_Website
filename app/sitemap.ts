import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brimas.vercel.app";

  const routes = [
    "",
    "/dashboard",
    "/login",
    "/register",
    "/profile",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" || route === "/dashboard" ? 1.0 : 0.8,
  }));

  return routes;
}
