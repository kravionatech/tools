# Kraviona Troubleshooting & Diagnostic Guide

This guide provides step-by-step diagnostic workflows and solutions for resolving common production and development issues across the Kraviona stack.

---

## 1. Quick Diagnostic Flowchart

```
Issue Detected
  ├── Cannot Access Admin -> Check Section 2 (Authentication & JWT)
  ├── 502 Bad Gateway / Network Error -> Check Section 3 (Port & Process Status)
  ├── MongoDB Connection Failure -> Check Section 4 (Database Connectivity)
  ├── CORS or Mixed Content Error -> Check Section 5 (CORS & Domain Config)
  ├── Search Engine / Crawler Failure -> Check Section 6 (Robots, LLMs & Sitemap)
  └── Client Build / TypeScript Failure -> Check Section 7 (Build Diagnostics)
```

---

## 2. Admin Authentication & Session Issues

### Symptom: Redirected back to `/admin/login` repeatedly
- **Cause**: JWT token has expired, is malformed, or backend `JWT_SECRET` has changed.
- **Resolution**:
  1. Open Chrome DevTools -> Application -> Local Storage -> Clear `token` and `user`.
  2. Confirm backend `.env` contains a persistent `JWT_SECRET`. If `JWT_SECRET` changes on server restart, all previous user sessions are invalidated.
  3. Verify the browser system clock is synchronized (skewed clocks invalidate JWT timestamps).

---

## 3. Port & Process Management

### Symptom: `Error: listen EADDRINUSE: address already in use :::5000` (or `:::3000`)
- **Cause**: A previous instance of the server was not properly terminated.
- **Resolution (Windows PowerShell)**:
  ```powershell
  # Find PID occupying port 5000
  Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess
  # Terminate process by PID
  Stop-Process -Id <PID> -Force
  ```
- **Resolution (Linux / macOS)**:
  ```bash
  sudo lsof -i :5000
  sudo kill -9 <PID>
  ```

### Symptom: PM2 Process Repeatedly Restarts (Status: `errored`)
- **Inspection**:
  ```bash
  pm2 logs kraviona-backend --lines 50
  pm2 logs kraviona-client --lines 50
  ```

---

## 4. Database Connectivity (MongoDB)

### Symptom: `MongooseServerSelectionError: connect ECONNREFUSED`
- **Causes**:
  - Local MongoDB service (`mongod`) is stopped.
  - MongoDB Atlas IP Access List does not allow the server IP address.
  - Invalid connection string in `MONGO_URI`.
- **Resolution**:
  1. If using MongoDB Atlas: Log in to Atlas Console -> **Network Access** -> Ensure server IP or `0.0.0.0/0` is whitelisted.
  2. Verify credentials in `backend/.env`:
     ```env
     MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/kraviona?retryWrites=true&w=majority
     ```
  3. Test connection directly using `mongosh`:
     ```bash
     mongosh "<MONGO_URI>"
     ```

---

## 5. CORS & Domain Migration Conflicts

### Symptom: `Cross-Origin Request Blocked (Reason: CORS header 'Access-Control-Allow-Origin' missing)`
- **Cause**: Backend `CLIENT_URL` in `backend/.env` does not match the frontend origin requesting the API.
- **Resolution**:
  1. Verify `backend/.env`:
     ```env
     CLIENT_URL=https://kraviona.site
     ```
  2. Check `backend/app/app.js` CORS options:
     ```javascript
     const allowedOrigins = [
       process.env.CLIENT_URL,
       'https://kraviona.site',
       'http://localhost:3000'
     ];
     ```

### Symptom: Mixed Content Warning in Browser Console
- **Cause**: Assets or API calls are using `http://` instead of `https://`.
- **Resolution**:
  1. Ensure `NEXT_PUBLIC_SITE_URL=https://kraviona.site`.
  2. Ensure all API calls route through `https://kraviona.site/api` or relative paths `/api/*`.

---

## 6. Robots.txt, LLMs.txt & Sitemap Diagnostic

### Symptom: Google Search Console reports "Robots.txt unreachable" or "Sitemap format error"
- **Diagnostics**:
  1. Check HTTP response codes and Content-Type:
     ```bash
     curl -I https://kraviona.site/robots.txt
     # Expected: HTTP/2 200, Content-Type: text/plain; charset=utf-8

     curl -I https://kraviona.site/llms.txt
     # Expected: HTTP/2 200, Content-Type: text/plain; charset=utf-8

     curl -I https://kraviona.site/sitemap.xml
     # Expected: HTTP/2 200, Content-Type: application/xml
     ```
  2. Verify domain reference within output:
     ```bash
     curl -s https://kraviona.site/robots.txt | grep "Sitemap"
     # Must return: Sitemap: https://kraviona.site/sitemap.xml
     ```
  3. If robots output is stale:
     - Log in to `/admin/settings/robots`.
     - Click **Save Changes** to refresh database cache.

---

## 7. Next.js Build & Static Export Errors

### Symptom: `Error: Page with `dynamic = "force-dynamic"` couldn't be exported`
- **Cause**: `output: "export"` is enabled in `next.config.ts`. Next.js static exports cannot support dynamic server route handlers like `/llms.txt/route.ts` or dynamic server rendering.
- **Resolution**:
  - Keep `next.config.ts` without `output: "export"` for standard Node.js server deployment. Kraviona utilizes dynamic server capabilities for realtime crawler responses and custom code injection.

---

## 8. Custom Code Injection Issues

### Symptom: Custom script does not execute on website
1. Verify section toggle is **Enabled** in `/admin/settings/custom-code`.
2. Inspect page source:
   - Head scripts: Search for script tag inside `<head>`.
   - Body scripts: Search for script tag at beginning or end of `<body>`.
3. Check browser console for AdBlock or Content Security Policy (CSP) blocking external domains.
4. Remember: Scripts are deliberately isolated and will **never** execute on `/admin/*` routes.
