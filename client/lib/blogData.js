export const BLOG_POSTS = [
  {
    slug: "what-is-domain-authority",
    title: "What Is Domain Authority? Complete Guide & Score Meaning",
    metaDescription:
      "Learn what Domain Authority (DA) actually measures, how it is calculated, its key limitations, and how to improve your website's ranking potential responsibly.",
    category: "SEO Foundations",
    readingTime: "6 min read",
    publishedDate: "2026-08-15",
    author: "Kraviona SEO Research Team",
    summary:
      "Domain Authority is one of the most widely referenced SEO metrics, but it is also one of the most misunderstood. Here is what DA actually measures, why Google doesn't use it, and how to use it constructively.",
    directAnswer:
      "Domain Authority (DA) is a search engine ranking score developed by Moz that predicts how likely a website is to rank in search engine result pages (SERPs). Scores range from 1 to 100, with higher scores corresponding to a greater likelihood of ranking. However, DA is not a Google ranking factor and has no direct influence over Google's search algorithm.",
    sections: [
      {
        heading: "How Domain Authority is Calculated",
        content: `Domain Authority is calculated using a machine learning algorithm that evaluates dozens of backlink and domain signals from a link index. 

Key factors influencing a DA score include:
- **Total Number of Root Linking Domains**: How many unique external websites link to your domain.
- **Authority and Trust of Inbound Links**: Links from university (.edu), government (.gov), and established news organizations carry substantially more weight than links from new or low-trust blogs.
- **Link Diversity**: Having 100 links from 100 different distinct root domains is far more valuable than 1,000 links originating from a single domain.
- **Spam Signals**: Moz tracks spam score signals such as thin content, excessive outbound links, and repetitive anchor text.

The DA scale is **logarithmic**, not linear. Moving your DA from 20 to 30 is significantly easier than moving from 70 to 80. Each point higher requires exponentially more high-authority inbound links.`,
      },
      {
        heading: "What Domain Authority Does NOT Measure",
        content: `Many site owners make strategic mistakes because they treat DA as an absolute quality audit. Keep these essential realities in mind:

1. **Google Does Not Use DA**: Google representatives have repeatedly verified that Google does not calculate or reference Moz DA, Ahrefs DR, or Semrush AS. Google uses its own PageRank algorithms and internal quality signals.
2. **DA Does Not Measure Content Quality**: A site can publish outdated or mediocre content and still have a high DA if it acquired strong institutional backlinks years ago.
3. **DA Does Not Measure Search Traffic**: A site with a DA of 35 can easily generate more organic traffic and revenue than a site with a DA of 65 if the lower-DA site targets high-intent commercial keywords effectively.
4. **Fluctuations Are Relative**: If Moz updates its web index or other websites gain millions of new links, your site's score may shift slightly without any changes having occurred to your own backlink profile.`,
      },
      {
        heading: "Common Mistakes When Analyzing DA",
        content: `Avoid these common pitfalls when tracking domain metrics:
- **Comparing Across Different Providers**: Moz Domain Authority (DA), Ahrefs Domain Rating (DR), and Semrush Authority Score (AS) use different crawlers, index sizes, and mathematical models. Never compare a Moz DA score against an Ahrefs DR score.
- **Buying Spammy Backlinks**: Purchasing bulk links from automated link farms to artificially manipulate third-party scores will likely result in a manual action or algorithmic penalty from Google.
- **Obsessing Over Metric Fluctuations**: Focus your energy on producing authoritative content, earning genuine industry citations, and fixing technical crawl errors rather than stressing over a 1-point change in DA.`,
      },
      {
        heading: "Step-by-Step: How to Improve Your Real Authority",
        content: `To build genuine organic authority that Google rewards:
1. **Create Linkable Assets**: Publish original research, free interactive calculators, open datasets, and definitive guides that bloggers and journalists naturally cite.
2. **Execute Digital PR and Outreach**: Pitch insightful commentary to industry journalists and participate in relevant industry podcasts.
3. **Audit and Reclaim Lost Links**: Identify broken 404 pages on your site that have incoming backlinks and set up 301 redirects to recover link equity.
4. **Strengthen Internal Linking**: Pass authority from your strongest external-link-earning pages down to your commercial product and tool pages.`,
      },
    ],
    faqs: [
      {
        question: "What is considered a 'good' Domain Authority score?",
        answer:
          "There is no universal 'good' DA score because DA is a relative metric. A good score is simply one that is equal to or higher than your direct organic search competitors in your specific niche.",
      },
      {
        question: "Does Google look at Moz Domain Authority?",
        answer:
          "No. Google does not look at Moz Domain Authority. Google uses PageRank and internal machine learning algorithms to evaluate link equity.",
      },
      {
        question: "How often does Domain Authority update?",
        answer:
          "Moz updates its link index and recalculates Domain Authority scores periodically, typically once every few weeks.",
      },
    ],
    relatedTool: {
      name: "DA / PA Checker & Domain Age Lookup",
      path: "/seo-tools/domain-authority-checker",
      description:
        "Check domain age, registration details, and see transparent status for licensed Moz authority metrics.",
      cta: "Test Your Domain Now",
    },
    relatedPostSlugs: ["da-vs-pa", "how-to-check-domain-age", "image-optimization-for-seo"],
  },
  {
    slug: "da-vs-pa",
    title: "Domain Authority vs Page Authority: Key Differences & How to Use Them",
    metaDescription:
      "Understand the difference between Domain Authority (DA) and Page Authority (PA). Learn when to analyze whole-domain strength versus individual URL ranking power.",
    category: "SEO Foundations",
    readingTime: "5 min read",
    publishedDate: "2026-08-20",
    author: "Kraviona SEO Research Team",
    summary:
      "While Domain Authority and Page Authority sound similar, they measure two completely different levels of ranking power. Learn how to use both metrics together to pinpoint your SEO strengths.",
    directAnswer:
      "The primary difference between Domain Authority (DA) and Page Authority (PA) is scope: Domain Authority predicts the comparative ranking strength of an entire root domain or subdomain, whereas Page Authority predicts the ranking power of a specific, individual URL.",
    sections: [
      {
        heading: "Quick Comparison: DA vs PA",
        content: `| Feature | Domain Authority (DA) | Page Authority (PA) |
| :--- | :--- | :--- |
| **Scope** | Entire domain or subdomain | Specific single webpage URL |
| **Primary Driver** | Total root linking domains & site-wide link profile | Direct backlinks pointing specifically to that URL + internal link flow |
| **Scale** | 1 to 100 logarithmic scale | 1 to 100 logarithmic scale |
| **Best Used For** | Evaluating competitor overall strength & guest post targets | Identifying which specific page will outrank another in search results |
| **Google Influence** | Indirect (Google uses PageRank, not DA) | Indirect (Google evaluates individual URLs via PageRank) |`,
      },
      {
        heading: "When to Prioritize Page Authority Over Domain Authority",
        content: `Search engines do not rank websites; they rank **individual web pages**.

A website with a modest Domain Authority of 30 can easily outrank a massive publication with a DA of 85 if:
- The specific page on the smaller site has direct, topical backlinks (high Page Authority).
- The content directly answers the searcher's query with higher depth and satisfaction.
- The user experience, loading speed, and mobile responsiveness are superior.

When doing keyword competitive research, look at the **PA** of the URLs currently ranking in top 5 positions on Google. If the ranking URLs have low PA despite sitting on high-DA domains, that keyword presents a viable ranking opportunity for a focused, comprehensive guide.`,
      },
      {
        heading: "How to Build Page Authority (PA) on High-Value URLs",
        content: `To boost the Page Authority of your most important commercial pages:
1. **Direct Inbound Backlinks**: Target outreach campaigns specifically to that URL rather than your generic homepage.
2. **Contextual Internal Linking**: Place contextual internal links from your top-performing blog posts with descriptive, relevant anchor text.
3. **Keep URL Structure Stable**: Avoid changing page URLs unnecessarily. If you must rename a URL, ensure an immediate, permanent 301 redirect is configured.`,
      },
    ],
    faqs: [
      {
        question: "Can a page have a higher PA than its website's DA?",
        answer:
          "Yes. Highly linked individual pages (such as an iconic research paper or viral free tool) can have a Page Authority that exceeds the website's overall Domain Authority.",
      },
      {
        question: "Does PA reset if I update the content on the page?",
        answer:
          "No. Updating content does not reset Page Authority as long as the URL remains identical. Refreshing content often helps attract new backlinks, increasing PA over time.",
      },
    ],
    relatedTool: {
      name: "DA / PA Checker Tool",
      path: "/seo-tools/domain-authority-checker",
      description: "Analyze domain creation dates and inspect authoritative metric availability.",
      cta: "Run Domain & URL Audit",
    },
    relatedPostSlugs: ["what-is-domain-authority", "how-to-check-domain-age"],
  },
  {
    slug: "how-to-check-domain-age",
    title: "How to Check Domain Age and Why It Matters for SEO",
    metaDescription:
      "Learn how to check domain age using authoritative RDAP and WHOIS registries. Discover whether domain age directly impacts Google rankings or if backlink history is what counts.",
    category: "SEO Foundations",
    readingTime: "5 min read",
    publishedDate: "2026-08-25",
    author: "Kraviona Technical Team",
    summary:
      "Domain age is frequently cited as a core ranking signal, but does the registration date itself matter to search engines? Discover how to look up authentic domain creation dates and what Google really values.",
    directAnswer:
      "Domain age refers to the duration of time since a domain name was first registered with an ICANN-accredited registrar. You can check domain age authoritatively using RDAP (Registration Data Access Protocol) or WHOIS records. While Google does not use calendar domain age as a direct ranking factor, older domains tend to rank better because they have had more time to accumulate backlinks, historical trust, and organic search equity.",
    sections: [
      {
        heading: "RDAP vs WHOIS: How Modern Domain Lookup Works",
        content: `Historically, domain registration lookups relied on the legacy **WHOIS** protocol over port 43. WHOIS had significant drawbacks: lack of standard formatting, inconsistent error codes, and poor internationalization support.

Today, the Internet Corporation for Assigned Names and Numbers (ICANN) mandates **RDAP (Registration Data Access Protocol)**:
- **Standardized JSON REST API**: Returns structured data directly from authoritative domain registries (such as Verisign for .com).
- **Accurate Event History**: Provides explicit ISO-8601 timestamps for \`registration\`, \`expiration\`, and \`last changed\`.
- **Security & Privacy Compliance**: Integrates GDPR and privacy-proxy safeguards while preserving authentic registration timestamps.`,
      },
      {
        heading: "Does Domain Age Directly Affect Google SEO?",
        content: `Google representatives (including John Mueller) have repeatedly stated that domain age by itself is **not a ranking factor**. Registering a domain 10 years ago and parking it with zero content gives you no organic ranking advantage over a 6-month-old domain.

However, domain age correlates strongly with SEO success due to **indirect factors**:
- **Link Equity Accumulation**: An active 10-year-old domain has had years to earn editorial citations, press mentions, and educational backlinks.
- **Crawl Budget and History**: Older sites that consistently publish good content have established crawl priority with Googlebot.
- **Brand Signals**: Mature websites often enjoy branded search queries, direct traffic, and social validation that new sites take time to build.`,
      },
      {
        heading: "Continuous Age vs Lapsed Domains: The Ownership Trap",
        content: `A critical mistake made by domain investors is assuming that buying an expired domain transfers all historical authority.

If a domain lapses and expires:
1. Google may reset historical link equity if the site topic changes drastically (e.g., an old gardening blog turned into a crypto casino).
2. The RDAP registration date may update to the new purchase date if the domain was dropped and re-registered.
3. Historical penalties or manual spam actions associated with the domain may linger in search console records.

Always verify backlink history in archive tools before purchasing aged domains for SEO purposes.`,
      },
    ],
    faqs: [
      {
        question: "How do I check the exact creation date of my domain?",
        answer:
          "You can check your domain's creation date for free using Kraviona's DA / PA Checker, which queries authoritative registry RDAP endpoints in real time.",
      },
      {
        question: "Does renewing a domain for 10 years improve Google rankings?",
        answer:
          "No. Google does not grant higher search rankings simply because a domain registration was prepaid for multiple years in advance.",
      },
    ],
    relatedTool: {
      name: "Instant Domain Age & Registration Checker",
      path: "/seo-tools/domain-authority-checker",
      description: "Perform a live RDAP registry lookup to view registration date, registrar, and domain age.",
      cta: "Check Domain Age Free",
    },
    relatedPostSlugs: ["what-is-domain-authority", "da-vs-pa"],
  },
  {
    slug: "webp-vs-jpg",
    title: "WebP vs JPG: Which Image Format Is Best for Your Website?",
    metaDescription:
      "Compare WebP and JPG side-by-side. Understand file size differences, visual quality, transparency support, and browser compatibility to speed up your website.",
    category: "Image Optimization",
    readingTime: "6 min read",
    publishedDate: "2026-08-28",
    author: "Kraviona Performance Team",
    summary:
      "Images make up over 50% of the total page weight of an average website. Choosing between WebP and JPG is one of the quickest ways to improve Core Web Vitals and search rankings.",
    directAnswer:
      "For modern websites, WebP is almost always superior to JPG. WebP produces images that are 25% to 35% smaller than comparable JPG files at equivalent visual quality, while also supporting alpha channel transparency and lossless compression. All modern web browsers currently support WebP natively.",
    sections: [
      {
        heading: "Head-to-Head Comparison: WebP vs JPG",
        content: `| Specification | WebP | JPG / JPEG |
| :--- | :--- | :--- |
| **Compression Types** | Both Lossy and Lossless | Lossy only |
| **File Size Efficiency** | ~25%–35% smaller than JPG | Baseline standard |
| **Alpha Transparency** | Yes (supported in lossy & lossless) | No (transparent pixels turn solid white or black) |
| **Animation Support** | Yes (Animated WebP) | No |
| **Browser Compatibility** | >97% global support (Chrome, Safari, Firefox, Edge) | 100% universal support |
| **Ideal Use Case** | Web hero banners, blog photography, e-commerce | Print, legacy software, camera RAW exports |`,
      },
      {
        heading: "Why WebP Compresses Better Than JPG",
        content: `WebP was developed by Google based on the VP8 video codec predictive coding engine.

When compressing an image:
- **Intra-frame Prediction**: WebP predicts the color of pixels based on adjacent blocks, encoding only the difference between predicted and actual values. This requires drastically fewer bytes than JPG's Discrete Cosine Transform (DCT) block algorithm.
- **Adaptive Block Quantization**: WebP divides images into variable-sized macroblocks (16x16 pixels) rather than the rigid 8x8 blocks used in standard JPEG, preventing visible compression artifacts and banding in smooth color gradients.`,
      },
      {
        heading: "When Should You Still Use JPG?",
        content: `While WebP is ideal for web delivery, standard JPG remains valuable in specific scenarios:
1. **Print Production**: Professional printers, PDF workflows, and CMYK color processes rely on standard JPEG/TIFF standards.
2. **Legacy Software & Email Clients**: Some older desktop email clients or legacy content management systems do not support WebP uploads.
3. **Camera & Device Storage**: Digital cameras and smartphones capture photo sensors directly in JPG or HEIC format before web conversion.`,
      },
      {
        heading: "How to Convert JPG to WebP Without Losing Quality",
        content: `Converting your website's JPG images to WebP takes seconds:
1. Open Kraviona's **JPG to WebP Converter**.
2. Drag and drop your JPG photo.
3. Select a quality setting between 80% and 85% (this provides the sweet spot where file size drops by ~60% with zero visible degradation).
4. Download your new WebP image and update your website.`,
      },
    ],
    faqs: [
      {
        question: "Do all modern browsers support WebP?",
        answer:
          "Yes. Google Chrome, Apple Safari (iOS and macOS), Mozilla Firefox, and Microsoft Edge all provide full native WebP support.",
      },
      {
        question: "Does converting JPG to WebP help my Google SEO?",
        answer:
          "Yes. Converting heavy JPG files to WebP reduces page payload, which improves Largest Contentful Paint (LCP) and overall Core Web Vitals scores.",
      },
    ],
    relatedTool: {
      name: "JPG to WebP Converter",
      path: "/tools/jpg-to-webp",
      description: "Convert your JPG photos to modern WebP format privately in your browser with quality tuning.",
      cta: "Convert JPG to WebP Now",
    },
    relatedPostSlugs: ["how-to-convert-png-to-webp", "image-optimization-for-seo"],
  },
  {
    slug: "how-to-convert-png-to-webp",
    title: "How to Convert PNG to WebP Without Losing Transparency",
    metaDescription:
      "Step-by-step guide on converting PNG graphics, logos, and screenshots into lightweight WebP files while preserving full alpha transparency and crisp lines.",
    category: "Image Optimization",
    readingTime: "5 min read",
    publishedDate: "2026-09-01",
    author: "Kraviona Performance Team",
    summary:
      "PNG files provide perfect lossless quality and transparency, but their massive file sizes can destroy website load speeds. Here is how to convert them to WebP with zero quality compromise.",
    directAnswer:
      "To convert a PNG to WebP without losing transparency, use a browser converter that supports WebP alpha channel encoding. WebP supports both lossless and lossy transparency, producing files that are typically 50% to 80% smaller than original PNG files while keeping your transparent background completely intact.",
    sections: [
      {
        heading: "Why PNG Files Are So Heavy",
        content: `PNG was invented in 1996 as an open-source replacement for GIF. It uses DEFLATE compression (similar to ZIP files).

While PNG is exceptional for crisp icons and screenshots:
- It stores lossless pixel-by-pixel color data without discarding imperceptible details.
- High-resolution PNGs often reach 2 MB to 8 MB in size, severely degrading mobile page load times.
- Serving raw PNGs on web pages often leads to failed **Core Web Vitals** audits for Largest Contentful Paint (LCP).`,
      },
      {
        heading: "Lossless vs Lossy WebP for PNG Conversions",
        content: `When converting PNG to WebP, you have two strategic options:

1. **Lossless WebP**:
   - Compresses pixel data with 100% mathematical perfection.
   - Typically **26% smaller** than PNG.
   - Best for vector icons, logos, line art, and screenshots containing fine typography.

2. **Lossy WebP with Alpha Transparency**:
   - Compresses RGB color channels using predictive lossy algorithms while preserving a dedicated lossless 8-bit alpha channel for transparency.
   - Typically **60% to 80% smaller** than PNG.
   - Best for transparent product photography, eCommerce cutouts, and rich UI graphics.`,
      },
      {
        heading: "Step-by-Step Conversion Workflow",
        content: `1. Navigate to **Kraviona's PNG to WebP Converter**.
2. Drag your PNG logo or graphic into the dropzone.
3. Choose your quality setting (85% is ideal for photos; 95%–100% for crisp UI logos).
4. Verify your converted preview and observe the file size reduction badge.
5. Download your lightweight WebP file and deploy it to your CDN or CMS.`,
      },
    ],
    faqs: [
      {
        question: "Will WebP preserve transparent backgrounds from my PNG?",
        answer:
          "Yes. WebP includes built-in support for 8-bit alpha channel transparency, ensuring that drop shadows, cutouts, and transparent logos look identical to original PNGs.",
      },
      {
        question: "Can I convert WebP back to PNG if needed?",
        answer:
          "Yes. You can use Kraviona's WebP to PNG or Image Converter tool anytime to export back to PNG format.",
      },
    ],
    relatedTool: {
      name: "PNG to WebP Converter",
      path: "/tools/png-to-webp",
      description: "Convert PNG images to WebP with complete alpha transparency preservation and custom resizing.",
      cta: "Convert PNG to WebP Free",
    },
    relatedPostSlugs: ["webp-vs-jpg", "image-optimization-for-seo"],
  },
  {
    slug: "image-optimization-for-seo",
    title: "Image Optimization for SEO: The Definitive Guide for Fast Rankings",
    metaDescription:
      "Master technical image SEO: discover modern formats, responsive sizes, descriptive alt text, lazy loading, and schema markup to pass Core Web Vitals.",
    category: "Image Optimization",
    readingTime: "7 min read",
    publishedDate: "2026-09-03",
    author: "Kraviona Technical Team",
    summary:
      "Optimizing images is one of the highest-impact technical SEO wins available. Learn how to compress files, write effective alt attributes, and structure your visual content for Google Image search.",
    directAnswer:
      "Image optimization for SEO is the practice of delivering high-quality visual content in the lowest possible file size, with proper technical markup, descriptive file names, and relevant alt text. This improves page speed, satisfies Google's Core Web Vitals requirements, and drives organic traffic through Google Images.",
    sections: [
      {
        heading: "1. Choose Modern Next-Gen Formats",
        content: `Replace legacy uncompressed JPGs and heavy PNGs with modern formats:
- Use **WebP** for all general photography, banners, and transparent cutouts.
- Use **AVIF** for ultra-high-efficiency compression where browser support permits.
- Reserve **SVG** for vector icons, logos, and UI graphics that require infinite scaling without file size penalties.`,
      },
      {
        heading: "2. Size Images to Match Display Dimensions",
        content: `Never serve an original 4000x3000 camera export if the image is displayed in a 800px wide blog container. Serving oversized dimensions forces the mobile browser to download megabytes of unnecessary data and downsample it on the CPU.

Use the HTML5 \`<picture>\` element or \`srcset\` attribute with width descriptors:
\`\`\`html
<picture>
  <source srcset="hero-800.webp 800w, hero-1200.webp 1200w" type="image/webp">
  <img src="hero-800.jpg" alt="Comprehensive image SEO guide" width="800" height="450" loading="lazy">
</picture>
\`\`\`
Always declare explicit \`width\` and \`height\` attributes on the \`<img>\` tag to prevent Cumulative Layout Shift (CLS).`,
      },
      {
        heading: "3. Write Contextual, Helpful Alt Text",
        content: `Alt text serves two critical purposes: web accessibility for visually impaired users with screen readers, and image comprehension for search engine crawlers.

Best practices for alt text:
- **Be Descriptive and Specific**: Instead of \`alt="dog"\`, write \`alt="Golden retriever catching a tennis ball in the park"\`.
- **Avoid Keyword Stuffing**: Never write \`alt="best seo tools free image converter check domain authority"\`.
- **Skip Redundant Phrases**: Do not start with "Image of..." or "Picture of...". Screen readers announce image elements automatically.`,
      },
      {
        heading: "4. Implement Strategic Lazy Loading",
        content: `Add \`loading="lazy"\` to all images positioned below the initial viewport fold. This defers downloading the image until the visitor scrolls near it, drastically cutting initial page weight.

**Warning for Hero Images**: Never add lazy loading to your above-the-fold hero image! Doing so delays Largest Contentful Paint (LCP) and harms your Core Web Vitals score. Use \`fetchpriority="high"\` on your main hero visual instead.`,
      },
    ],
    faqs: [
      {
        question: "What is the recommended file size for web images?",
        answer:
          "Aim to keep blog images below 100 KB whenever possible, and full-width desktop hero banners below 250 KB using WebP compression.",
      },
      {
        question: "Does Google index WebP images in Google Image Search?",
        answer:
          "Yes. Google fully crawls, indexes, and displays WebP images in Google Image search results.",
      },
    ],
    relatedTool: {
      name: "Universal Image Optimizer & Converter",
      path: "/tools/image-converter",
      description: "Resize, compress, and convert your images to WebP, JPG, or PNG privately in your browser.",
      cta: "Optimize Images Now",
    },
    relatedPostSlugs: ["webp-vs-jpg", "how-to-convert-png-to-webp", "what-is-domain-authority"],
  },
];

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug) || null;
}

export function getAllCategories() {
  const cats = new Set(BLOG_POSTS.map((p) => p.category));
  return Array.from(cats);
}

export function getRelatedPosts(slug) {
  const current = getPostBySlug(slug);
  if (!current) return [];
  return BLOG_POSTS.filter((p) => p.slug !== slug && current.relatedPostSlugs?.includes(p.slug));
}
