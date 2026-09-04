# Kraviona.site Existing Codebase Audit

Audit date: 2026-09-04

## Executive Summary

Kraviona is a split repository with a Next.js public client, a separate Next.js admin app, and an Express API. The public product is currently a navigation and hero shell with a placeholder PNG-to-WebP route; the backend originally provided MySQL-backed user CRUD only and has now been migrated to MongoDB through Mongoose. There is no licensed DA/PA provider configured; the public app now has a browser-local image converter, curated starter content, sitemap, robots route, and production metadata.

The smallest credible transformation is to keep the existing client/admin/backend boundaries, simplify the public navigation around implemented tools, add a client-side converter for privacy and speed, and add a server-side SEO provider abstraction plus RDAP domain-age service. Content should begin as curated, code-owned content rather than introducing a CMS before the publishing model is known.

## Current Architecture

### Public client

- Framework: Next.js 15.5 with React 19 and JSX, despite the stale Vite-oriented `client/README.md`.
- Styling: Tailwind CSS v4 through `@tailwindcss/postcss`, plus `client/app/globals.css`.
- UI: `lucide-react`; the public header is a client component with menus, search, keyboard shortcut handling, language state, and a large `utility/MenuList.js` catalog.
- Routes currently visible: `/`, `/png-to-webp`, and an empty `app/Image-converters` directory. Most menu links do not have corresponding pages.
- Assets: `client/src/assets` exists but contains no identified product/content system.
- Image dependency: `sharp` is installed in the client package but no working conversion pipeline uses it.

### Admin

- Framework: separate Next.js 15.5 app on port 3001.
- Current UI: one placeholder operations-console page and a minimal global stylesheet.
- Authentication, authorization, data views, and publishing workflows are not implemented.

### Backend

- Framework: Express 5, ES modules, Morgan logging, CORS dependency present but not mounted.
- Database: MongoDB via Mongoose; the connection URI is configured with `MONGODB_URI`.
- Startup: `backend/src/server.js` connects to MongoDB and seeds a user before listening, but deliberately continues if the database connection fails.
- Data layer: Mongoose schema/model in `backend/src/model/auth/user.model.js` and document operations in `backend/src/controller/user.controller.js`.
- Routes: `/api/users` CRUD and role/status filters. There are no tool, metrics, RDAP, blog, health, auth, or rate-limit routes.
- Deployment: no root workspace scripts, Dockerfile, CI workflow, hosting configuration, or documented production deployment setup was found.

## Existing Features

- Public header with responsive navigation, mega menus, tool search, language selector, and keyboard search shortcut: `client/components/Header/Header.jsx`.
- A polished but largely illustrative SEO dashboard hero: `client/components/Home/Banner/Banner.jsx`.
- A placeholder component and route name for PNG-to-WebP: `client/components/ImageTools/PngToWebp.jsx` and `client/app/png-to-webp/page.jsx`.
- MySQL user table creation, seed data, list/filter/create/update/soft-delete controller methods.
- Separate admin application boundary that can later host protected content/tool operations.

## Keep

- The Next.js public client and its app-router structure.
- The header interaction patterns and Lucide icon dependency, after reducing menu items to real routes.
- The visual language and dashboard concept from the banner, while replacing invented SEO values with honest product states.
- The backend's simple layered separation between config, database, controllers, and routes.
- MongoDB user storage if authentication/admin ownership is needed; it should not be coupled to public tool requests.

## Improve

- Replace placeholder homepage composition with real tools, content links, trust language, FAQ, and focused calls to action.
- Add shared metadata helpers, canonical URLs, Open Graph/Twitter metadata, JSON-LD, `sitemap`, `robots`, breadcrumbs, and a real 404 page.
- Implement one reusable image converter with supported-format configuration and route-specific content metadata.
- Add a backend metrics provider interface, RDAP domain-age lookup, timeout/caching/rate-limit controls, and explicit unavailable states when credentials are absent.
- Add input validation, CORS configuration, health checks, secret-safe errors, and remove password fields from all user responses.
- Add a code-owned content registry or MDX/content-files layer only after article taxonomy and internal-link rules are defined.
- Correct stale documentation, route naming inconsistencies, dependency drift, and missing root developer commands.

## Remove or Defer

- Defer or remove unimplemented menu entries that create crawlable-looking links without pages; retain them only in an internal roadmap.
- Remove unused `mongoose` and likely duplicate `color`/`colors` dependencies after verifying no external startup requirement depends on them.
- Remove the hard-coded seeded password and any test credentials from normal startup before production use.
- Remove invented dashboard statistics from user-facing trust claims; illustrative UI can remain only when clearly presented as a product preview.
- Do not delete the existing user model or admin boundary until authentication and admin requirements are decided.

## Missing Functionality

- DA/PA/Spam Score provider integration and honest provider configuration state.
- RDAP/WHOIS domain creation-date lookup and domain-age calculation.
- Server-side validation, rate limiting, caching, request timeouts, and observability for tool APIs.
- JPG/JPEG, PNG, WebP, and AVIF conversion with drag/drop, quality, dimensions, aspect-ratio preservation, preview, download, reset, and size errors.
- SEO landing pages for only the conversion pairs that are actually supported.
- Blog index, article pages, taxonomy, search, related content, and content-to-tool linking.
- Home, SEO Tools, Image Tools, Blog, About, Contact, Privacy, Terms, and 404 routes.
- XML sitemap, robots.txt, canonical metadata, social cards, schema, breadcrumbs, and route-level SEO.
- Automated tests, lint/type checks, route smoke checks, mobile checks, and production build orchestration.

## Technical Risks

- The worktree is already dirty with user changes, including a deleted legacy `backend/server.js`, new `backend/src` files, and package-lock changes. These must be preserved.
- `README.md` is stored as a binary-looking diff even though it contains text; documentation changes should avoid normalizing unrelated line endings.
- The backend starts even when MySQL is unavailable, which can conceal broken data-dependent features.
- User list/create responses currently expose password values, and the seed contains a plaintext password.
- SQL schema creation and seeding run at every backend startup without migrations or environment-specific safeguards.
- The client header references many routes that do not exist, creating broken navigation and possible duplicate/empty search intent.
- `sharp` in a Next.js client package does not by itself provide browser-safe conversion and may increase install/build complexity if imported into client code.
- No authentication middleware protects user CRUD routes; CORS is not configured in `app/app.js` despite being a dependency.
- No keyword API is configured. Search-volume, CPC, and difficulty must therefore be treated as unverified until supplied by a real source.

## Recommended Implementation Plan

1. Establish route/content inventory, root documentation, per-app scripts, and a minimal shared brand/metadata vocabulary.
2. Build the image converter as a privacy-preserving browser tool using supported browser codecs, with route configuration for each genuinely supported conversion pair.
3. Add backend tool infrastructure: validation, timeout wrapper, in-memory cache abstraction, rate-limit middleware, RDAP lookup, and a DA/PA provider interface that returns unavailable rather than fabricated metrics.
4. Add the homepage, tool directory, converter landing pages, SEO checker page, About, legal pages, and 404 using shared UI patterns.
5. Add a small curated content system with article metadata, article pages, FAQs, related tools/articles, breadcrumbs, and deliberate internal links.
6. Implement technical SEO and performance basics: metadata, canonical URLs, JSON-LD, sitemap, robots, semantic headings, lazy media, and reduced client JavaScript.
7. Harden existing backend user APIs, decide whether admin auth is in scope, and remove unused dependencies only after usage checks.
8. Validate with client/admin production builds, backend startup/API smoke tests, route checks, and responsive browser testing. Add automated tests around conversion validation, domain-age calculation, and provider-unavailable behavior.

## Audit Conclusion

There is useful presentation and application scaffolding, but not enough working product functionality to claim the requested platform exists. The existing stack can support the target without a framework rewrite. The first implementation milestone should be a truthful, working converter and a truthful SEO checker shell, followed by a small set of high-intent landing pages and guides rather than a large set of empty tools or unsupported SEO scores.
