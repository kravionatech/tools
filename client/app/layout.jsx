import Header from "../components/Header";
import Footer from "../components/Footer";
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
