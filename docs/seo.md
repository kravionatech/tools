# Kraviona Technical SEO Architecture & Management Guide

This document outlines the complete SEO infrastructure of the Kraviona platform, explaining the centralized domain configuration, dynamic metadata, canonical URLs, dynamic crawler directives (`robots.txt`), AI search engine feeds (`llms.txt`), and automated sitemap generation (`sitemap.xml`).

---

## 1. Central Domain & Site Configuration

To prevent domain duplication and hardcoded URL fragmentation across the codebase, Kraviona uses a single centralized environment variable and TypeScript configuration module:

### Primary Environment Variable
```env
NEXT_PUBLIC_SITE_URL=https://kraviona.site
```

### Central Source of Truth: `client/lib/site-config.ts`
All canonical URLs, Open Graph images, Twitter cards, Breadcrumb schema, and sitemap entries import `siteConfig` or the `absoluteUrl()` helper:

```ts
import { siteConfig, absoluteUrl } from "@/lib/site-config";

// Examples:
absoluteUrl("/tools/seo"); // Returns "https://kraviona.site/tools/seo"
siteConfig.siteUrl;        // Returns "https://kraviona.site"
```

To change the primary domain in the future, only update `NEXT_PUBLIC_SITE_URL` in `.env`.

---

## 2. Dynamic `robots.txt`

### Route
```text
https://kraviona.site/robots.txt
```
Served dynamically by `client/app/robots.ts` and managed via the Kraviona Admin Dashboard at `/admin/settings/robots`.

### Default Rules
```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/
Disallow: /dashboard/
Disallow: /login/
Disallow: /private/
Disallow: /api/

Sitemap: https://kraviona.site/sitemap.xml
Host: https://kraviona.site
```

### Admin Management (`/admin/settings/robots`)
- **Enable / Disable Search Indexing**: Controls sitewide indexing flags.
- **Allow / Disallow Rule Manager**: Add, edit, or remove custom paths with live syntax feedback.
- **Emergency Bot Killswitch ("Block all crawlers")**: Generates `Disallow: /` with a mandatory safety confirmation modal to protect production domains from accidental deindexing.
- **Custom Directives**: Supports arbitrary directives (e.g. `Crawl-delay: 5`, custom bot restrictions for `GPTBot`, `ClaudeBot`, `CCBot`).
- **Live Preview & Copy**: Real-time syntax-highlighted preview with one-click clipboard copy.

---

## 3. Dynamic `llms.txt`

### Route
```text
https://kraviona.site/llms.txt
```
Served dynamically by `client/app/llms.txt/route.ts` adhering to the emerging `/llms.txt` standard for AI agents, LLMs, and search assistants (ChatGPT Search, Perplexity, Claude, Gemini).

### Generated Format
```markdown
# Kraviona

> Kraviona is a professional SEO tools and digital productivity platform.

## Website

- Homepage: https://kraviona.site/
- SEO Tools: https://kraviona.site/tools
- Blog: https://kraviona.site/blog
- About: https://kraviona.site/about
- Contact: https://kraviona.site/contact

## Important Resources

- [SEO Audit Tool](https://kraviona.site/tools/seo): Audit on-page SEO factors
- [Meta Tag Generator](https://kraviona.site/tools/meta-tag-generator): Generate meta tags and preview SERP snippets
- [Keyword Density Checker](https://kraviona.site/tools/keyword-density): Analyze keyword frequency and density
...

## Content Policy

Kraviona provides original educational content, SEO tools, and digital resources. Use the website content as a reference and do not misrepresent the brand or its services.
```

### Admin Management (`/admin/settings/llms`)
- **Brand & Description**: Configure platform title, mission summary, and brand introduction.
- **Resource Link CRUD**: Add, edit, remove, enable/disable, and reorder links with drag/up-down controls.
- **Content Policy**: Configure licensing and citation instructions for AI agents.

---

## 4. Dynamic `sitemap.xml`

### Route
```text
https://kraviona.site/sitemap.xml
```
Served dynamically by `client/app/sitemap.ts`.

### Inclusion Criteria
- **Homepage**: `https://kraviona.site` (`priority: 1.0`, `changeFrequency: "daily"`)
- **Tools Catalog**: `/tools` (`priority: 0.9`, `changeFrequency: "weekly"`)
- **Category Hubs**: `/tools/text`, `/tools/image`, `/tools/seo` (`priority: 0.8`, `changeFrequency: "weekly"`)
- **Published Tools**: `/tools/{slug}` (`priority: 0.75 - 0.85`, `changeFrequency: "weekly"`)
- **Static Pages**: `/about`, `/contact`, `/privacy`, `/terms`, `/upcoming` (`priority: 0.5 - 0.6`)

### Automatic Exclusions
- Administrative pages (`/admin/*`)
- Authentication pages (`/login`)
- Internal API routes (`/api/*`)
- Draft tools or tools marked with `enabled: false`

---

## 5. Google Search Console & Domain Verification

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add Property: `https://kraviona.site`.
3. Verify ownership using either:
   - **HTML Meta Tag**: Go to `/admin/settings/custom-code` and paste the verification `<meta name="google-site-verification" content="...">` inside the Head Code field or the GSC preset.
   - **DNS TXT Record**: Add the TXT record to your DNS provider.
4. Submit your new sitemap:
   - In Search Console, navigate to **Sitemaps**.
   - Enter `sitemap.xml` and click **Submit**.
   - Verify status returns **Success**.

---

## 6. How to Test SEO Files Locally

```bash
# Test dynamic robots.txt
curl http://localhost:3000/robots.txt

# Test dynamic llms.txt
curl http://localhost:3000/llms.txt

# Test dynamic sitemap.xml
curl http://localhost:3000/sitemap.xml
```
