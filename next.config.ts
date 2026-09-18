import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  experimental: {
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
};

export default nextConfig;
