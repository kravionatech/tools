# Kraviona REST API Specification

**Base URL**: `http://localhost:5000` (or your production API origin)  
**Authentication**: Bearer JWT (`Authorization: Bearer <token>`)

All JSON API responses conform to the standard response envelope:

```json
{
  "success": true,
  "message": "Human-readable status summary",
  "data": {}
}
```

In the event of an error:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message or stack trace"
}
```

---

## 1. Authentication Endpoints

### `POST /api/auth/login`
Authenticates an administrator and returns a session JWT.

- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "admin@kraviona.site",
    "password": "StrongAdminPassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "email": "admin@kraviona.site",
      "name": "Kraviona Admin"
    }
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  {
    "success": false,
    "message": "Invalid email or password"
  }
  ```

---

## 2. Dynamic SEO & Crawler Endpoints

### `GET /api/seo/robots.txt`
Returns raw plaintext `robots.txt` directives for search engine crawlers.

- **Auth Required**: No
- **Content-Type**: `text/plain; charset=utf-8`
- **Response**:
  ```txt
  User-agent: *
  Allow: /
  Disallow: /admin/
  Disallow: /api/admin/
  Disallow: /dashboard/
  Disallow: /login/
  Disallow: /private/

  Sitemap: https://kraviona.site/sitemap.xml
  ```

### `GET /api/seo/llms.txt`
Returns raw Markdown formatted context for AI agents and LLM search engines.

- **Auth Required**: No
- **Content-Type**: `text/plain; charset=utf-8`
- **Response**:
  ```markdown
  # Kraviona
  > Kraviona is a professional SEO tools and digital productivity platform.
  ## Website
  - Homepage: https://kraviona.site/
  ```

### `GET /api/settings/seo/admin/robots`
Retrieves current robots configuration for the admin panel.

- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Robots settings loaded",
    "config": {
      "enabled": true,
      "allowIndexing": true,
      "blockAllCrawlers": false,
      "allowRules": ["/"],
      "disallowRules": ["/admin/", "/dashboard/", "/login/"],
      "sitemapUrl": "https://kraviona.site/sitemap.xml",
      "customDirectives": ""
    },
    "generated": "User-agent: *\nAllow: /\n..."
  }
  ```

### `PUT /api/settings/seo/admin/robots`
Updates crawler rules and regenerates robots.txt.

- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body**:
  ```json
  {
    "enabled": true,
    "allowIndexing": true,
    "blockAllCrawlers": false,
    "allowRules": ["/"],
    "disallowRules": ["/admin/", "/dashboard/"],
    "sitemapUrl": "https://kraviona.site/sitemap.xml",
    "customDirectives": ""
  }
  ```

### `GET /api/settings/seo/admin/llms`
Retrieves current LLMs.txt configuration.

- **Auth Required**: Yes (`Bearer <token>`)

### `PUT /api/settings/seo/admin/llms`
Updates LLMs.txt resources, brand introduction, and instructions.

- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body**:
  ```json
  {
    "title": "Kraviona",
    "description": "Professional SEO tools and digital productivity platform.",
    "brandIntro": "",
    "homepageUrl": "https://kraviona.site/",
    "resources": [
      {
        "title": "SEO Audit Tool",
        "url": "https://kraviona.site/tools/seo",
        "description": "On-page SEO audit",
        "category": "Tools",
        "enabled": true
      }
    ],
    "customInstructions": "Use content as reference."
  }
  ```

---

## 3. Custom Code Management Endpoints

### `GET /api/settings/custom-code`
Retrieves all configured custom code snippets and tracking IDs.

- **Auth Required**: Yes (`Bearer <token>`)

### `PUT /api/settings/custom-code`
Updates head, bodyStart, bodyEnd code and GTM / GA4 / Meta Pixel presets.

- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body**:
  ```json
  {
    "head": { "enabled": true, "code": "<meta ...>", "scope": "sitewide" },
    "bodyStart": { "enabled": true, "code": "", "scope": "sitewide" },
    "bodyEnd": { "enabled": true, "code": "", "scope": "sitewide" },
    "gtm": { "enabled": true, "containerId": "GTM-XXXXXXX" },
    "ga4": { "enabled": true, "measurementId": "G-XXXXXXXXXX" },
    "metaPixel": { "enabled": false, "pixelId": "" }
  }
  ```

### `POST /api/settings/custom-code/validate`
Validates HTML syntax and verifies balancing of `<script>` tags.

- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body**:
  ```json
  { "code": "<script>console.log('test');</script>" }
  ```
- **Response (200 OK)**:
  ```json
  {
    "valid": true,
    "errors": [],
    "warnings": []
  }
  ```

### `GET /api/settings/custom-code/public`
Public endpoint consumed by `CustomCodeInjector.tsx` to safely inject enabled snippets on public pages. Zero admin metadata is returned.

- **Auth Required**: No

---

## 4. Analytics Endpoints

### `POST /api/analytics/track`
Collects anonymous, aggregated usage statistics (no personally identifiable information).

- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "eventType": "pageview",
    "path": "/tools/word-counter",
    "referrer": "https://www.google.com/",
    "toolSlug": "word-counter"
  }
  ```

### `GET /api/analytics/overview`
Returns summary metrics (total page views, unique visitors, top tools) for a given date window.

- **Auth Required**: Yes (`Bearer <token>`)
- **Query Parameters**:
  - `days`: Number of days to query (default: `30`)
