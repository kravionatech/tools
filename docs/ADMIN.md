# Kraviona Admin Panel: Comprehensive Guide & Manual

This guide documents the architecture, capabilities, and administrative procedures for managing **Kraviona Tools** via the Admin Panel at `/admin`.

---

## 1. Overview & Architecture

The Kraviona Admin Panel is a high-performance, responsive management suite built on Next.js 16 with a clean SaaS aesthetic. It communicates securely with the Express REST backend using authenticated JSON API requests.

### Key Capabilities:
- **Real-Time Analytics & Traffic Insights**: Live visitor counts, page hits, tool popularity, and visitor telemetry.
- **Dynamic SEO Configuration**: Manage meta titles, descriptions, OpenGraph tags, canonicals, and structured data sitewide without code deployments.
- **Search Engine & LLM Crawler Controls**: Full control over `/robots.txt` and `/llms.txt` rules, user-agent permissions, crawl delays, and AI training policies.
- **Custom Code Injection**: Safely inject Google Analytics, Tag Manager, Meta Pixel, and verification tags into `<head>`, `<body>` start, or `<body>` end.
- **Tool Catalog Management**: Enable, disable, configure, and reorder 40+ utility tools across text, SEO, and image domains.
- **Audit Logs & System Monitoring**: Track every administrative change with IP and timestamp telemetry.

---

## 2. Authentication & Access Control

### Admin Login
- **Route**: `https://kraviona.site/admin/login`
- **Mechanism**: JWT (JSON Web Token) returned upon successful credentials validation.
- **Session Handling**: Token is stored in `localStorage` under `token` and verified through the `/api/auth/me` endpoint.

### Route Protection
All `/admin/*` routes (except `/admin/login`) are protected by client-side authentication guards in `AdminLayout.tsx` and backend middleware `verifyToken` in Express. Unauthorized requests automatically redirect to `/admin/login`.

---

## 3. Navigation & Dashboard Structure

| Section | Route | Description |
| :--- | :--- | :--- |
| **Dashboard** | `/admin` | Key metrics, traffic trends, popular tools, quick actions |
| **Analytics** | `/admin/analytics` | Detailed traffic analytics, referrers, device breakdown |
| **Visitors** | `/admin/analytics/visitors` | Live session logs, geolocation, browser/OS data |
| **Tool Catalog** | `/admin/tools` | Manage tool statuses, categories, featured status |
| **Content** | `/admin/content` | Page content, descriptions, and FAQs |
| **SEO Settings** | `/admin/seo` (or `/admin/settings/seo`) | Sitewide meta defaults, Open Graph, schema presets |
| **Robots.txt** | `/admin/settings/robots` | Crawler user-agent rules, crawl delays, sitemap refs |
| **LLMs.txt** | `/admin/settings/llms` | AI model training permissions, context documentation |
| **Custom Code** | `/admin/settings/custom-code` | Inject GTM, GA4, Meta Pixel, verification tags |
| **Activity Log** | `/admin/activity` | Security audit trail of all administrative actions |
| **System** | `/admin/system` | Server health, MongoDB connection status, memory usage |
| **Settings** | `/admin/settings` | General site configuration, maintenance mode, branding |

---

## 4. Module Guide

### 4.1 Dashboard Overview (`/admin`)
- **Metric Cards**: Total Pageviews, Unique Visitors, Total Tools Active, API Latency.
- **Traffic Graphs**: Daily and hourly volume breakdown.
- **Top Performing Tools**: Identifies which utilities generate the highest user engagement.
- **Quick Links**: Direct shortcuts to SEO rules, code manager, and maintenance toggle.

### 4.2 SEO Management (`/admin/seo` & `/admin/settings/seo`)
- **Site Title & Suffix**: Configure brand title template (e.g. `%s | Kraviona Tools`).
- **Meta Description**: Default search snippet description for the homepage and fallback pages.
- **Keywords**: Primary and secondary comma-separated keyword targets.
- **Canonical URL Configuration**: Ensures all canonical tags point strictly to `https://kraviona.site`.
- **OpenGraph & Twitter Card Preview**: Live visual card preview for social sharing appearances.
- **JSON-LD Structured Data**: Toggle `WebSite`, `Organization`, and `SoftwareApplication` schemas.

### 4.3 Robots.txt Manager (`/admin/settings/robots`)
- **Visual Rule Builder**:
  - Add or remove directives per User-Agent (`*`, `Googlebot`, `Bingbot`, `Baiduspider`, etc.).
  - Set `Allow` and `Disallow` paths with wildcards.
  - Set Crawl-Delay (in seconds) for rate limiting polite bots.
  - Configure dynamic Sitemap URL reference (`https://kraviona.site/sitemap.xml`).
- **Live Preview Window**: See the exact output rendered by `https://kraviona.site/robots.txt`.
- **Reset to Default**: One-click restore to standard SEO-safe defaults.

### 4.4 LLMs.txt Manager (`/admin/settings/llms`)
- **AI Policy Controls**:
  - Control permissions for OpenAI (`GPTBot`), Anthropic (`ClaudeBot`), Google (`Google-Extended`), Common Crawl (`CCBot`), and Perplexity (`PerplexityBot`).
  - Set policy to `Allow`, `Disallow`, or `Conditional`.
- **Project Context & Documentation**:
  - Define high-level site summary for generative AI agents and search engines.
  - Link directly to markdown documentation and public API specifications.
- **Live Preview**: See exact output rendered at `https://kraviona.site/llms.txt`.

### 4.5 Custom Code Manager (`/admin/settings/custom-code`)
- **Head Code**: Place scripts that require early execution before DOM rendering (Google Tag Manager snippet, GA4 loader, Search Console verification meta tags).
- **Body Start Code**: Ideal for noscript fallback iframes (e.g., GTM `<noscript>` iframe).
- **Body End Code**: Best for customer support widgets, telemetry trackers, and non-critical scripts to prevent render blocking.
- **Syntax Validator**: Real-time lint check ensures all `<script>` and `<style>` tags are properly balanced and closed before submission.
- **Safety Guarantee**: Custom code is **never** executed inside the `/admin/*` panel, completely eliminating administrative lockout risks.

### 4.6 Tool Catalog Management (`/admin/tools`)
- **Status Toggle**: Enable or disable any tool instantly. Disabled tools return a friendly "Under Maintenance" state.
- **Category Filter**: Filter utilities by Text, Image, or SEO.
- **Featured Badges**: Mark high-value tools to be highlighted on the homepage hero section.

---

## 5. Security & Administrative Best Practices

1. **Keep Secrets Out of Client Code**: Never input sensitive private keys (e.g. database credentials, AWS secret keys) into Custom Code or SEO forms.
2. **Review Syntax Prior to Saving**: Always use the **Validate Syntax** button in Custom Code to prevent malformed HTML from breaking frontend layout rendering.
3. **Audit Trail Inspection**: Periodically inspect `/admin/activity` to verify all recorded changes were made by authorized personnel.
4. **Credential Rotation**: Rotate the administrator password every 90 days or immediately upon personnel changes.
