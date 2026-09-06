# Kraviona Production Deployment Guide

This guide describes how to deploy **Kraviona Tools** to a Linux production server (Ubuntu/Debian VPS, Docker, or Cloud VM) using **Nginx**, **PM2**, and **Let's Encrypt SSL** under `https://kraviona.site`.

---

## 1. System Requirements & Architecture

- **Operating System**: Ubuntu 22.04 LTS or newer
- **Node.js**: v18.17.0+ or v20.x LTS
- **Package Manager**: npm v9+
- **Database**: MongoDB v5.0+ (Local or MongoDB Atlas)
- **Web Server / Reverse Proxy**: Nginx with HTTP/2 and Let's Encrypt Certbot
- **Process Manager**: PM2

```
                       [Internet / Clients]
                                |
                   [Cloudflare / DNS (Optional)]
                                |
                       [Nginx Reverse Proxy]
                       (Port 80/443 SSL SNI)
                                |
             +------------------+------------------+
             |                                     |
   Route: /api/* -> Port 5000            Route: /* -> Port 3000
  [Express API / Node.js Engine]        [Next.js 16 Production Server]
             |
     [MongoDB Database]
```

---

## 2. Server Preparation

```bash
# Update system repositories
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git certbot python3-certbot-nginx

# Install PM2 globally
sudo npm install -g pm2
```

---

## 3. Environment Variables Configuration

### 3.1 Backend Configuration (`backend/.env`)
Create `backend/.env`:
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/kraviona?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_random_64_character_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=https://kraviona.site
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### 3.2 Client Configuration (`client/.env.production`)
Create `client/.env.production`:
```env
NEXT_PUBLIC_SITE_URL=https://kraviona.site
NEXT_PUBLIC_API_URL=https://kraviona.site/api
PORT=3000
NODE_ENV=production
```

> [!IMPORTANT]
> Never hardcode `https://kraviona.com` or local ports in production environment files. Always ensure `NEXT_PUBLIC_SITE_URL=https://kraviona.site`.

---

## 4. Build & Installation

```bash
# Clone the repository
git clone https://github.com/your-org/kraviona_tools.git /var/www/kraviona
cd /var/www/kraviona

# Install backend dependencies
cd /var/www/kraviona/backend
npm ci --omit=dev

# Install frontend dependencies and create production build
cd /var/www/kraviona/client
npm ci
npm run build
```

---

## 5. Process Management with PM2

Create an `ecosystem.config.js` in `/var/www/kraviona`:
```javascript
module.exports = {
  apps: [
    {
      name: 'kraviona-backend',
      cwd: '/var/www/kraviona/backend',
      script: 'app/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      max_memory_restart: '500M',
      error_file: '/var/log/pm2/kraviona-backend-error.log',
      out_file: '/var/log/pm2/kraviona-backend-out.log',
    },
    {
      name: 'kraviona-client',
      cwd: '/var/www/kraviona/client',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/kraviona-client-error.log',
      out_file: '/var/log/pm2/kraviona-client-out.log',
    }
  ]
};
```

Start and persist PM2 services:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 6. Nginx Reverse Proxy Configuration

Create `/etc/nginx/sites-available/kraviona.site`:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name kraviona.site www.kraviona.site;

    # Redirect all HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name kraviona.site www.kraviona.site;

    # SSL certificates managed by Certbot
    ssl_certificate /etc/letsencrypt/live/kraviona.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kraviona.site/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # Express API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js Static Assets Caching
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Next.js Application Proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site configuration and issue SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/kraviona.site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Issue Let's Encrypt SSL
sudo certbot --nginx -d kraviona.site -d www.kraviona.site
```

---

## 7. Post-Deployment Verification

Verify key endpoints are live and healthy:
```bash
# 1. Express health check
curl -I https://kraviona.site/api/health

# 2. Dynamic robots.txt
curl -s https://kraviona.site/robots.txt | grep "kraviona.site"

# 3. Dynamic llms.txt
curl -s https://kraviona.site/llms.txt | grep "kraviona.site"

# 4. Dynamic sitemap.xml
curl -s https://kraviona.site/sitemap.xml | grep "https://kraviona.site"
```
