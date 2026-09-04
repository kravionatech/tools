import Header from "../components/Header";
import Footer from "../components/Footer";
import ScriptInjector from "../components/ScriptInjector";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://kraviona.site"),
  title: { default: "Kraviona | SEO & Image Tools", template: "%s | Kraviona" },
  description:
    "Practical SEO checks, private image conversion, and clear guides for website owners.",
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Kraviona",
    title: "Kraviona | SEO & Image Tools",
    description: "Practical tools and clear guidance for the web.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kraviona | SEO & Image Tools",
    description: "Practical tools and clear guidance for the web.",
  },
};

async function getSiteSettings() {
  try {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:5000";
    const res = await fetch(`${backendUrl}/api/settings`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    return null;
  }
}

export default async function RootLayout({ children }) {
  const settings = await getSiteSettings();
  const headerScripts = settings?.headerScripts || "";
  const bodyStartScripts = settings?.bodyStartScripts || "";
  const bodyEndScripts = settings?.bodyEndScripts || "";

  return (
    <html lang="en">
      <head>
        {/* Dynamic Head Code Injection (GA4, GTM, Pixel, GSC verification, etc.) */}
        {headerScripts && (
          <div
            id="kraviona-head-scripts"
            style={{ display: "none" }}
            dangerouslySetInnerHTML={{ __html: headerScripts }}
          />
        )}
      </head>
      <body>
        {/* Dynamic Body Start Code Injection (GTM noscript, etc.) */}
        {bodyStartScripts && (
          <div
            id="kraviona-body-start-scripts"
            dangerouslySetInnerHTML={{ __html: bodyStartScripts }}
          />
        )}

        <Header />
        {children}
        <Footer />

        {/* Dynamic Body End Code Injection (chat widgets, conversion scripts, etc.) */}
        {bodyEndScripts && (
          <div
            id="kraviona-body-end-scripts"
            dangerouslySetInnerHTML={{ __html: bodyEndScripts }}
          />
        )}

        {/* Client-side script execution helper */}
        <ScriptInjector
          headerScripts={headerScripts}
          bodyScripts={bodyStartScripts + bodyEndScripts}
        />
      </body>
    </html>
  );
}
