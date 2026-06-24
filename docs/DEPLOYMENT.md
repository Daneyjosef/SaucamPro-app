# SaucamPro Deployment Guide

## Architecture

```
saucampro.com        → Vercel (React frontend)
api.saucampro.com    → VPS (Express backend)
                          └── Self-hosted Supabase (Docker, internal)
```

---

## Requirements

✅ VPS has 7.6GB RAM — sufficient for self-hosted Supabase.

---

## Phase 1 — System setup

✅ System updated
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git ufw curl
```

✅ Node.js 20 installed (v20.20.2)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

✅ PM2 installed
```bash
sudo npm install -g pm2
```

✅ Docker installed (v29.6.0) and Docker Compose (v5.2.0)
```bash
# GPG key + apt repo setup, then:
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

✅ Firewall configured
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Phase 2 — Self-hosted Supabase (Docker)

### 2.1 Get the Supabase self-hosted config
```bash
cd /var/www
git clone --depth 1 https://github.com/supabase/supabase.git
cd supabase/docker
cp .env.example .env
```

### 2.2 Generate required secrets
Run each of these and copy the output — you'll paste them into .env:
```bash
# JWT secret
openssl rand -base64 32

# Random Postgres password
openssl rand -base64 24
```

For the ANON_KEY and SERVICE_ROLE_KEY, use the Supabase JWT generator:
- Go to https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys
- Paste your JWT secret into the tool and copy both generated keys

### 2.3 Configure Supabase .env
```bash
nano .env
```

Key values to set:
```
POSTGRES_PASSWORD=<generated above>
JWT_SECRET=<generated above>
ANON_KEY=<generated from JWT tool>
SERVICE_ROLE_KEY=<generated from JWT tool>

SITE_URL=https://yourdomain.com
API_EXTERNAL_URL=https://yourdomain.com
SUPABASE_PUBLIC_URL=https://yourdomain.com

DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=<strong-password>

# SMTP — reuse your existing email settings
SMTP_ADMIN_EMAIL=your-email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SENDER_NAME=SaucamPro
```

### 2.4 Start Supabase
```bash
cd /var/www/supabase/docker
docker compose up -d
```

Wait ~2 minutes, then verify all containers are running:
```bash
docker compose ps
```

Access the Supabase dashboard at `http://YOUR_VPS_IP:8000` to confirm it's up.

---

## Phase 3 — Clone and configure the app

### 3.1 Clone your repo
```bash
cd /var/www
git clone <your-repo-url> saucampro
sudo chown -R $USER:$USER /var/www/saucampro
```

### 3.2 Backend .env
```bash
cd /var/www/saucampro/server
cp .env.example .env
nano .env
```

```
PORT=4000
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=<your ANON_KEY from Phase 2>
SUPABASE_SERVICE_ROLE_KEY=<your SERVICE_ROLE_KEY from Phase 2>
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
COINGECKO_API_KEY=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="SaucamPro Alerts <your-email@gmail.com>"
```

### 3.3 Frontend .env (used only at build time)
```bash
cd /var/www/saucampro
cp .env.example .env
nano .env
```

```
VITE_SUPABASE_URL=https://yourdomain.com
VITE_SUPABASE_ANON_KEY=<your ANON_KEY from Phase 2>
VITE_API_URL=https://yourdomain.com/api
```

### 3.4 Install dependencies and build the frontend
```bash
# Frontend build
cd /var/www/saucampro
npm install
npm run build          # outputs to dist/

# Backend dependencies
cd /var/www/saucampro/server
npm install
```

### 3.5 Start the backend with PM2
```bash
cd /var/www/saucampro/server
pm2 start index.js --name saucampro-api
pm2 save
pm2 startup   # run the printed command to enable auto-start on reboot
```

Verify:
```bash
pm2 status
pm2 logs saucampro-api --lines 20
```

---

## Phase 4 — DNS

In your domain registrar, point the root domain at your VPS:

| Type | Name | Value       |
|------|------|-------------|
| A    | @    | YOUR_VPS_IP |
| A    | www  | YOUR_VPS_IP |

Wait a few minutes, then test:
```bash
ping yourdomain.com   # should resolve to your VPS IP
```

---

## Phase 5 — Nginx

### 5.1 Create config
```bash
sudo nano /etc/nginx/sites-available/saucampro
```

Paste this (replace `yourdomain.com`):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # React frontend — serve static files, fallback to index.html for SPA routing
    root /var/www/saucampro/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Express backend API
    location /api/ {
        proxy_pass http://localhost:4000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # Self-hosted Supabase (Kong gateway on port 8000)
    location /auth/ {
        proxy_pass http://localhost:8000/auth/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /rest/ {
        proxy_pass http://localhost:8000/rest/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /storage/ {
        proxy_pass http://localhost:8000/storage/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5.2 Enable and test
```bash
sudo ln -s /etc/nginx/sites-available/saucampro /etc/nginx/sites-enabled/
sudo nginx -t           # must say "syntax is ok"
sudo systemctl reload nginx
```

---

## Phase 6 — SSL

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Test:
```bash
curl https://yourdomain.com
curl https://yourdomain.com/api/health
```

---

## Phase 7 — Migrate data from hosted Supabase

### 7.1 Export from hosted Supabase (run on your local machine)
```bash
# Install Supabase CLI
npm install -g supabase

# Export schema (tables, indexes, RLS policies)
supabase db dump --db-url "postgresql://postgres:<db-password>@<db-host>:5432/postgres" -f schema.sql

# Export data
supabase db dump --db-url "postgresql://postgres:<db-password>@<db-host>:5432/postgres" --data-only -f data.sql
```

> Find your DB connection string at: Supabase Dashboard → Project Settings → Database → URI

### 7.2 Copy files to VPS
```bash
scp schema.sql data.sql user@YOUR_VPS_IP:/tmp/
```

### 7.3 Import into self-hosted Postgres
```bash
# SSH into VPS
ssh user@YOUR_VPS_IP

# Import
docker exec -i supabase-db psql -U postgres < /tmp/schema.sql
docker exec -i supabase-db psql -U postgres < /tmp/data.sql
```

### 7.4 Re-enable RLS on tables
Open the SQL editor in your self-hosted Supabase dashboard (`https://yourdomain.com` → Studio):
```sql
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
```

---

## Phase 8 — Smoke test

1. Visit `https://yourdomain.com` — React app loads
2. Sign up / log in — auth works through self-hosted Supabase
3. Portfolio, watchlist, and alerts load data correctly
4. Create a price alert — backend processes it
5. Check logs for errors:
```bash
pm2 logs saucampro-api
docker compose -f /var/www/supabase/docker/docker-compose.yml logs --tail=50
```

---

## Ongoing maintenance

### Deploy updates
```bash
cd /var/www/saucampro
git pull

# Rebuild frontend (always needed after frontend changes)
npm install        # only if package.json changed
npm run build

# Restart backend (only needed after backend changes)
cd server
npm install        # only if package.json changed
pm2 restart saucampro-api
```

### Useful commands
```bash
pm2 status                                                          # backend health
pm2 logs saucampro-api                                              # backend logs
sudo systemctl status nginx                                         # nginx health
docker compose -f /var/www/supabase/docker/docker-compose.yml ps   # supabase containers
sudo certbot renew --dry-run                                        # test SSL renewal
```

---

## Checklist

- [ ] Phase 1 — System setup (Node, PM2, Docker, Nginx, firewall)
- [ ] Phase 2 — Self-hosted Supabase running in Docker
- [ ] Phase 3 — App cloned, env vars set, frontend built, backend on PM2
- [ ] Phase 4 — DNS A records pointing to VPS
- [ ] Phase 5 — Nginx configured (frontend + /api + Supabase routes)
- [ ] Phase 6 — SSL certificate installed
- [ ] Phase 7 — Data migrated from hosted Supabase
- [ ] Phase 8 — Smoke tested end to end
