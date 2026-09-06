import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import CustomCodeInjector from "@/components/seo/CustomCodeInjector";
import { siteConfig, SITE_URL } from "@/lib/site-config";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kraviona Tools — Free Online Tools for SEO, Images & Text",
    template: "%s | Kraviona Tools",
  },
  description:
    "Free browser-based tools for SEO professionals, content writers, and digital marketers. Convert images, analyze text, generate meta tags, build sitemaps, and more — no uploads, no accounts needed.",
  keywords: [
    "free online tools",
    "SEO tools",
    "image converter",
    "text tools",
    "meta tag generator",
    "word counter",
    "image compressor",
    "browser tools",
  ],
  authors: [{ name: "Kraviona Tools" }],
  creator: "Kraviona Tools",
  publisher: "Kraviona Tools",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Kraviona Tools",
    title: "Kraviona Tools — Free Online Tools for SEO, Images & Text",
    description:
      "Free browser-based tools for SEO, content, and digital marketing. No uploads, no accounts, instant results.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Kraviona Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kraviona Tools — Free Online Tools for SEO, Images & Text",
    description:
      "Free browser-based tools for SEO, content, and digital marketing. No uploads, no accounts, instant results.",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/logo/logo-icon.svg",
    shortcut: "/favicon.ico",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kraviona",
    url: siteUrl,
    logo: `${siteUrl}/logo/logo-primary.svg`,
    sameAs: [],
  };

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <CustomCodeInjector />
        <AnalyticsTracker />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
