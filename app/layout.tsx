import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cinzel } from "next/font/google";
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
  title: "Brimas Pradika Utama — Wilderness & Personal Portfolio",
  description: "Personal portfolio & adventure landscape dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${cinzel.variable}`}>
      <body className={`${plusJakartaSans.className} antialiased min-h-screen transition-colors duration-500 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
