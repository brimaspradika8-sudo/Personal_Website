import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { AnalyticsWrapper } from "@/components/AnalyticsWrapper";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";

const montserrat = Montserrat({
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const isProductionEnv =
  (process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV ?? "production") === "production";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brimas.vercel.app";

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Brimas Pradika Utama | Personal Website",
    template: "%s | Brimas Pradika Utama",
  },

  description:
    "Personal website of Brimas Pradika Utama, a Software Engineering student and developer from Indonesia. Explore projects, articles, and web development work.",

  keywords: [
    "Brimas Pradika Utama",
    "Brimas",
    "Software Engineering",
    "Web Developer",
    "Full Stack Developer",
    "Indonesia",
  ],

  authors: [
    {
      name: "Brimas Pradika Utama",
    },
  ],

  creator: "Brimas Pradika Utama",

  alternates: {
    canonical: siteUrl,
  },

  icons: {
    icon: "/icon.webp",
    shortcut: "/icon.webp",
    apple: "/icon.webp",
  },

  manifest: "/manifest.json",

  openGraph: {
    title: "Brimas Pradika Utama | Personal Website",
    description:
      "Personal website of Brimas Pradika Utama, featuring projects, articles, and web development work.",
    url: siteUrl,
    siteName: "Brimas Pradika Utama",
    images: [
      {
        url: "/icon.webp",
        width: 1200,
        height: 630,
        alt: "Brimas Pradika Utama",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Brimas Pradika Utama | Personal Website",
    description:
      "Personal website of Brimas Pradika Utama.",
    images: ["/icon.webp"],
  },

  robots: {
    index: isProductionEnv,
    follow: isProductionEnv,
    nocache: !isProductionEnv,
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
    url: siteUrl,
    jobTitle: "AI Systems Developer",
    sameAs: [
      "https://github.com/brimaspradika8-sudo",
      "https://linkedin.com",
    ],
  };

  return (
    <html lang="id" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${montserrat.className} antialiased min-h-screen bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-500 overflow-x-hidden`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
