# Kraviona Tools — Enterprise SEO & Digital Utility Platform

<p align="center">
  <img src="client/public/logo/logo-primary.svg" alt="Kraviona Logo" width="320" />
</p>

<p align="center">
  <strong>High-performance, privacy-first web utilities for digital creators, SEO professionals, and developers.</strong>
</p>

<p align="center">
  <a href="https://kraviona.site"><strong>🌐 Live Platform: https://kraviona.site</strong></a>
</p>

---

## 🌟 Overview

**Kraviona Tools** is a full-stack digital utility suite offering 40+ client-side tools across Text Processing, Image Optimization, and Search Engine Optimization. Engineered for speed and privacy, heavy transformations execute directly inside the user's browser, eliminating file uploads while delivering instant results.

The platform is powered by **Next.js 16** and an **Express / MongoDB** administration engine, complete with real-time analytics, dynamic crawler control (`robots.txt`, `llms.txt`, `sitemap.xml`), and safe custom code injection.

---

## 🚀 Key Highlights & Architecture

- **40+ Client-Side Browser Utilities**: Text cleaners, case converters, word counters, image compressors, WebP converters, and keyword analyzers.
- **Dynamic SEO Engine**:
  - **Dynamic `/robots.txt`**: Real-time crawler rules, bot rate-limiting, and emergency crawler killswitch.
  - **Dynamic `/llms.txt`**: Standardized AI ingestion endpoint for ChatGPT, Perplexity, Claude, and Gemini.
  - **Dynamic `/sitemap.xml`**: Automated XML sitemap driven by central site configuration.
  - **Structured Data**: Rich JSON-LD schemas (`WebSite`, `Organization`, `SoftwareApplication`).
- **Custom Code Management (`/admin/settings/custom-code`)**:
  - Inject Google Tag Manager, GA4, Meta Pixel, and Search Console tags into `<head>`, `<body>` start, or `<body>` end.
  - **Zero Admin Pollution**: Third-party scripts are strictly isolated and never execute inside `/admin/*`.
- **Enterprise SaaS Admin Dashboard (`/admin`)**:
  - Real-time visitor counts, daily pageviews, popular tools telemetry, and system health metrics.
  - Administrative audit logging (`/admin/activity`) tracking every configuration change.
- **Professional Brand Suite**:
  - Complete vector SVG brand assets (`logo-primary.svg`, `logo-dark.svg`, `logo-icon.svg`, `favicon.svg`).
  - Reusable `<KravionaLogo />` component integrated into public and administrative headers.

---

## 📁 Repository Structure

```text
kraviona_tools/
├── client/                     # Next.js 16 (App Router) Frontend
│   ├── app/                    # Pages, dynamic layouts, and crawler endpoints
│   │   ├── admin/              # Protected SaaS administration dashboard
│   │   ├── tools/              # 40+ interactive utility tools
│   │   ├── robots.ts           # Dynamic /robots.txt generator
│   │   ├── sitemap.ts          # Dynamic /sitemap.xml generator
│   │   └── llms.txt/route.ts   # Dynamic /llms.txt generator
│   ├── components/             # Reusable UI components & layouts
│   │   ├── ui/                 # Design system (Button, Badge, Card, Modal)
│   │   ├── admin/              # Admin-specific components
│   │   └── layout/             # Header, Footer, KravionaLogo
│   ├── config/                 # Brand, navigation, and tool configurations
│   ├── services/               # Typed frontend API services (apiClient)
│   ├── types/                  # Centralized TypeScript definitions
│   └── public/logo/            # Official vector SVG logo suite
├── backend/                    # Express.js REST Backend
│   └── app/
│       ├── controllers/        # Analytics, SEO, Settings, Auth controllers
│       ├── middleware/         # Auth, Rate limiting, Error handlers
│       ├── models/             # MongoDB Mongoose schemas
│       ├── routes/             # RESTful API route declarations
│       └── utils/              # Standardized response envelopes
└── docs/                       # Comprehensive Technical Documentation
    ├── ARCHITECTURE.md         # System design, data flow, tech stack
    ├── API.md                  # REST API schemas and endpoint reference
    ├── ADMIN.md                # Admin panel manual and workflows
    ├── SEO.md                  # SEO architecture and crawler rules
    ├── ROBOTS-LLMS.md          # Web crawler and AI ingestion guide
    ├── CUSTOM-CODE.md          # Script injection and security isolation
    ├── DEPLOYMENT.md           # Production deployment, Nginx, PM2, SSL
    ├── TROUBLESHOOTING.md      # Diagnostics and issue resolutions
    ├── DOMAIN-MIGRATION.md     # Domain migration and 301 redirect map
    └── SOP.md                  # 31-point Standard Operating Procedures
```

---

## 📚 Technical Documentation Suite

For comprehensive guides, refer to the `docs/` library:

| Documentation Guide | Description |
| :--- | :--- |
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | System architecture, data flow, component tree, and tech stack |
| **[docs/API.md](docs/API.md)** | Complete REST API endpoint reference and payload specifications |
| **[docs/ADMIN.md](docs/ADMIN.md)** | Comprehensive manual for the Kraviona Admin Panel |
| **[docs/SEO.md](docs/SEO.md)** | SEO infrastructure, metadata standards, and structured data |
| **[docs/ROBOTS-LLMS.md](docs/ROBOTS-LLMS.md)** | Crawler controls, robots.txt directives, and AI model policies |
| **[docs/CUSTOM-CODE.md](docs/CUSTOM-CODE.md)** | Custom script injection guide, GA4/GTM setup, and security isolation |
| **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** | VPS server setup, PM2 process management, Nginx, and Let's Encrypt |
| **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** | Diagnostic workflows for CORS, MongoDB, crawler 404s, and crashes |
| **[docs/DOMAIN-MIGRATION.md](docs/DOMAIN-MIGRATION.md)** | Audit and checklist for `kraviona.site` domain migration |
| **[docs/SOP.md](docs/SOP.md)** | Master 31-point Standard Operating Procedures and maintenance routines |
| **[CHANGELOG.md](CHANGELOG.md)** | Full version history and release notes |

---

## ⚙️ Quick Start (Development)

### 1. Prerequisites
- **Node.js**: v18.17.0+ (v20+ LTS recommended)
- **MongoDB**: Local `mongod` service or MongoDB Atlas cluster

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
# Express API server starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
# Next.js development server starts on http://localhost:3000
```

### 4. Admin Access
- **Login Route**: `http://localhost:3000/admin/login`
- **Default Email**: `admin@kraviona.site`
- **Default Password**: `Asdf@123`

---

## 🔒 Security & Quality Standards

- **Domain Centralization**: Single source of truth via `NEXT_PUBLIC_SITE_URL=https://kraviona.site`.
- **Script Sandboxing**: Third-party trackers are strictly prevented from executing within `/admin/*`.
- **Pre-Save Syntax Validation**: Injected scripts are linted for balanced HTML tags before saving.
- **Auditing**: All administrative updates are captured in the immutable `/admin/activity` audit trail.

---

## 📄 License
Private & Proprietary. All rights reserved by **Kraviona Tools**.
