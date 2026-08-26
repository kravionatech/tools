export const MenuList = [
  // =========================================================
  // ALL TOOLS
  // =========================================================

  {
    name: "All Tools",
    href: "/tools",
    type: "link",
  },

  // =========================================================
  // SEO TOOLS
  // =========================================================

  {
   name: "SEO Tools",
  type: "mega-menu",
  description: "Complete SEO toolkit for websites and marketers",
    categories: [

      // -----------------------------------------------------
      // SEO AUDIT
      // -----------------------------------------------------

      {
        name: "SEO Audit",
        slug: "seo-audit",
        description: "Find and fix SEO issues",

        tools: [
          {
            name: "SEO Audit",
            description: "Complete technical and on-page SEO audit",
            href: "/seo-audit",
            badge: "Popular",
          },
          {
            name: "Website SEO Checker",
            description: "Check your website's overall SEO health",
            href: "/website-seo-checker",
          },
          {
            name: "Technical SEO Audit",
            description: "Analyze technical SEO problems",
            href: "/technical-seo-audit",
          },
          {
            name: "On-Page SEO Checker",
            description: "Analyze page-level SEO factors",
            href: "/on-page-seo-checker",
          },
          {
            name: "SEO Score Checker",
            description: "Check your page SEO score",
            href: "/seo-score-checker",
          },
          {
            name: "SEO Issues Checker",
            description: "Find common SEO issues",
            href: "/seo-issues-checker",
          },
          {
            name: "Mobile SEO Checker",
            description: "Check mobile SEO readiness",
            href: "/mobile-seo-checker",
          },
          {
            name: "Core Web Vitals Checker",
            description: "Analyze Core Web Vitals",
            href: "/core-web-vitals-checker",
          },
        ],
      },


      // -----------------------------------------------------
      // KEYWORD TOOLS
      // -----------------------------------------------------

      {
        name: "Keyword Research",
        slug: "keyword-research",
        description: "Discover and analyze search keywords",

        tools: [
          {
            name: "Keyword Research Tool",
            description: "Find keyword ideas and opportunities",
            href: "/keyword-research",
            badge: "Popular",
          },
          {
            name: "Keyword Difficulty Checker",
            description: "Estimate keyword ranking difficulty",
            href: "/keyword-difficulty",
          },
          {
            name: "Keyword Density Checker",
            description: "Analyze keyword usage on a page",
            href: "/keyword-density",
          },
          {
            name: "Keyword Position Checker",
            description: "Check keyword search rankings",
            href: "/keyword-position",
          },
          {
            name: "Keyword Grouping Tool",
            description: "Cluster keywords by search intent",
            href: "/keyword-grouping",
          },
          {
            name: "Keyword Clustering Tool",
            description: "Create SEO keyword clusters",
            href: "/keyword-clustering",
          },
          {
            name: "Long Tail Keyword Finder",
            description: "Discover long-tail keyword opportunities",
            href: "/long-tail-keywords",
          },
          {
            name: "Related Keywords Finder",
            description: "Find semantically related keywords",
            href: "/related-keywords",
          },
          {
            name: "LSI Keyword Finder",
            description: "Discover contextual keyword ideas",
            href: "/lsi-keywords",
          },
          {
            name: "Search Intent Checker",
            description: "Identify keyword search intent",
            href: "/search-intent",
          },
          {
            name: "Keyword Cannibalization Checker",
            description: "Find pages competing for the same keyword",
            href: "/keyword-cannibalization",
          },
        ],
      },


      // -----------------------------------------------------
      // ON-PAGE SEO
      // -----------------------------------------------------

      {
        name: "On-Page SEO",
        slug: "on-page-seo",
        description: "Optimize pages for search engines",

        tools: [
          {
            name: "Meta Title Checker",
            description: "Check title length and optimization",
            href: "/meta-title-checker",
          },
          {
            name: "Meta Description Checker",
            description: "Analyze meta description optimization",
            href: "/meta-description-checker",
          },
          {
            name: "Meta Tag Generator",
            description: "Generate optimized meta tags",
            href: "/meta-tag-generator",
          },
          {
            name: "Heading Checker",
            description: "Analyze H1-H6 heading structure",
            href: "/heading-checker",
          },
          {
            name: "H1 Tag Checker",
            description: "Check and analyze H1 tags",
            href: "/h1-checker",
          },
          {
            name: "Canonical URL Checker",
            description: "Check canonical implementation",
            href: "/canonical-checker",
          },
          {
            name: "Open Graph Checker",
            description: "Check Open Graph metadata",
            href: "/open-graph-checker",
          },
          {
            name: "Twitter Card Checker",
            description: "Check Twitter/X card metadata",
            href: "/twitter-card-checker",
          },
          {
            name: "Image Alt Text Checker",
            description: "Find missing image alt attributes",
            href: "/image-alt-checker",
          },
          {
            name: "SEO Content Analyzer",
            description: "Analyze content optimization",
            href: "/seo-content-analyzer",
          },
          {
            name: "Readability Checker",
            description: "Analyze content readability",
            href: "/readability-checker",
          },
        ],
      },


      // -----------------------------------------------------
      // TECHNICAL SEO
      // -----------------------------------------------------

      {
        name: "Technical SEO",
        slug: "technical-seo",
        description: "Analyze crawling, indexing and website architecture",

        tools: [
          {
            name: "Robots.txt Checker",
            description: "Validate robots.txt configuration",
            href: "/robots-txt-checker",
          },
          {
            name: "Robots.txt Generator",
            description: "Generate a robots.txt file",
            href: "/robots-txt-generator",
          },
          {
            name: "XML Sitemap Checker",
            description: "Validate XML sitemaps",
            href: "/xml-sitemap-checker",
          },
          {
            name: "XML Sitemap Generator",
            description: "Generate XML sitemaps",
            href: "/xml-sitemap-generator",
          },
          {
            name: "Sitemap URL Extractor",
            description: "Extract URLs from XML sitemap",
            href: "/sitemap-url-extractor",
          },
          {
            name: "HTTP Status Code Checker",
            description: "Check URL HTTP response codes",
            href: "/http-status-checker",
          },
          {
            name: "Redirect Checker",
            description: "Analyze redirect chains",
            href: "/redirect-checker",
          },
          {
            name: "Redirect Chain Checker",
            description: "Find redirect chains and loops",
            href: "/redirect-chain-checker",
          },
          {
            name: "HTTPS Checker",
            description: "Check HTTPS implementation",
            href: "/https-checker",
          },
          {
            name: "Indexability Checker",
            description: "Check whether pages can be indexed",
            href: "/indexability-checker",
          },
          {
            name: "Crawlability Checker",
            description: "Analyze crawler accessibility",
            href: "/crawlability-checker",
          },
          {
            name: "Orphan Page Finder",
            description: "Find pages without internal links",
            href: "/orphan-page-finder",
          },
          {
            name: "Broken Link Checker",
            description: "Find broken internal and external links",
            href: "/broken-link-checker",
          },
          {
            name: "Internal Link Checker",
            description: "Analyze internal linking structure",
            href: "/internal-link-checker",
          },
          {
            name: "URL Structure Checker",
            description: "Analyze SEO-friendly URL structure",
            href: "/url-structure-checker",
          },
        ],
      },


      // -----------------------------------------------------
      // SCHEMA / STRUCTURED DATA
      // -----------------------------------------------------

      {
        name: "Schema & Structured Data",
        slug: "schema",
        description: "Create and validate structured data",

        tools: [
          {
            name: "Schema Markup Generator",
            description: "Generate JSON-LD schema markup",
            href: "/schema-generator",
            badge: "Popular",
          },
          {
            name: "Schema Validator",
            description: "Validate structured data markup",
            href: "/schema-validator",
          },
          {
            name: "FAQ Schema Generator",
            description: "Generate FAQ structured data",
            href: "/faq-schema-generator",
          },
          {
            name: "Article Schema Generator",
            description: "Generate Article schema",
            href: "/article-schema-generator",
          },
          {
            name: "Product Schema Generator",
            description: "Generate Product structured data",
            href: "/product-schema-generator",
          },
          {
            name: "Local Business Schema",
            description: "Generate LocalBusiness schema",
            href: "/local-business-schema",
          },
          {
            name: "Breadcrumb Schema Generator",
            description: "Generate breadcrumb structured data",
            href: "/breadcrumb-schema-generator",
          },
          {
            name: "Organization Schema Generator",
            description: "Generate Organization schema",
            href: "/organization-schema-generator",
          },
        ],
      },


      // -----------------------------------------------------
      // CONTENT SEO
      // -----------------------------------------------------

      {
        name: "Content SEO",
        slug: "content-seo",
        description: "Create and optimize SEO content",

        tools: [
          {
            name: "SEO Content Analyzer",
            description: "Analyze content for SEO optimization",
            href: "/seo-content-analyzer",
          },
          {
            name: "Content Gap Analyzer",
            description: "Find missing content opportunities",
            href: "/content-gap-analyzer",
          },
          {
            name: "Content Brief Generator",
            description: "Create SEO-focused content briefs",
            href: "/content-brief-generator",
          },
          {
            name: "SEO Title Generator",
            description: "Generate SEO-friendly titles",
            href: "/seo-title-generator",
          },
          {
            name: "Meta Description Generator",
            description: "Generate optimized meta descriptions",
            href: "/meta-description-generator",
          },
          {
            name: "FAQ Generator",
            description: "Generate SEO-friendly FAQs",
            href: "/faq-generator",
          },
          {
            name: "Slug Generator",
            description: "Create SEO-friendly URL slugs",
            href: "/slug-generator",
          },
          {
            name: "Text Similarity Checker",
            description: "Compare content similarity",
            href: "/text-similarity",
          },
          {
            name: "Duplicate Content Checker",
            description: "Find duplicate content",
            href: "/duplicate-content",
          },
        ],
      },


      // -----------------------------------------------------
      // LINK BUILDING
      // -----------------------------------------------------

      {
        name: "Links & Backlinks",
        slug: "links",
        description: "Analyze internal and external links",

        tools: [
          {
            name: "Backlink Checker",
            description: "Analyze website backlinks",
            href: "/backlink-checker",
          },
          {
            name: "Backlink Analyzer",
            description: "Analyze backlink profiles",
            href: "/backlink-analyzer",
          },
          {
            name: "Link Building Opportunities",
            description: "Discover potential link opportunities",
            href: "/link-building-opportunities",
          },
          {
            name: "Internal Link Generator",
            description: "Generate internal linking suggestions",
            href: "/internal-link-generator",
          },
          {
            name: "External Link Checker",
            description: "Analyze outbound links",
            href: "/external-link-checker",
          },
          {
            name: "Anchor Text Checker",
            description: "Analyze anchor text distribution",
            href: "/anchor-text-checker",
          },
        ],
      },


      // -----------------------------------------------------
      // SERP TOOLS
      // -----------------------------------------------------

      {
        name: "SERP Tools",
        slug: "serp",
        description: "Analyze search engine results",

        tools: [
          {
            name: "SERP Checker",
            description: "Check search results for keywords",
            href: "/serp-checker",
          },
          {
            name: "SERP Preview",
            description: "Preview how your page appears in Google",
            href: "/serp-preview",
          },
          {
            name: "SERP Snippet Generator",
            description: "Create optimized search snippets",
            href: "/serp-snippet-generator",
          },
          {
            name: "Rank Tracker",
            description: "Track keyword rankings",
            href: "/rank-tracker",
            badge: "Popular",
          },
          {
            name: "SERP Competitor Analyzer",
            description: "Analyze competing search results",
            href: "/serp-competitor-analyzer",
          },
        ],
      },


      // -----------------------------------------------------
      // LOCAL SEO
      // -----------------------------------------------------

      {
        name: "Local SEO",
        slug: "local-seo",
        description: "Optimize businesses for local search",

        tools: [
          {
            name: "Local SEO Audit",
            description: "Audit local SEO performance",
            href: "/local-seo-audit",
          },
          {
            name: "Google Business Profile Checker",
            description: "Analyze Google Business Profile",
            href: "/gbp-checker",
          },
          {
            name: "Local Business Schema",
            description: "Generate LocalBusiness schema",
            href: "/local-business-schema",
          },
          {
            name: "NAP Checker",
            description: "Check business name, address and phone",
            href: "/nap-checker",
          },
          {
            name: "Local Citation Checker",
            description: "Analyze local business citations",
            href: "/citation-checker",
          },
          {
            name: "Review Schema Generator",
            description: "Generate review structured data",
            href: "/review-schema-generator",
          },
        ],
      },


      // -----------------------------------------------------
      // ECOMMERCE SEO
      // -----------------------------------------------------

      {
        name: "E-commerce SEO",
        slug: "ecommerce-seo",
        description: "SEO tools for online stores",

        tools: [
          {
            name: "Product SEO Analyzer",
            description: "Analyze product page SEO",
            href: "/product-seo-analyzer",
          },
          {
            name: "Product Schema Generator",
            description: "Generate Product schema",
            href: "/product-schema-generator",
          },
          {
            name: "Product Meta Generator",
            description: "Generate product metadata",
            href: "/product-meta-generator",
          },
          {
            name: "Category SEO Checker",
            description: "Analyze ecommerce category pages",
            href: "/category-seo-checker",
          },
          {
            name: "E-commerce SEO Audit",
            description: "Audit online store SEO",
            href: "/ecommerce-seo-audit",
          },
        ],
      },


      // -----------------------------------------------------
      // IMAGE SEO
      // -----------------------------------------------------

      {
        name: "Image SEO",
        slug: "image-seo",
        description: "Optimize images for search and performance",

        tools: [
          {
            name: "Image SEO Checker",
            description: "Analyze image SEO",
            href: "/image-seo-checker",
          },
          {
            name: "Alt Text Generator",
            description: "Generate descriptive image alt text",
            href: "/alt-text-generator",
          },
          {
            name: "Image Filename Generator",
            description: "Create SEO-friendly image filenames",
            href: "/image-filename-generator",
          },
          {
            name: "Image Compressor",
            description: "Reduce image file size",
            href: "/image-compressor",
          },
          {
            name: "Image Resizer",
            description: "Resize images for web",
            href: "/image-resizer",
          },
          {
            name: "WebP Converter",
            description: "Convert images to WebP",
            href: "/webp-converter",
          },
        ],
      },


      // -----------------------------------------------------
      // INTERNATIONAL SEO
      // -----------------------------------------------------

      {
        name: "International SEO",
        slug: "international-seo",
        description: "Optimize multilingual and global websites",

        tools: [
          {
            name: "Hreflang Checker",
            description: "Validate hreflang implementation",
            href: "/hreflang-checker",
          },
          {
            name: "Hreflang Generator",
            description: "Generate hreflang tags",
            href: "/hreflang-generator",
          },
          {
            name: "Language Tag Checker",
            description: "Check HTML language attributes",
            href: "/language-tag-checker",
          },
          {
            name: "International SEO Audit",
            description: "Audit multilingual SEO",
            href: "/international-seo-audit",
          },
        ],
      },


      // -----------------------------------------------------
      // AI / GEO / LLM SEO
      // -----------------------------------------------------

      {
        name: "AI & GEO SEO",
        slug: "ai-seo",
        description: "Optimize websites for AI search",

        tools: [
          {
            name: "AI Search Visibility Checker",
            description: "Analyze visibility in AI search",
            href: "/ai-search-visibility",
            badge: "New",
          },
          {
            name: "AI Citation Checker",
            description: "Analyze citations in AI search",
            href: "/ai-citation-checker",
            badge: "New",
          },
          {
            name: "LLM Visibility Checker",
            description: "Check brand visibility across LLMs",
            href: "/llm-visibility-checker",
            badge: "New",
          },
          {
            name: "AI Content Analyzer",
            description: "Analyze content for AI search readiness",
            href: "/ai-content-analyzer",
          },
          {
            name: "GEO Content Analyzer",
            description: "Optimize content for generative search",
            href: "/geo-content-analyzer",
          },
          {
            name: "AI Crawler Checker",
            description: "Check AI crawler accessibility",
            href: "/ai-crawler-checker",
          },
          {
            name: "llms.txt Generator",
            description: "Generate llms.txt files",
            href: "/llms-txt-generator",
            badge: "New",
          },
        ],
      },


      // -----------------------------------------------------
      // ANALYTICS & WEBMASTER
      // -----------------------------------------------------

      {
        name: "Analytics & Webmaster",
        slug: "analytics",
        description: "Analyze SEO performance and tracking",

        tools: [
          {
            name: "Google Analytics Checker",
            description: "Check Google Analytics implementation",
            href: "/google-analytics-checker",
          },
          {
            name: "GA4 Tracking Checker",
            description: "Check GA4 implementation",
            href: "/ga4-checker",
          },
          {
            name: "Google Tag Manager Checker",
            description: "Check GTM implementation",
            href: "/gtm-checker",
          },
          {
            name: "Search Console Checker",
            description: "Check Search Console signals",
            href: "/search-console-checker",
          },
          {
            name: "UTM Builder",
            description: "Create campaign tracking URLs",
            href: "/utm-builder",
          },
        ],
      },

    ],
  },


  // =========================================================
  // IMAGE TOOLS
  // =========================================================

  {
    name: "Image Tools",
    type: "mega-menu",

    categories: [
      {
        name: "Image Optimization",
        tools: [
          {
            name: "Image Compressor",
            description: "Compress images without losing quality",
            href: "/image-compressor",
          },
          {
            name: "Image Resizer",
            description: "Resize images online",
            href: "/image-resizer",
          },
          {
            name: "Image Cropper",
            description: "Crop images quickly",
            href: "/image-cropper",
          },
          {
            name: "Image Optimizer",
            description: "Optimize images for web",
            href: "/image-optimizer",
          },
        ],
      },

      {
        name: "Image Converters",
        tools: [
          {
            name: "PNG to WEBP",
            description: "Convert PNG to WEBP",
            href: "/png-to-webp",
          },
          {
            name: "JPG to WEBP",
            description: "Convert JPG to WEBP",
            href: "/jpg-to-webp",
          },
          {
            name: "WEBP to PNG",
            description: "Convert WEBP to PNG",
            href: "/webp-to-png",
          },
          {
            name: "JPG to PNG",
            description: "Convert JPG to PNG",
            href: "/jpg-to-png",
          },
        ],
      },
    ],
  },


  // =========================================================
  // PDF TOOLS
  // =========================================================

  {
    name: "PDF Tools",
    type: "mega-menu",

    categories: [
      {
        name: "PDF Conversion",
        tools: [
          {
            name: "PDF to Image",
            description: "Convert PDF pages to images",
            href: "/pdf-to-image",
          },
          {
            name: "Image to PDF",
            description: "Create PDF from images",
            href: "/image-to-pdf",
          },
          {
            name: "PDF to JPG",
            description: "Convert PDF to JPG",
            href: "/pdf-to-jpg",
          },
          {
            name: "PDF to PNG",
            description: "Convert PDF to PNG",
            href: "/pdf-to-png",
          },
        ],
      },

      {
        name: "PDF Optimization",
        tools: [
          {
            name: "PDF Compressor",
            description: "Reduce PDF file size",
            href: "/pdf-compressor",
          },
          {
            name: "PDF Merger",
            description: "Merge multiple PDF files",
            href: "/pdf-merger",
          },
          {
            name: "PDF Splitter",
            description: "Split PDF documents",
            href: "/pdf-splitter",
          },
        ],
      },
    ],
  },


  // =========================================================
  // DEVELOPER TOOLS
  // =========================================================

  {
    name: "Developer",
    type: "mega-menu",

    categories: [
      {
        name: "Formatters",
        tools: [
          {
            name: "JSON Formatter",
            description: "Format and beautify JSON",
            href: "/json-formatter",
          },
          {
            name: "JSON Validator",
            description: "Validate JSON data",
            href: "/json-validator",
          },
          {
            name: "HTML Formatter",
            description: "Format HTML code",
            href: "/html-formatter",
          },
          {
            name: "CSS Formatter",
            description: "Format CSS code",
            href: "/css-formatter",
          },
        ],
      },

      {
        name: "Generators",
        tools: [
          {
            name: "UUID Generator",
            description: "Generate unique UUIDs",
            href: "/uuid-generator",
          },
          {
            name: "Password Generator",
            description: "Generate secure passwords",
            href: "/password-generator",
          },
          {
            name: "QR Code Generator",
            description: "Create QR codes instantly",
            href: "/qr-code-generator",
          },
        ],
      },
    ],
  },


  // =========================================================
  // MORE
  // =========================================================

  {
    name: "More",
    type: "dropdown",

    children: [
      {
        name: "About Kraviona Tools",
        href: "/about",
      },
      {
        name: "Blog",
        href: "/blog",
      },
      {
        name: "Changelog",
        href: "/changelog",
      },
      {
        name: "Contact",
        href: "/contact",
      },
    ],
  },
];