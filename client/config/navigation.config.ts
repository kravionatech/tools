export interface NavChildItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChildItem[];
}

export const publicNavLinks: NavItem[] = [
  { label: "All Tools", href: "/tools" },
  {
    label: "Text Tools",
    href: "/tools/text",
    children: [
      { label: "Word Counter", href: "/tools/word-counter" },
      { label: "Text Case Converter", href: "/tools/text-case-converter" },
      { label: "Keyword Density", href: "/tools/keyword-density" },
      { label: "Text Diff", href: "/tools/text-diff" },
      { label: "Markdown Previewer", href: "/tools/markdown-previewer" },
      { label: "Lorem Ipsum", href: "/tools/lorem-ipsum" },
    ],
  },
  {
    label: "Image Tools",
    href: "/tools/image",
    children: [
      { label: "Image Compressor", href: "/tools/image-compressor" },
      { label: "Image Resizer", href: "/tools/image-resizer" },
      { label: "JPG to WebP", href: "/tools/jpg-to-webp" },
      { label: "Favicon Generator", href: "/tools/favicon-generator" },
      { label: "Image to Base64", href: "/tools/image-to-base64" },
    ],
  },
  {
    label: "SEO Tools",
    href: "/tools/seo",
    children: [
      { label: "Meta Tag Generator", href: "/tools/meta-tag-generator" },
      { label: "SERP Preview", href: "/tools/serp-preview" },
      { label: "Schema Generator", href: "/tools/schema-generator" },
      { label: "Robots.txt Generator", href: "/tools/robots-txt-generator" },
      { label: "XML Sitemap Generator", href: "/tools/xml-sitemap-generator" },
    ],
  },
  { label: "Upcoming", href: "/upcoming" },
];
