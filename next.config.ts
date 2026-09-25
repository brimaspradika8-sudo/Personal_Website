import type { NextConfig } from "next";
import nextBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "three",
      "@react-three/fiber",
      "@react-three/rapier",
      "@rive-app/react-canvas",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/extension-image",
    ],
  },
  async redirects() {
    return [
      { source: "/proyek", destination: "/projects", permanent: true },
      { source: "/proyek/:path*", destination: "/projects/:path*", permanent: true },
      { source: "/artikel", destination: "/articles", permanent: true },
      { source: "/artikel/:path*", destination: "/articles/:path*", permanent: true },
      { source: "/dashboard/proyek", destination: "/dashboard/projects", permanent: true },
      { source: "/dashboard/proyek/:path*", destination: "/dashboard/projects/:path*", permanent: true },
      { source: "/dashboard/artikel", destination: "/dashboard/articles", permanent: true },
      { source: "/dashboard/artikel/:path*", destination: "/dashboard/articles/:path*", permanent: true },
      { source: "/admin/proyek", destination: "/admin/projects", permanent: true },
      { source: "/admin/proyek/:path*", destination: "/admin/projects/:path*", permanent: true },
      { source: "/admin/artikel", destination: "/admin/articles", permanent: true },
      { source: "/admin/artikel/:path*", destination: "/admin/articles/:path*", permanent: true },
    ];
  },
  images: {
    dangerouslyAllowSVG: false,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "base-uri 'self';",
              "object-src 'none';",
              "form-action 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "img-src 'self' data: blob: https://*.googleusercontent.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://api.dicebear.com https://*.supabase.co https://*.unsplash.com https://images.unsplash.com;",
              "font-src 'self' data: https://fonts.gstatic.com;",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.elevenlabs.io https://vitals.vercel-insights.com;",
              "media-src 'self' blob: https://*.supabase.co;",
              "frame-ancestors 'none';",
              "upgrade-insecure-requests;",
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
