import { Router } from "express";
import {
  getMarkets,
  getMarketChart,
  getCoin,
  getGlobal,
} from "../services/coinGecko.js";

const router = Router();

// No auth required — public proxy endpoints.
// All responses are served from the in-memory node-cache to stay
// well inside CoinGecko's free-tier rate limits.

// ─────────────────────────────────────────────────────────────
// GET /api/prices/markets
// Query params: currency, page, perPage, order, sparkline, category
// ─────────────────────────────────────────────────────────────
router.get("/markets", async (req, res) => {
  try {
    const {
      currency = "usd",
      page = 1,
      perPage = 20,
      order = "market_cap_desc",
      sparkline = "false",
      category,
    } = req.query;

    const data = await getMarkets({
      currency,
      page: Number(page),
      perPage: Math.min(Number(perPage), 250), // CoinGecko cap
      order,
      sparkline: sparkline === "true",
      category: category || undefined,
    });

    res.set("Cache-Control", "public, max-age=30");
    res.json(data);
  } catch (err) {
    console.error("[prices/markets]", err.message);
    res.status(502).json({ error: "Failed to fetch market data" });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/prices/chart/:coinId
// Query params: days, currency
// ─────────────────────────────────────────────────────────────
router.get("/chart/:coinId", async (req, res) => {
  try {
    const { days = "30", currency = "usd" } = req.query;
    const data = await getMarketChart(req.params.coinId, { currency, days });

    res.set("Cache-Control", "public, max-age=30");
    res.json(data);
  } catch (err) {
    console.error("[prices/chart]", err.message);
    res.status(502).json({ error: "Failed to fetch chart data" });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/prices/coin/:coinId
// Full coin metadata including market_data.
// ─────────────────────────────────────────────────────────────
router.get("/coin/:coinId", async (req, res) => {
  try {
    const data = await getCoin(req.params.coinId);

    res.set("Cache-Control", "public, max-age=300"); // 5 min — metadata is stable
    res.json(data);
  } catch (err) {
    console.error("[prices/coin]", err.message);
    const status = err.response?.status === 404 ? 404 : 502;
    res.status(status).json({ error: status === 404 ? "Coin not found" : "Failed to fetch coin data" });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/prices/global
// Global crypto market stats.
// ─────────────────────────────────────────────────────────────
router.get("/global", async (req, res) => {
  try {
    const data = await getGlobal();

    res.set("Cache-Control", "public, max-age=300");
    res.json(data);
  } catch (err) {
    console.error("[prices/global]", err.message);
    res.status(502).json({ error: "Failed to fetch global data" });
  }
});

export default router;
