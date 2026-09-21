import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";

const montserrat = Montserrat({
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://brimas.vercel.app"),
  title: {
    default: "Brimas Pradika Utama — AI Systems Developer & Personal Portfolio",
    template: "%s | Brimas Pradika Utama",
  },
  description: "Portfolio & Personal Retreat of Brimas Pradika Utama — AI Systems Developer.",
  keywords: ["Brimas Pradika Utama", "AI Systems Developer", "Next.js", "React", "TypeScript", "Supabase", "Prisma"],
  authors: [{ name: "Brimas Pradika Utama" }],
  creator: "Brimas Pradika Utama",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Brimas Portfolio",
  },
  openGraph: {
    title: "Brimas Pradika Utama — AI Systems Developer & Personal Portfolio",
    description: "Personal Portfolio & Dashboard — AI Systems Developer.",
    url: "https://brimas.vercel.app",
    siteName: "Brimas Portfolio",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Brimas Pradika Utama Portfolio",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brimas Pradika Utama — AI Systems Developer & Personal Portfolio",
    description: "Personal Portfolio & Dashboard — AI Systems Developer.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "googleb7d311d5ce44a83b",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Brimas Pradika Utama",
    url: "https://brimas.vercel.app",
    jobTitle: "AI Systems Developer",
    sameAs: [
      "https://github.com/brimaspradika8-sudo",
      "https://linkedin.com",
    ],
  };

  return (
    <html lang="id" className={montserrat.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (localStorage.getItem("theme_mode") !== "day") localStorage.setItem("theme_mode", "day");
                  if (localStorage.getItem("landscape_mode") !== "day") localStorage.setItem("landscape_mode", "day");
                  if (localStorage.getItem("dashboard_theme") !== "day") localStorage.setItem("dashboard_theme", "day");
                  document.documentElement.classList.remove("dark");
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${montserrat.className} antialiased min-h-screen bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-500 overflow-x-hidden`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
