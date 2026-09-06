# Operational Manual: Dynamic Robots.txt & LLMs.txt

This guide explains how to manage search engine crawler access (`robots.txt`) and AI search engine context (`llms.txt`) from the Kraviona Admin Dashboard.

---

## 1. Dynamic `robots.txt`

### Purpose
The `robots.txt` file informs traditional search engine crawlers (Googlebot, Bingbot, YandexBot, etc.) which sections of the site they may crawl and index.

### Accessing the Editor
Navigate to:
```text
Admin Dashboard → Settings → Robots.txt (/admin/settings/robots)
```

### Key Controls
1. **Allow Search Engine Indexing**:
   - When checked, serves standard allow directives for public routes.
   - When unchecked, switches the site into crawler-blocking mode.
2. **Block All Crawlers (Safety Killswitch)**:
   - When checked, generates:
     ```txt
     User-agent: *
     Disallow: /
     ```
   - **Safety Confirmation Warning**: To prevent catastrophic accidental deindexing of the live production site, clicking this toggle displays a confirmation modal with an explicit warning.
3. **Allow Rules**:
   - List of paths allowed for crawling (defaults to `/`).
   - Add new paths using the input field.
4. **Disallow Rules**:
   - List of paths blocked from crawling.
   - Default protected routes:
     - `/admin/`
     - `/api/admin/`
     - `/dashboard/`
     - `/login/`
     - `/private/`
     - `/api/`
5. **XML Sitemap Directive**:
   - Informs search engines where to find the dynamic sitemap.
   - Defaults to `https://kraviona.site/sitemap.xml`.
6. **Custom Directives**:
   - Multi-line textarea for advanced configurations such as `Crawl-delay` or bot-specific rules:
     ```txt
     User-agent: GPTBot
     Disallow: /private/
     Crawl-delay: 10
     ```
7. **Live Preview & Copy Button**:
   - A real-time preview pane demonstrates exactly what will be served at `https://kraviona.site/robots.txt`.
   - Click **Copy** to place the generated configuration into your clipboard.

---

## 2. Dynamic `llms.txt`

### Purpose
The `/llms.txt` standard provides structured Markdown context to Large Language Models and AI search engines (Perplexity, ChatGPT, Claude, Microsoft Copilot) when users ask questions about Kraviona Tools or when AI bots index the site.

### Accessing the Editor
Navigate to:
```text
Admin Dashboard → Settings → LLMs.txt (/admin/settings/llms)
```

### Key Controls
1. **Brand & Platform Details**:
   - **Website Title**: e.g., "Kraviona"
   - **Description**: Summary explaining the platform (browser-based, privacy-first, 39+ SEO/text/image tools).
   - **Brand Intro**: Extended mission statement or guidelines.
   - **Homepage URL**: `https://kraviona.site/`
2. **Important Resources & Links Manager**:
   - Add new tool or documentation links with Title, URL, description, and category.
   - **Reordering**: Move links up or down to highlight top-priority tools at the top of the Markdown list.
   - **Active Toggle**: Temporarily hide a resource from `/llms.txt` without deleting it.
   - **Delete**: Remove outdated tools or links.
3. **Custom Content Policy & AI Instructions**:
   - Specify copyright guidelines, acceptable citation format, or disclaimers for AI engines when citing your tools.
4. **Live Markdown Preview**:
   - Demonstrates the exact Markdown layout served at `https://kraviona.site/llms.txt`.
   - Includes one-click copy button.

---

## 3. Verifying Generated Files

After making changes in the admin dashboard:
1. Click **Save Settings** (or **Save Changes**).
2. Visit:
   - `https://kraviona.site/robots.txt`
   - `https://kraviona.site/llms.txt`
3. Verify that your updates appear immediately (HTTP 200).
