import Link from "next/link";
import JsonLd from "./JsonLd";

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  const fullItems = [{ label: "Home", href: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": fullItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://kraviona.site${item.href}`,
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <ol>
          {fullItems.map((item, idx) => {
            const isLast = idx === fullItems.length - 1;
            return (
              <li key={item.href || idx}>
                {isLast ? (
                  <span aria-current="page">{item.label}</span>
                ) : (
                  <>
                    <Link href={item.href}>{item.label}</Link>
                    <span className="sep" aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
