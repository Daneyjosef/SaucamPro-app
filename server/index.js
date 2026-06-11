import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes      from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";
import watchlistRoutes from "./routes/watchlist.js";
import pricesRoutes    from "./routes/prices.js";
import alertsRoutes    from "./routes/alerts.js";
import { startAlertEngine } from "./services/alertEngine.js";

const app  = express();
const PORT = process.env.PORT || 4000;

// ─── CORS ────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow server-to-server / curl requests (no origin header)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ─── Security & parsing ──────────────────────────────────────
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

// ─── Health check (no auth) ──────────────────────────────────
app.get("/health", (_req, res) =>
  res.json({ status: "ok", ts: new Date().toISOString() })
);

// ─── Routes ──────────────────────────────────────────────────
// /api/prices/* is public — no auth middleware applied here
app.use("/api/prices",    pricesRoutes);

// All other routes require a valid Supabase JWT (enforced inside each router)
app.use("/api/auth",      authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/alerts",    alertsRoutes);

// ─── 404 fallback ────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

// ─── Global error handler ────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("[Error]", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Server] SaucamPro API running on http://localhost:${PORT}`);
  startAlertEngine();
});
