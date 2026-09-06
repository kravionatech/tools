# Kraviona Architecture & Engineering Specification

This document provides a comprehensive technical overview of the **Kraviona Tools** web platform ([https://kraviona.site](https://kraviona.site)), including its client-side processing paradigm, backend services, security isolation model, and data flows.

---

## 1. System Overview

Kraviona is engineered as a modern, privacy-first SaaS platform consisting of two core decoupled systems:
1. **Frontend (`/client`)**: Next.js 16 (App Router with Turbopack), React 19, and Tailwind CSS.
2. **Backend (`/backend`)**: Node.js, Express.js REST API with Mongoose ODM (MongoDB).

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│                                                             │
│  ┌────────────────────────┐     ┌────────────────────────┐  │
│  │     Public Pages       │     │    Admin Dashboard     │  │
│  │ (Home, Tools, Guides)  │     │  (/admin/*, JWT Auth)  │  │
│  └───────────┬────────────┘     └───────────┬────────────┘  │
│              │                              │               │
│              ▼                              ▼               │
│     Browser Processing              Admin API Client        │
│   (Canvas, FileReader, JS)       (Authorization: Bearer)    │
└──────────────┬──────────────────────────────┬───────────────┘
               │ Anonymous telemetry          │ Admin management
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Backend Service                  │
│                     (http://localhost:5000)                 │
│                                                             │
│  ├── /api/auth               (JWT Authentication)           │
│  ├── /api/analytics          (Aggregated Telemetry)         │
│  ├── /api/settings           (Site Configuration)          │
│  ├── /api/settings/seo       (Dynamic Robots & LLMs)        │
│  ├── /api/settings/custom-code (Tracking Code Management)   │
│  ├── /api/activity           (Audit Logging)                │
│  └── /api/system             (Health & System Metrics)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Database                       │
│    (SiteSettings, AnalyticsEvents, AdminUsers, Activity)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Pillars

### 2.1 100% Client-Side Processing Paradigm
All 39+ SEO, image, and text utilities process user input **entirely within the user's browser**:
- **Images**: Handled via browser `CanvasRenderingContext2D`, `FileReader`, and WebAssembly libraries without uploading files to any server.
- **Text Tools**: Executed via standard JavaScript regex and parsing algorithms in real time.
- **Privacy Guarantee**: User files and data never leave their physical device.

### 2.2 Security Isolation & Admin Guard
To prevent cross-site scripting (XSS), session hijacking, and telemetry pollution:
- **Third-Party Code Isolation**: Custom tracking scripts (Google Tag Manager, Meta Pixel, Google Analytics, Microsoft Clarity) are injected via `CustomCodeInjector.tsx` **strictly on public routes**. They are programmatically blocked from executing on any `/admin/*` routes.
- **Route Guarding**: All administrative endpoints require a signed JWT token passed via `Authorization: Bearer <token>`.
- **Audit Logging**: Every configuration mutation is recorded in `ActivityModel` with admin identity, action name, IP address, and timestamp.

---

## 3. Frontend Architecture (`client/`)

### 3.1 Layered Module Hierarchy
```text
Page (app/**/page.tsx)
  └── UI Components (components/**)
        └── Custom Hooks & Contexts (AdminContext.tsx)
              └── Typed Services (services/*.service.ts)
                    └── HTTP Client (services/api.client.ts)
                          └── Backend REST API (/api/*)
```

### 3.2 Key Directories
- `app/`: Next.js App Router containing static routes, tool routes (`/tools/[slug]`), dynamic metadata handlers (`/robots.ts`, `/sitemap.ts`), and route handlers (`/llms.txt/route.ts`).
- `components/`:
  - `admin/`: Admin layout, sidebar, metric cards, charts, and brand marks.
  - `layout/`: Global Header, Footer, and Breadcrumbs.
  - `tools/`: Interactive tool runner layouts and related tool panels.
  - `seo/`: Safe custom code injector.
  - `ui/`: Standardized atomic components (`Button`, `Card`, `Badge`, `ConfirmationModal`).
- `config/`: Central brand, site, and navigation settings (`brand.config.ts`, `site.config.ts`, `navigation.config.ts`).
- `services/`: Encapsulated REST API clients (`seo.service.ts`, `custom-code.service.ts`, `analytics.service.ts`, `tools.service.ts`).
- `types/`: Global TypeScript interfaces (`api.types.ts`, `seo.types.ts`, `admin.types.ts`).

---

## 4. Backend Architecture (`backend/`)

### 4.1 Layered Design
- `app/app.js`: Express application bootstrap, helmet security headers, CORS origin enforcement, JSON parser, and rate limiting.
- `app/controller/`: Pure request/response handlers with clean error boundaries and standardized response envelopes (`{ success, message, data }`).
- `app/model/`: Mongoose schemas defining database structure:
  - `SiteSettingsModel`: Global site metadata, custom code snippets, and robots/llms configurations.
  - `EventModel`: Anonymous analytics events.
  - `ActivityModel`: Security audit trail of admin actions.
  - `UserModel`: Administrator credentials (bcrypt hashed passwords).
- `app/middleware/`:
  - `auth.middleware.js`: JWT token validation.
  - `error.middleware.js`: Standardized 404 and global 500 error envelopes.
- `app/utils/`: Standardized response formatting helpers (`sendSuccess`, `sendError`).

---

## 5. Dynamic SEO File Architecture

### 5.1 `/robots.txt`
- **File**: `client/app/robots.ts`
- **Behavior**: Evaluated dynamically on request. Queries `/api/seo/robots` for administrative rules, falls back to secure defaults if the backend is offline.
- **Protected Paths**: `/admin/`, `/api/admin/`, `/dashboard/`, `/login/`, `/private/`, `/api/`.

### 5.2 `/llms.txt`
- **File**: `client/app/llms.txt/route.ts`
- **Behavior**: Generates clean Markdown adhering to the LLM agent standard, dynamically rendering platform description, categorized resource links, and content policies.

### 5.3 `/sitemap.xml`
- **File**: `client/app/sitemap.ts`
- **Behavior**: Iterates over all static landing pages and active tools in `tools-registry.ts`. Uses `NEXT_PUBLIC_SITE_URL` to output fully qualified absolute URLs with accurate `priority` and `changeFrequency`.
