import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { absoluteUrl, SITE_URL } from "@/lib/site-config";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        ...(item.href
          ? { item: absoluteUrl(item.href) }
          : {}),
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="flex items-center gap-1 hover:text-purple-600 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span className="sr-only">Home</span>
        </Link>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            {item.href ? (
              <Link href={item.href} className="hover:text-purple-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
