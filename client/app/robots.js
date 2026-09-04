export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: "https://kraviona.site/sitemap.xml",
    host: "https://kraviona.site",
  };
}