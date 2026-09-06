# Complete Domain Migration Guide: kraviona.com → kraviona.site

This document outlines the complete domain migration procedures, redirect strategies, Google Search Console change of address steps, and post-migration verification for switching from `https://kraviona.com` to `https://kraviona.site`.

---

## 1. Migration Architecture Summary

| Factor | Old Configuration | New Configuration |
|---|---|---|
| **Primary Domain** | `https://kraviona.com` | `https://kraviona.site` |
| **Site Config** | Hardcoded | `NEXT_PUBLIC_SITE_URL=https://kraviona.site` |
| **Robots Directives** | Static file | Dynamic `/robots.txt` (`client/app/robots.ts`) |
| **LLM Context** | Static | Dynamic `/llms.txt` (`client/app/llms.txt/route.ts`) |
| **Sitemap** | Static | Dynamic `/sitemap.xml` (`client/app/sitemap.ts`) |
| **Admin Controls** | Code edits | `/admin/settings/robots` & `/admin/settings/llms` |

---

## 2. 301 Permanent Redirect Implementation

To preserve SEO authority, PageRank, and external backlink equity, every URL on `kraviona.com` must permanently redirect (HTTP 301) to the exact corresponding path on `kraviona.site`.

### Option A: Cloudflare (Recommended & Instant)
If `kraviona.com` is managed in Cloudflare:
1. Navigate to **Rules → Redirect Rules**.
2. Click **Create rule**.
3. Set rule name: `Redirect kraviona.com to kraviona.site`.
4. Expression:
   ```text
   (http.host eq "kraviona.com" or http.host eq "www.kraviona.com")
   ```
5. Type: **Dynamic**.
6. Status code: **301 (Permanent Redirect)**.
7. Target URL:
   ```text
   concat("https://kraviona.site", http.request.uri.path)
   ```
8. Preserve query string: **Yes**.

### Option B: Nginx Reverse Proxy
```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name kraviona.com www.kraviona.com;

    ssl_certificate /etc/letsencrypt/live/kraviona.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kraviona.com/privkey.pem;

    # 301 Permanent Redirect to new domain
    return 301 https://kraviona.site$request_uri;
}
```

### Option C: Vercel / Netlify
Add to `vercel.json` (on the old domain repository or deployment):
```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://kraviona.site/$1",
      "permanent": true
    }
  ]
}
```

---

## 3. Google Search Console: Change of Address Tool

1. **Verify both properties in Google Search Console**:
   - `https://kraviona.com` (Old domain)
   - `https://kraviona.site` (New domain)
2. Open the property for `https://kraviona.com`.
3. Go to **Settings → Change of address**.
4. In the dropdown, select the new verified property: `https://kraviona.site`.
5. Google will automatically run pre-flight checks (verifying 301 redirects are working).
6. Click **Confirm & Submit**.
7. Google will transfer indexation and search rankings to `kraviona.site`.

---

## 4. Submitting the New Sitemap

1. Open the property for `https://kraviona.site` in Google Search Console.
2. In the sidebar, select **Sitemaps**.
3. Under *Add a new sitemap*, enter:
   ```text
   sitemap.xml
   ```
4. Click **Submit**.
5. Wait for the status to change to **Success**.

Repeat this process for Bing Webmaster Tools (`https://www.bing.com/webmasters`).

---

## 5. Verification & Health Checks

Run these commands to verify that all endpoints respond with HTTP 200 and return the correct `kraviona.site` URLs:

```bash
# Verify robots.txt
curl -I https://kraviona.site/robots.txt

# Verify llms.txt
curl -I https://kraviona.site/llms.txt

# Verify sitemap.xml
curl -I https://kraviona.site/sitemap.xml

# Verify 301 redirect from old domain
curl -I https://kraviona.com/tools/seo
# Should return HTTP 301 Location: https://kraviona.site/tools/seo
```

---

## 6. How to Change Domain in the Future

If you ever need to migrate to a new domain again:
1. Update `NEXT_PUBLIC_SITE_URL` in `client/.env` and `client/next.config.ts`:
   ```env
   NEXT_PUBLIC_SITE_URL=https://newdomain.com
   ```
2. Update `SITE_URL` and `FRONTEND_URL` in `backend/.env`.
3. Rebuild the application (`npm run build`).
4. All canonical tags, structured JSON-LD data, sitemaps, robots.txt, and llms.txt will instantly update across the platform.
