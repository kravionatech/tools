# Changelog

All notable changes to the **Kraviona Tools** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-09-06

### Major Architecture & Brand Overhaul

#### Added
- **Complete Vector Brand Suite**:
  - `client/public/logo/logo-primary.svg` - Official primary horizontal logo with gradient bolt mark.
  - `client/public/logo/logo-dark.svg` - High contrast dark-background logo.
  - `client/public/logo/logo-light.svg` - High contrast light-background logo.
  - `client/public/logo/logo-icon.svg` - Hexagonal bolt brand mark icon.
  - `client/public/logo/logo-mark.svg` - Standalone vector brandmark.
  - `client/public/favicon.svg` & `client/public/favicon.ico` - Scalable favicon suite.
  - `client/config/brand.config.ts` - Central brand definitions, dimensions, and metadata.
  - Reusable `<KravionaLogo />` component deployed across Public Header, Footer, and Admin Sidebar.
- **Frontend Service Layer**:
  - `client/services/api.client.ts` - Centralized, type-safe HTTP client with token handling and standardized error extraction.
  - `client/services/seo.service.ts` - Typed API service for SEO settings, Robots.txt, and LLMs.txt.
  - `client/services/custom-code.service.ts` - Typed API service for Custom Code management.
  - `client/services/analytics.service.ts` - Typed API service for dashboard statistics and visitor telemetry.
  - `client/services/tools.service.ts` - Typed API service for tool statuses and categorization.
- **Frontend Shared UI Design System**:
  - `client/components/ui/Button.tsx` - Consistent variant buttons (primary, secondary, danger, ghost, outline) with loading spinners.
  - `client/components/ui/Badge.tsx` - Semantic badges (success, warning, error, info, neutral).
  - `client/components/ui/Card.tsx` - Elevation and bordered glass cards.
  - `client/components/ui/ConfirmationModal.tsx` - Reusable modal dialogs for critical administrative actions.
- **TypeScript Type System**:
  - `client/types/api.types.ts` - Standardized API envelope types (`ApiResponse<T>`, `PaginationMeta`, `ApiError`).
  - `client/types/seo.types.ts` - Typed contracts for SEO config, robots user-agent rules, and LLM permissions.
  - `client/types/admin.types.ts` - Typed contracts for admin stats, custom code snippets, and audit logs.
- **Backend Architecture Improvements**:
  - `backend/app/utils/response.js` - Standardized response wrappers (`sendSuccess`, `sendError`) backward-compatible with legacy field spreads.
  - `backend/app/middleware/error.middleware.js` - Centralized 404 handler and global exception handler.
  - `backend/app/routes/settings.routes.js` - Enabled `PUT /api/settings` for full settings updates.
- **Dynamic Crawler Routes**:
  - Dynamic `https://kraviona.site/robots.txt` powered by `client/app/robots.ts` reading real-time database settings.
  - Dynamic `https://kraviona.site/llms.txt` powered by `client/app/llms.txt/route.ts` delivering AI agent documentation and permissions.
  - Dynamic `https://kraviona.site/sitemap.xml` powered by `client/app/sitemap.ts` listing all active pages and 40+ utility tools.
- **Comprehensive Documentation Suite**:
  - `docs/ARCHITECTURE.md` - System architecture, data flow, component hierarchy.
  - `docs/API.md` - Complete REST API specification with request/response schemas.
  - `docs/ADMIN.md` - Admin panel guide and administrative workflows.
  - `docs/SEO.md` - SEO architecture, canonical tag guidelines, JSON-LD structured data.
  - `docs/ROBOTS-LLMS.md` - Web crawler & AI ingestion policy manual.
  - `docs/CUSTOM-CODE.md` - Third-party tracking and custom script injection guide with security isolation.
  - `docs/DEPLOYMENT.md` - Linux VPS, Nginx, PM2, and SSL production deployment manual.
  - `docs/TROUBLESHOOTING.md` - Diagnostics for CORS, MongoDB, crawler 404s, and process crashes.
  - `docs/DOMAIN-MIGRATION.md` - Complete domain audit and migration record.
  - `docs/SOP.md` - 31-point standard operating procedures with daily, weekly, and monthly checklists.

#### Changed
- **Domain Migration**:
  - Replaced all legacy domain references (`https://kraviona.com`) with `https://kraviona.site`.
  - Centralized site URL in `NEXT_PUBLIC_SITE_URL=https://kraviona.site`.
  - Updated all JSON-LD schemas, canonical tags, OpenGraph previews, and robots sitemap references.
- **Cleaned Workspace**:
  - Removed outdated static export configuration (`output: "export"`) to enable dynamic crawler routing without generating static `out/` export directories.
  - Removed leftover temporary files, duplicate Claude reference files, and build caches.

---

## [1.1.0] - 2026-08-15
- Initial admin dashboard setup.
- Basic analytics tracking and MongoDB connection.
- 40+ core tools implemented across text, image, and SEO categories.
