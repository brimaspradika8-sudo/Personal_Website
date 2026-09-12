import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cinzel } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

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
    <html lang="id" className={`dark ${plusJakartaSans.variable} ${cinzel.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${plusJakartaSans.className} antialiased min-h-screen bg-[#0A0A0B] text-[#F1EFE9] transition-colors duration-500 overflow-x-hidden`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
