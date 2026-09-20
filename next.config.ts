import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
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
      {
        source: "/projects",
        destination: "/proyek",
        permanent: true,
      },
      {
        source: "/admin/projects",
        destination: "/admin/proyek",
        permanent: true,
      },
      {
        source: "/admin/projects/:path*",
        destination: "/admin/proyek/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
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
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://cdn.jsdelivr.net;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "img-src 'self' data: blob: https://*.googleusercontent.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://api.dicebear.com https://*.supabase.co https://*.unsplash.com https://images.unsplash.com;",
              "font-src 'self' data: https://fonts.gstatic.com;",
              "connect-src 'self' https://*.supabase.co https://api.elevenlabs.io https://vitals.vercel-insights.com;",
              "media-src 'self' blob: https://*.supabase.co;",
              "frame-ancestors 'none';",
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
