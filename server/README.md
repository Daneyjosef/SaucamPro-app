# SaucamPro — Backend API

Express.js REST API for SaucamPro. Runs on **port 4000**, requires Node.js ≥ 20.

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 (ESM) |
| Framework | Express 4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase JWT (`supabase.auth.getUser`) |
| Cache | node-cache (in-memory, 30 s / 5 min TTL) |
| Scheduler | node-cron (alert engine every 60 s) |
| Email | Nodemailer (SMTP) |
| Security | helmet, cors |

---

## Folder structure

```
server/
├── index.js               Entry point — mounts routes, starts cron
├── .env.example           Environment variable template
├── lib/
│   └── supabase.js        Anon + service-role Supabase clients
├── middleware/
│   └── auth.js            verifySupabaseJWT middleware
├── routes/
│   ├── auth.js            GET /api/auth/me
│   ├── portfolio.js       CRUD /api/portfolio
│   ├── watchlist.js       CRUD /api/watchlist
│   ├── prices.js          Public CoinGecko proxy /api/prices/*
│   └── alerts.js          CRUD /api/alerts
└── services/
    ├── coinGecko.js       Cached CoinGecko API wrapper
    ├── mailer.js          Nodemailer SMTP helper
    └── alertEngine.js     node-cron price-alert checker
```

---

## 1 — Database setup (Supabase SQL Editor)

Run the following SQL in your Supabase project's **SQL Editor**:

```sql
-- ── portfolios ────────────────────────────────────────────
CREATE TABLE portfolios (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  coin_id        TEXT        NOT NULL,
  coin_symbol    TEXT        NOT NULL,
  amount         DECIMAL(24,8) NOT NULL CHECK (amount > 0),
  avg_buy_price  DECIMAL(24,8) NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "portfolio_owner_only" ON portfolios
  FOR ALL USING (auth.uid() = user_id);

-- ── watchlists ────────────────────────────────────────────
CREATE TABLE watchlists (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  coin_id     TEXT        NOT NULL,
  coin_symbol TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, coin_id)
);

ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "watchlist_owner_only" ON watchlists
  FOR ALL USING (auth.uid() = user_id);

-- ── price_alerts ──────────────────────────────────────────
CREATE TABLE price_alerts (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  coin_id       TEXT        NOT NULL,
  coin_symbol   TEXT        NOT NULL,
  target_price  DECIMAL(24,8) NOT NULL CHECK (target_price > 0),
  direction     TEXT        NOT NULL CHECK (direction IN ('above', 'below')),
  triggered     BOOLEAN     NOT NULL DEFAULT false,
  triggered_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "alerts_owner_only" ON price_alerts
  FOR ALL USING (auth.uid() = user_id);

-- ── Index for alert engine query ──────────────────────────
CREATE INDEX idx_alerts_pending ON price_alerts (triggered) WHERE triggered = false;
```

---

## 2 — Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_ANON_KEY` | Same page → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → service_role secret key (**never expose client-side**) |
| `CORS_ORIGINS` | Comma-separated frontend URLs (e.g. `http://localhost:5173`) |
| `COINGECKO_API_KEY` | Optional — CoinGecko Pro key |
| `SMTP_*` | Your SMTP provider credentials (Gmail App Password recommended) |

---

## 3 — Install & run

```bash
# From the server/ directory
npm install

# Development (auto-restarts on file changes — Node 20+)
npm run dev

# Production
npm start
```

The API starts on **http://localhost:4000**.

---

## 4 — API reference

### Auth (protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/auth/me` | Returns authenticated user profile |

### Portfolio (protected)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/portfolio` | — | List all holdings |
| POST | `/api/portfolio` | `{ coin_id, coin_symbol, amount, avg_buy_price }` | Add a holding |
| PUT | `/api/portfolio/:id` | `{ amount?, avg_buy_price? }` | Update a holding |
| DELETE | `/api/portfolio/:id` | — | Remove a holding |

### Watchlist (protected)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/watchlist` | — | List all watchlist coins |
| POST | `/api/watchlist` | `{ coin_id, coin_symbol }` | Add a coin |
| DELETE | `/api/watchlist/:coinId` | — | Remove a coin |

### Price alerts (protected)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/alerts` | — | List all alerts |
| POST | `/api/alerts` | `{ coin_id, coin_symbol, target_price, direction }` | Create alert (`direction`: `"above"` or `"below"`) |
| DELETE | `/api/alerts/:id` | — | Delete an alert |

### Price proxy (public — no auth)

| Method | Endpoint | Query params | Description |
|---|---|---|---|
| GET | `/api/prices/markets` | `currency`, `page`, `perPage`, `order`, `sparkline`, `category` | Top coins list |
| GET | `/api/prices/chart/:coinId` | `days`, `currency` | OHLC / price history |
| GET | `/api/prices/coin/:coinId` | — | Full coin metadata |
| GET | `/api/prices/global` | — | Global market stats |

All price endpoints are served from a 30-second in-memory cache (5 minutes for metadata).

---

## 5 — Authentication

Every **protected** endpoint requires:

```
Authorization: Bearer <supabase_access_token>
```

The token is the `session.access_token` from `supabase.auth.getSession()` on the frontend. The middleware calls `supabase.auth.getUser(token)` to verify it — no custom JWT secrets needed.

---

## 6 — Price Alert Engine

- Runs every **60 seconds** via `node-cron`
- Queries all `triggered = false` alerts from the database
- Batch-fetches current USD prices from CoinGecko `/simple/price`
- Compares each alert's `target_price` / `direction` against the live price
- On trigger: marks the row `triggered = true`, looks up the user's email via the Supabase Admin API, and sends an HTML email via Nodemailer
- The engine overlapping-run guard ensures a slow CoinGecko response doesn't cause concurrent executions

---

## 7 — Deploying to Railway / Render / Fly.io

1. Point the deploy target at the `server/` directory (or repo root if you move `server/` up)
2. Set all environment variables in the platform's dashboard
3. Start command: `node index.js`
4. Add your deployed API URL to `CORS_ORIGINS` and set `VITE_API_URL` in the frontend

---

## Health check

```bash
curl http://localhost:4000/health
# {"status":"ok","ts":"2026-06-11T..."}
```
