export type ToolCategory = "text" | "image" | "seo";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  category: ToolCategory;
  icon: string; // emoji
  keywords: string[];
  popular?: boolean;
  featured?: boolean;
  relatedSlugs?: string[];
}

export interface UpcomingTool {
  name: string;
  description: string;
  whyUseful: string;
  category: ToolCategory | "ai";
  icon: string;
}

export const tools: Tool[] = [
  // ── TEXT TOOLS ──────────────────────────────────────────────────────────
  {
    slug: "word-counter",
    name: "Word Counter",
    description:
      "Count words, characters, sentences, paragraphs, and estimate reading time in real time. Paste any text and get instant statistics.",
    shortDescription: "Count words, characters & estimate reading time instantly.",
    category: "text",
    icon: "📝",
    keywords: ["word count", "character count", "reading time", "text statistics"],
    popular: true,
    featured: true,
    relatedSlugs: ["text-statistics", "keyword-density", "text-case-converter"],
  },
  {
    slug: "text-case-converter",
    name: "Text Case Converter",
    description:
      "Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case instantly.",
    shortDescription: "Convert text to UPPERCASE, lowercase, Title Case, camelCase, and more.",
    category: "text",
    icon: "🔡",
    keywords: ["text case", "uppercase", "lowercase", "title case", "camelcase", "snake_case"],
    popular: true,
    relatedSlugs: ["word-counter", "text-cleaner", "text-to-slug"],
  },
  {
    slug: "remove-extra-spaces",
    name: "Remove Extra Spaces",
    description:
      "Clean up text by removing extra spaces, double spaces, leading and trailing whitespace, and unnecessary blank lines from any text.",
    shortDescription: "Strip extra spaces, double spaces, and leading/trailing whitespace.",
    category: "text",
    icon: "🧹",
    keywords: ["remove spaces", "clean text", "trim whitespace", "text cleaner"],
    relatedSlugs: ["text-cleaner", "remove-duplicate-lines", "find-replace"],
  },
  {
    slug: "remove-duplicate-lines",
    name: "Remove Duplicate Lines",
    description:
      "Remove duplicate lines from any list or text. Options for case-sensitive and case-insensitive deduplication, and sorting.",
    shortDescription: "Remove repeated lines from text or lists in one click.",
    category: "text",
    icon: "🔄",
    keywords: ["remove duplicates", "deduplicate lines", "unique lines", "text cleaner"],
    relatedSlugs: ["remove-extra-spaces", "text-sorter", "text-cleaner"],
  },
  {
    slug: "find-replace",
    name: "Find & Replace Text",
    description:
      "Find and replace words or phrases in any block of text. Supports plain text replacement and case-sensitive matching.",
    shortDescription: "Find and replace words or phrases in any text instantly.",
    category: "text",
    icon: "🔍",
    keywords: ["find replace", "text substitution", "search replace"],
    relatedSlugs: ["remove-extra-spaces", "text-cleaner", "text-case-converter"],
  },
  {
    slug: "text-sorter",
    name: "Text Sorter",
    description:
      "Sort lines of text alphabetically (A-Z or Z-A), by length, numerically, or randomly. Great for sorting lists and keywords.",
    shortDescription: "Sort lines alphabetically, by length, or numerically.",
    category: "text",
    icon: "🔀",
    keywords: ["sort text", "sort lines", "alphabetical sort", "text organizer"],
    relatedSlugs: ["remove-duplicate-lines", "find-replace", "text-cleaner"],
  },
  {
    slug: "text-reverser",
    name: "Text Reverser",
    description:
      "Reverse any text character by character, or reverse the order of lines or words. Useful for encoding, mirroring, or creative writing.",
    shortDescription: "Reverse text character by character, word by word, or line by line.",
    category: "text",
    icon: "↩️",
    keywords: ["reverse text", "mirror text", "backwards text"],
    relatedSlugs: ["text-case-converter", "text-cleaner", "text-sorter"],
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description:
      "Generate Lorem Ipsum placeholder text by paragraphs, sentences, or words. Perfect for web design mockups and content layouts.",
    shortDescription: "Generate Lorem Ipsum filler text by paragraphs, sentences, or words.",
    category: "text",
    icon: "📄",
    keywords: ["lorem ipsum", "placeholder text", "dummy text", "filler text"],
    popular: true,
    relatedSlugs: ["word-counter", "text-statistics", "markdown-previewer"],
  },
  {
    slug: "text-diff",
    name: "Text Diff / Compare",
    description:
      "Compare two blocks of text side by side. Highlights added, removed, and changed lines with color coding for easy review.",
    shortDescription: "Compare two texts and highlight differences line by line.",
    category: "text",
    icon: "🔬",
    keywords: ["text diff", "compare text", "text comparison", "diff tool"],
    featured: true,
    relatedSlugs: ["find-replace", "remove-duplicate-lines", "word-counter"],
  },
  {
    slug: "markdown-previewer",
    name: "Markdown Previewer",
    description:
      "Write Markdown and see a live rendered HTML preview in real time. Supports all standard Markdown syntax including tables, code blocks, and blockquotes.",
    shortDescription: "Write Markdown and see a live rendered preview instantly.",
    category: "text",
    icon: "⬇️",
    keywords: ["markdown preview", "markdown editor", "markdown renderer"],
    popular: true,
    featured: true,
    relatedSlugs: ["markdown-to-html", "html-to-text", "text-statistics"],
  },
  {
    slug: "markdown-to-html",
    name: "Markdown to HTML",
    description:
      "Convert Markdown text to clean HTML code instantly. Perfect for blog posts, documentation, and any content workflow.",
    shortDescription: "Convert Markdown to clean HTML in your browser.",
    category: "text",
    icon: "🌐",
    keywords: ["markdown to html", "md to html", "convert markdown"],
    relatedSlugs: ["markdown-previewer", "html-to-text", "text-to-slug"],
  },
  {
    slug: "html-to-text",
    name: "HTML to Plain Text",
    description:
      "Strip HTML tags from any HTML code and extract the plain text content. Useful for cleaning up copied web content or processing HTML emails.",
    shortDescription: "Remove HTML tags and extract plain text from any HTML code.",
    category: "text",
    icon: "📋",
    keywords: ["html to text", "strip html", "remove html tags", "plain text"],
    relatedSlugs: ["markdown-to-html", "text-cleaner", "find-replace"],
  },
  {
    slug: "text-to-slug",
    name: "URL Slug Generator",
    description:
      "Convert any text or title into a clean, SEO-friendly URL slug. Removes special characters, replaces spaces with hyphens, and lowercases everything.",
    shortDescription: "Turn any title or phrase into a clean SEO-friendly URL slug.",
    category: "text",
    icon: "🔗",
    keywords: ["url slug", "slug generator", "seo url", "permalink"],
    popular: true,
    relatedSlugs: ["text-case-converter", "keyword-density", "remove-extra-spaces"],
  },
  {
    slug: "keyword-density",
    name: "Keyword Density Checker",
    description:
      "Analyze keyword frequency and density in any text. Enter your target keyword and see how often it appears as a percentage of total words.",
    shortDescription: "Check keyword frequency and density percentage in any text.",
    category: "text",
    icon: "📊",
    keywords: ["keyword density", "keyword frequency", "seo analysis", "content analysis"],
    featured: true,
    relatedSlugs: ["word-counter", "text-statistics", "text-to-slug"],
  },
  {
    slug: "text-statistics",
    name: "Text Statistics & Readability",
    description:
      "Get detailed text statistics including Flesch reading ease score, average sentence length, syllable count, unique word count, and vocabulary richness.",
    shortDescription: "Get readability score, syllable count, and deep text statistics.",
    category: "text",
    icon: "📈",
    keywords: ["text statistics", "readability", "flesch score", "reading level"],
    relatedSlugs: ["word-counter", "keyword-density", "text-diff"],
  },
  {
    slug: "text-cleaner",
    name: "Text Cleaner",
    description:
      "Clean messy text by removing special characters, multiple spaces, tabs, line breaks, non-printable characters, and formatting issues.",
    shortDescription: "Remove special characters, extra tabs, and messy formatting from text.",
    category: "text",
    icon: "🧽",
    keywords: ["text cleaner", "clean text", "remove special characters", "format text"],
    relatedSlugs: ["remove-extra-spaces", "remove-duplicate-lines", "find-replace"],
  },
  {
    slug: "word-frequency",
    name: "Word Frequency Counter",
    description:
      "Analyze any text and get a frequency count of every word. See which words appear most often, sorted by frequency with percentage breakdowns.",
    shortDescription: "Count how often each word appears in your text with frequency rankings.",
    category: "text",
    icon: "🏆",
    keywords: ["word frequency", "word count", "word analysis", "text analysis"],
    relatedSlugs: ["keyword-density", "text-statistics", "word-counter"],
  },

  // ── IMAGE TOOLS ─────────────────────────────────────────────────────────
  {
    slug: "jpg-to-png",
    name: "JPG to PNG Converter",
    description:
      "Convert JPG/JPEG images to PNG format directly in your browser. No file uploads, no waiting — your images never leave your device.",
    shortDescription: "Convert JPG images to PNG format locally in your browser.",
    category: "image",
    icon: "🖼️",
    keywords: ["jpg to png", "jpeg to png", "image converter", "convert image"],
    popular: true,
    relatedSlugs: ["png-to-jpg", "jpg-to-webp", "image-compressor"],
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG Converter",
    description:
      "Convert PNG images to JPG/JPEG format in your browser. Control the output quality and download the converted file instantly.",
    shortDescription: "Convert PNG images to JPG with quality control, right in your browser.",
    category: "image",
    icon: "🖼️",
    keywords: ["png to jpg", "png to jpeg", "image converter", "convert image"],
    relatedSlugs: ["jpg-to-png", "png-to-webp", "image-compressor"],
  },
  {
    slug: "jpg-to-webp",
    name: "JPG to WebP Converter",
    description:
      "Convert JPG images to WebP format for smaller file sizes and faster web performance. Processed entirely in your browser with quality control.",
    shortDescription: "Convert JPG to WebP for faster web loading — no upload required.",
    category: "image",
    icon: "⚡",
    keywords: ["jpg to webp", "jpeg to webp", "webp converter", "image optimization"],
    popular: true,
    featured: true,
    relatedSlugs: ["png-to-webp", "jpg-to-png", "image-compressor"],
  },
  {
    slug: "png-to-webp",
    name: "PNG to WebP Converter",
    description:
      "Convert PNG images to WebP format in your browser. WebP files are 25-35% smaller than PNG while maintaining excellent quality.",
    shortDescription: "Convert PNG to WebP for better web performance, no upload needed.",
    category: "image",
    icon: "⚡",
    keywords: ["png to webp", "webp converter", "image optimization", "convert png"],
    relatedSlugs: ["jpg-to-webp", "png-to-jpg", "image-compressor"],
  },
  {
    slug: "webp-to-jpg",
    name: "WebP to JPG Converter",
    description:
      "Convert WebP images back to JPG format directly in your browser. No server uploads — your files stay private and secure.",
    shortDescription: "Convert WebP images to JPG format in your browser.",
    category: "image",
    icon: "🔄",
    keywords: ["webp to jpg", "webp to jpeg", "convert webp", "image converter"],
    relatedSlugs: ["webp-to-png", "jpg-to-png", "image-compressor"],
  },
  {
    slug: "webp-to-png",
    name: "WebP to PNG Converter",
    description:
      "Convert WebP images to PNG format locally in your browser. Produces lossless PNG output with transparent background support.",
    shortDescription: "Convert WebP to PNG with transparency support, no upload needed.",
    category: "image",
    icon: "🔄",
    keywords: ["webp to png", "convert webp", "image converter"],
    relatedSlugs: ["webp-to-jpg", "png-to-jpg", "image-compressor"],
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description:
      "Compress JPG and PNG images directly in your browser with a quality slider. Reduce file size without significant quality loss — files never leave your device.",
    shortDescription: "Compress images and reduce file size with a quality slider, right in the browser.",
    category: "image",
    icon: "🗜️",
    keywords: ["image compressor", "compress image", "reduce image size", "optimize image"],
    popular: true,
    featured: true,
    relatedSlugs: ["image-resizer", "jpg-to-webp", "jpg-to-png"],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description:
      "Resize any image to a specific width and height in your browser. Lock the aspect ratio to prevent distortion, or set custom dimensions freely.",
    shortDescription: "Resize images to any dimension with aspect ratio lock — no upload.",
    category: "image",
    icon: "↔️",
    keywords: ["image resizer", "resize image", "image dimensions", "scale image"],
    popular: true,
    relatedSlugs: ["image-compressor", "favicon-generator", "jpg-to-png"],
  },
  {
    slug: "image-to-base64",
    name: "Image to Base64",
    description:
      "Convert any image file to a Base64 encoded string directly in your browser. Useful for embedding images in HTML, CSS, or JSON without file references.",
    shortDescription: "Convert images to Base64 strings for embedding in code.",
    category: "image",
    icon: "🔢",
    keywords: ["image to base64", "base64 encode", "embed image", "data url"],
    relatedSlugs: ["base64-to-image", "image-compressor", "svg-to-png"],
  },
  {
    slug: "base64-to-image",
    name: "Base64 to Image",
    description:
      "Paste a Base64 encoded string and instantly preview and download the decoded image. Supports JPEG, PNG, WebP, GIF, and SVG formats.",
    shortDescription: "Decode a Base64 string back to a viewable and downloadable image.",
    category: "image",
    icon: "🖼️",
    keywords: ["base64 to image", "base64 decode", "decode image"],
    relatedSlugs: ["image-to-base64", "jpg-to-png", "svg-to-png"],
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    description:
      "Generate a favicon from any image file. Downloads a ZIP containing PNG icons in sizes 16×16, 32×32, 48×48, 64×64, 128×128, 192×192, and 512×512.",
    shortDescription: "Generate multi-size favicon PNG files from any image in your browser.",
    category: "image",
    icon: "⭐",
    keywords: ["favicon generator", "favicon creator", "website icon", "icon generator"],
    featured: true,
    relatedSlugs: ["image-resizer", "svg-to-png", "image-compressor"],
  },
  {
    slug: "svg-to-png",
    name: "SVG to PNG Converter",
    description:
      "Convert SVG vector files to PNG images in your browser. Set a custom output width and the aspect ratio is preserved automatically.",
    shortDescription: "Convert SVG vector files to PNG images at any size — no upload.",
    category: "image",
    icon: "✏️",
    keywords: ["svg to png", "convert svg", "vector to raster", "svg converter"],
    relatedSlugs: ["image-resizer", "favicon-generator", "image-to-base64"],
  },

  // ── SEO TOOLS ───────────────────────────────────────────────────────────
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    description:
      "Generate complete HTML meta tags including title, description, keywords, author, and robots directives. Preview and copy the output instantly.",
    shortDescription: "Generate complete HTML meta tags for your webpage in seconds.",
    category: "seo",
    icon: "🏷️",
    keywords: ["meta tag generator", "meta tags", "html meta", "seo tags"],
    popular: true,
    featured: true,
    relatedSlugs: ["og-tag-generator", "twitter-card-generator", "serp-preview"],
  },
  {
    slug: "og-tag-generator",
    name: "Open Graph Tag Generator",
    description:
      "Generate Open Graph meta tags for better link previews on Facebook, LinkedIn, and other social platforms. Copy the complete og: tag block instantly.",
    shortDescription: "Generate og: meta tags for better social media link previews.",
    category: "seo",
    icon: "📢",
    keywords: ["open graph", "og tags", "social meta tags", "facebook meta tags"],
    relatedSlugs: ["meta-tag-generator", "twitter-card-generator", "serp-preview"],
  },
  {
    slug: "twitter-card-generator",
    name: "Twitter Card Generator",
    description:
      "Generate Twitter Card meta tags for better link appearance on Twitter/X. Supports summary, summary_large_image, app, and player card types.",
    shortDescription: "Generate Twitter Card meta tags for better X/Twitter link previews.",
    category: "seo",
    icon: "🐦",
    keywords: ["twitter card", "twitter meta tags", "x card", "twitter og"],
    relatedSlugs: ["og-tag-generator", "meta-tag-generator", "serp-preview"],
  },
  {
    slug: "serp-preview",
    name: "Google SERP Preview",
    description:
      "Preview exactly how your page will look in Google search results. Check title length, meta description length, and URL display — all in real time.",
    shortDescription: "Preview how your page looks in Google search results before publishing.",
    category: "seo",
    icon: "🔎",
    keywords: ["serp preview", "google preview", "search result preview", "meta preview"],
    popular: true,
    featured: true,
    relatedSlugs: ["meta-tag-generator", "og-tag-generator", "url-slug-generator"],
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    description:
      "Generate a proper robots.txt file for your website. Control which pages search engine crawlers can and cannot access, with sitemap declaration support.",
    shortDescription: "Generate a properly formatted robots.txt file for your website.",
    category: "seo",
    icon: "🤖",
    keywords: ["robots.txt", "robots txt generator", "crawl directives", "noindex"],
    relatedSlugs: ["xml-sitemap-generator", "meta-tag-generator", "schema-generator"],
  },
  {
    slug: "xml-sitemap-generator",
    name: "XML Sitemap Generator",
    description:
      "Build a valid XML sitemap by entering your URLs manually. Set priority, change frequency, and last modified date for each URL. Download the complete sitemap.xml.",
    shortDescription: "Build and download a valid XML sitemap.xml from your URLs.",
    category: "seo",
    icon: "🗺️",
    keywords: ["xml sitemap", "sitemap generator", "sitemap.xml", "seo sitemap"],
    featured: true,
    relatedSlugs: ["robots-txt-generator", "url-slug-generator", "schema-generator"],
  },
  {
    slug: "schema-generator",
    name: "Schema Markup Generator",
    description:
      "Generate JSON-LD structured data markup for Article, FAQ, Organization, Local Business, Breadcrumb, and WebSite schemas. Ready to paste into your page.",
    shortDescription: "Generate JSON-LD schema markup for articles, FAQs, businesses, and more.",
    category: "seo",
    icon: "🧩",
    keywords: ["schema markup", "json-ld", "structured data", "schema generator", "rich snippets"],
    popular: true,
    featured: true,
    relatedSlugs: ["meta-tag-generator", "robots-txt-generator", "xml-sitemap-generator"],
  },
  {
    slug: "utm-builder",
    name: "UTM URL Builder",
    description:
      "Build UTM-tagged URLs for campaign tracking in Google Analytics. Add source, medium, campaign, term, and content parameters with instant URL preview.",
    shortDescription: "Build UTM-tagged URLs for Google Analytics campaign tracking.",
    category: "seo",
    icon: "📡",
    keywords: ["utm builder", "utm parameters", "campaign tracking", "google analytics"],
    relatedSlugs: ["url-slug-generator", "serp-preview", "meta-tag-generator"],
  },
  {
    slug: "hreflang-generator",
    name: "Hreflang Tag Generator",
    description:
      "Generate hreflang link tags for multilingual websites. Specify language and region pairs with their URLs to produce the correct HTML link elements.",
    shortDescription: "Generate hreflang tags for multilingual and multi-regional websites.",
    category: "seo",
    icon: "🌍",
    keywords: ["hreflang", "hreflang generator", "multilingual seo", "international seo"],
    relatedSlugs: ["robots-txt-generator", "xml-sitemap-generator", "url-slug-generator"],
  },
  {
    slug: "url-slug-generator",
    name: "SEO URL Slug Generator",
    description:
      "Convert any page title or phrase into a clean, SEO-friendly URL slug. Automatically lowercases, removes special characters, and replaces spaces with hyphens.",
    shortDescription: "Generate clean, SEO-friendly URL slugs from any title or phrase.",
    category: "seo",
    icon: "🔗",
    keywords: ["url slug", "seo url", "permalink generator", "url generator"],
    relatedSlugs: ["serp-preview", "meta-tag-generator", "utm-builder"],
  },
];

export const upcomingTools: UpcomingTool[] = [
  {
    name: "Domain Authority Checker",
    description: "Check the Domain Authority (DA) score of any website to gauge its SEO strength and ranking potential.",
    whyUseful: "Domain Authority is a key metric for evaluating link-building targets and competitor strength. Requires Moz API access.",
    category: "seo",
    icon: "🏅",
  },
  {
    name: "Page Authority Checker",
    description: "Analyze the Page Authority (PA) score of individual URLs to understand their ranking potential.",
    whyUseful: "Essential for evaluating specific page strength in link-building campaigns. Requires Moz API access.",
    category: "seo",
    icon: "📑",
  },
  {
    name: "Backlink Checker",
    description: "View backlinks pointing to any domain or URL, including anchor text, source, and link type.",
    whyUseful: "Backlink analysis is critical for off-page SEO strategy and competitive research. Requires Ahrefs or Semrush API.",
    category: "seo",
    icon: "🔗",
  },
  {
    name: "Domain Age Checker",
    description: "Find out exactly how old any domain is, including registration date and expiry information.",
    whyUseful: "Domain age is a trust signal for SEO and is useful for evaluating expired domains. Requires WHOIS API access.",
    category: "seo",
    icon: "📅",
  },
  {
    name: "Keyword Search Volume Checker",
    description: "See the monthly search volume for any keyword to prioritize your content strategy.",
    whyUseful: "Search volume is the most fundamental keyword metric. Requires Google Keyword Planner or SEO data API.",
    category: "seo",
    icon: "📊",
  },
  {
    name: "Keyword Difficulty Checker",
    description: "Estimate how hard it would be to rank for a specific keyword based on current top-ranking pages.",
    whyUseful: "Helps identify low-competition keyword opportunities. Requires live SERP analysis and SEO data APIs.",
    category: "seo",
    icon: "🎯",
  },
  {
    name: "SERP Rank Tracker",
    description: "Track where your website ranks for specific keywords in Google search results over time.",
    whyUseful: "Ongoing rank tracking is essential for measuring SEO progress. Requires live Google SERP access.",
    category: "seo",
    icon: "📈",
  },
  {
    name: "Website Traffic Checker",
    description: "Estimate the monthly organic and paid traffic for any website.",
    whyUseful: "Traffic data helps benchmark against competitors and identify opportunities. Requires SimilarWeb or Semrush API.",
    category: "seo",
    icon: "🌐",
  },
  {
    name: "AI Humanizer",
    description: "Rewrite AI-generated content to sound more natural, conversational, and human-written.",
    whyUseful: "AI detectors are increasingly used by editors and publishers. Effective humanization requires a fine-tuned LLM.",
    category: "ai",
    icon: "🧑‍💻",
  },
  {
    name: "AI Content Detector",
    description: "Analyze any text and estimate the probability that it was written by an AI model.",
    whyUseful: "Publishers, educators, and editors use AI detection to verify content authenticity. Requires ML model API.",
    category: "ai",
    icon: "🤖",
  },
  {
    name: "AI Content Rewriter",
    description: "Rewrite any paragraph or article while preserving the core meaning, with adjustable tone and style.",
    whyUseful: "Content rewriting at scale requires a high-quality LLM to maintain coherence and accuracy.",
    category: "ai",
    icon: "✍️",
  },
  {
    name: "AI Text Summarizer",
    description: "Summarize long articles, research papers, and documents into concise bullet points or paragraphs.",
    whyUseful: "Effective summarization requires an LLM that understands context and can extract key information accurately.",
    category: "ai",
    icon: "📝",
  },
  {
    name: "AI Grammar Corrector",
    description: "Detect and fix grammar, spelling, punctuation, and style issues in any text using AI.",
    whyUseful: "High-quality grammar correction beyond basic rules requires an LLM with deep language understanding.",
    category: "ai",
    icon: "✅",
  },
  {
    name: "Competitor SEO Analysis",
    description: "Analyze a competitor's top-ranking pages, keywords, and backlink profile in one report.",
    whyUseful: "Comprehensive competitor analysis requires access to multiple live SEO data sources and APIs.",
    category: "seo",
    icon: "🔭",
  },
];

export const toolsByCategory = {
  text: tools.filter((t) => t.category === "text"),
  image: tools.filter((t) => t.category === "image"),
  seo: tools.filter((t) => t.category === "seo"),
};

export const popularTools = tools.filter((t) => t.popular);
export const featuredTools = tools.filter((t) => t.featured);

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getRelatedTools(tool: Tool): Tool[] {
  if (!tool.relatedSlugs) return [];
  return tool.relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is Tool => t !== undefined);
}

export const categoryMeta = {
  text: {
    name: "Text Tools",
    description:
      "Word counters, case converters, text diff, markdown preview, keyword density, and more — all run in your browser.",
    icon: "📝",
    color: "blue",
  },
  image: {
    name: "Image Tools",
    description:
      "Convert, compress, and resize images in any format directly in your browser. Files never leave your device.",
    icon: "🖼️",
    color: "green",
  },
  seo: {
    name: "SEO Tools",
    description:
      "Meta tag generators, SERP previews, robots.txt builders, schema generators, and more for on-page SEO.",
    icon: "🔍",
    color: "purple",
  },
};
