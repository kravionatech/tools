# Kraviona Standard Operating Procedures (SOP)
## Developer & Administrator Master Operational Manual

This document establishes the official operational protocols, security baselines, and maintenance checklists for developing, operating, and administering **Kraviona Tools** (`https://kraviona.site`).

---

## Part 1: Core 31-Point Standard Operating Procedures

### I. Codebase Integrity & Standards
1. **Domain Uniformity**: All URLs, API endpoints, canonical links, and OpenGraph references must strictly reference `https://kraviona.site`. Never commit legacy domain references.
2. **Environment Separation**: Development secrets, API endpoints, and database connection strings must reside in `.env` or `.env.local`. Never commit `.env` files containing live production secrets.
3. **Strict TypeScript Typing**: All components, service methods, and API responses must utilize strongly typed interfaces from `@/types` (`api.types.ts`, `seo.types.ts`, `admin.types.ts`). Avoid `any`.
4. **Shared Component Usage**: When introducing buttons, badges, modals, or cards, always import from `@/components/ui` (`Button`, `Badge`, `Card`, `ConfirmationModal`) to maintain visual cohesion.
5. **Standardized Service Layer**: Frontend modules must never invoke `fetch()` with ad-hoc URL constructions. All requests must route through `@/services` using `apiClient`.
6. **Backend Response Normalization**: All Express endpoints must return responses via `sendSuccess(res, data, message)` or `sendError(res, message, statusCode)`.
7. **No Unused Artifacts**: Production builds must never generate or rely on outdated static exports (`out/` folder). Dynamic routing is required for crawler handlers.

### II. Brand & UI Consistency
8. **Universal Brand Assets**: Only official SVGs from `/public/logo/` (`logo-primary.svg`, `logo-dark.svg`, `logo-icon.svg`, `favicon.svg`) are permitted. Ad-hoc CSS boxes for logos are prohibited.
9. **Component Reusability**: Use `<KravionaLogo />` for all logo renderings across the public header, public footer, and admin sidebar.
10. **Design System Adherence**: Colors, borders, typography, and dark-mode gradients must utilize the established Tailwind design tokens (`bg-slate-900`, `border-slate-800`, `text-blue-500`).
11. **Responsive Verification**: Every new UI element or tool interface must be validated at mobile (375px), tablet (768px), and desktop (1280px+) breakpoints.

### III. Adding & Deploying New Tools
12. **Catalog Registration**: Every new utility tool must be defined in `@/config/tools.config.ts` with an id, slug, category (`text`, `seo`, or `image`), title, description, and icon.
13. **Route Implementation**: New tools must implement their interactive user interface under `app/tools/[slug]/page.tsx` or dedicated subroutes, with structured FAQs and how-to guides for SEO.
14. **Client-Side Processing Priority**: Whenever technically viable (e.g. text manipulation, client image conversions), perform computations directly in the browser using Web APIs or Web Workers to minimize server load.
15. **Sitemap Dynamic Inclusion**: Ensure new tool slugs are dynamically indexed and included in `https://kraviona.site/sitemap.xml`.
16. **Pre-Release Testing**: Verify the new tool against edge cases (e.g., empty input, extremely large files, special characters) before marking active in the Admin catalog.

### IV. SEO, Robots & LLM Management
17. **Dynamic Robots Control**: All crawler updates must be performed via `/admin/settings/robots` rather than modifying static files on the server.
18. **Dynamic LLMs Control**: AI ingestion policies and documentation context must be managed through `/admin/settings/llms`.
19. **Structured Data Validation**: Whenever modifying layout metadata or tool templates, test the output URL against Google's Rich Results Test and Schema.org Validator.
20. **Canonical Tag Accuracy**: Confirm every indexable page renders a single, canonical URL pointing directly to `https://kraviona.site<path>`.
21. **Search Console Monitoring**: Perform weekly inspections in Google Search Console for coverage errors, crawling anomalies, or core web vitals regressions.

### V. Custom Code Management & Security Isolation
22. **Admin Isolation**: Third-party scripts must never execute on `/admin/*` routes under any circumstance.
23. **Pre-Save Syntax Validation**: Administrators must run the syntax checker prior to saving custom head or body scripts.
24. **Placement Optimization**: Place pre-render and verification tags in **Head Code**, noscript fallbacks in **Body Start Code**, and heavy chat widgets or telemetry beacons in **Body End Code**.
25. **Emergency Rollback**: In the event of third-party script failure, immediately toggle the affected block to **Disabled** in `/admin/settings/custom-code`.

### VI. Authentication & Administrative Security
26. **Credential Rotation**: Administrator passwords must be rotated every 90 days or immediately upon team departure.
27. **Session Token Expiry**: Backend JWT tokens expire in 7 days; tokens must never be logged or stored in unencrypted client databases.
28. **Audit Log Inspection**: Review the `/admin/activity` audit trail weekly to detect unauthorized access or configuration changes.

### VII. Server, Database & Disaster Recovery
29. **Automated Database Backups**: MongoDB backups must be generated daily via `mongodump` and archived to an offsite secure storage bucket with 30-day retention.
30. **Process Supervision**: Both the Next.js frontend and Express backend must run under PM2 supervision with auto-restart on memory limits (`max_memory_restart`).
31. **Zero-Downtime Deployment**: Use rolling restarts (`pm2 reload ecosystem.config.js`) during updates to guarantee continuous uptime for public visitors.

---

## Part 2: Periodic Maintenance Checklists

### Daily Routine (5-Minute Health Check)
- [ ] Check `/api/health` returns status `200 OK`.
- [ ] Review PM2 process status (`pm2 status`) for restarts or high memory consumption.
- [ ] Check `/admin` dashboard overview for sudden drops in traffic or traffic spikes indicating bot attacks.
- [ ] Verify homepage and top 3 tools load without browser console errors.

### Weekly Routine (Monday Morning Audit)
- [ ] Inspect `/admin/activity` audit logs for unexpected administrative changes.
- [ ] Check Google Search Console for indexing issues, crawler 404s, or mobile usability warnings.
- [ ] Test dynamic `/robots.txt`, `/llms.txt`, and `/sitemap.xml` endpoints using `curl`.
- [ ] Verify that MongoDB automated snapshot backups are completing successfully.
- [ ] Review error logs in `/var/log/pm2/` or local log files for unhandled exceptions.

### Monthly Routine (Deep System Maintenance)
- [ ] Run `npm audit` in both `client` and `backend` directories; patch critical vulnerabilities.
- [ ] Review SSL certificate expiration (managed automatically by Let's Encrypt / Certbot; verify auto-renew timer).
- [ ] Perform a full Lighthouse audit on desktop and mobile to ensure Performance, Accessibility, and SEO scores exceed 90.
- [ ] Prune stale analytics records or temporary files if database storage exceeds 80% capacity.
- [ ] Review and update tool content, FAQs, and schema markup to keep search rankings fresh.

---

## Part 3: Incident Response & Emergency Protocols

### Incident 1: Frontend Down / 502 Bad Gateway
1. SSH into the server: `ssh admin@kraviona.site`.
2. Inspect PM2 status: `pm2 status`.
3. Check error logs: `pm2 logs kraviona-client --lines 50`.
4. Restart frontend: `pm2 restart kraviona-client`.
5. If still failing, check Nginx status: `sudo systemctl status nginx` and reload if necessary: `sudo systemctl reload nginx`.

### Incident 2: Database Connection Loss
1. Check backend logs: `pm2 logs kraviona-backend --lines 50`.
2. Test MongoDB connectivity from server: `mongosh "<MONGO_URI>"`.
3. If using MongoDB Atlas, check MongoDB Status Page for cloud outages and verify server IP whitelist.
4. Restart backend once DB is reachable: `pm2 restart kraviona-backend`.

### Incident 3: Rogue Third-Party Script Breaking Frontend
1. Navigate directly to `https://kraviona.site/admin/settings/custom-code`.
2. Disable the problematic script block (Head, Body Start, or Body End).
3. Click **Save Changes**.
4. Confirm resolution in an Incognito browser window.
