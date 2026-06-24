# Architecture Decisions

## 1. Per-request user-scoped Supabase client in route handlers

**Date:** 2026-06-24

**Decision:** Route handlers create a fresh Supabase client per request using the
user's JWT, via `getUserClient(req.token)` from `server/lib/supabase.js`.

**Why:**
The Express backend verifies the user's JWT in `middleware/auth.js` before any
route handler runs. When the route then queries Supabase, it needs to send that
same JWT so that PostgREST resolves `auth.uid()` correctly inside RLS policies.

If we used the shared `anonClient` (anon key) instead, `auth.uid()` would return
`null` — causing every INSERT/SELECT to fail the RLS check with
`"new row violates row-level security policy"`.

Using `adminClient` (service role) would bypass RLS entirely. It works, but
removes the database-level security layer — if Express auth were ever bypassed,
there'd be nothing stopping a user from reading or writing other users' rows.

**Pattern:**
```js
// server/lib/supabase.js
export function getUserClient(token) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

// In any route handler (token attached by auth middleware):
const db = getUserClient(req.token);
const { data, error } = await db.from("watchlists").select("*")...
```

**Security layers:**
1. Express middleware verifies JWT before the handler runs
2. Supabase RLS enforces `auth.uid() = user_id` at the database level
3. Routes still filter explicitly by `user_id` as a third check

---

## 2. Server hooks for all data operations (not direct Supabase)

**Date:** 2026-06-24

**Decision:** Frontend pages import from `hooks/*.server.js` (which call the
Express API) rather than `hooks/*.js` (which call Supabase directly).

**Why:**
During development, the direct Supabase hooks were used for convenience — no
backend needed to be running. On production, all data operations should go
through the Express backend so we have one place for rate limiting, logging,
and business logic.

The `.server.js` hook variants exist specifically for this — same interface,
different transport.

**Affected files:**
- `src/pages/Dashboard.jsx`
- `src/pages/Portfolio.jsx`
- `src/pages/Watchlist.jsx`
- `src/pages/Markets.jsx`

**Local dev:** Run both `npm run dev` (frontend) and `cd server && npm run dev`
(backend). Local `server/.env` points to hosted Supabase free tier.

---

## 3. Supabase auth proxied through api.saucampro.com

**Date:** 2026-06-24

**Decision:** Nginx on the VPS proxies `/auth/` to the self-hosted Supabase
Kong gateway at `localhost:8000`. The frontend's `VITE_SUPABASE_URL` is set
to `https://api.saucampro.com`.

**Why:**
The frontend (on Vercel) needs to talk to Supabase for auth flows (login,
signup, password reset). Since Supabase is self-hosted on the VPS, it must be
reachable via a public HTTPS endpoint. Routing it through `api.saucampro.com`
keeps everything under one domain with one SSL cert.
