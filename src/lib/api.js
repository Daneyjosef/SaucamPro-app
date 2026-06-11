import axios from "axios";
import { API_BASE_URL } from "./constants";

// In-memory cache with TTL to avoid redundant requests
const cache = new Map();
const pendingRequests = new Map();

function cacheKey(url, params) {
  return `${url}|${JSON.stringify(params || {})}`;
}

async function cachedRequest(axiosInstance, url, params = {}, ttl = 30000) {
  const key = cacheKey(url, params);

  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < ttl) return cached.data;

  if (pendingRequests.has(key)) return pendingRequests.get(key);

  const promise = axiosInstance
    .get(url, { params })
    .then((res) => {
      cache.set(key, { data: res.data, ts: Date.now() });
      pendingRequests.delete(key);
      return res.data;
    })
    .catch((err) => {
      pendingRequests.delete(key);
      throw err;
    });

  pendingRequests.set(key, promise);
  return promise;
}

// Backend price proxy — all main price data routes through here
const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const pricesApi = axios.create({
  baseURL: `${BACKEND_URL}/api/prices`,
  timeout: 15000,
  headers: { Accept: "application/json" },
});

// Direct CoinGecko — used only for search, trending, categories, and by-ids
const cgApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { Accept: "application/json" },
});

// ─── Price proxy endpoints ────────────────────────────────────

export const fetchGlobalData = async () => {
  const data = await cachedRequest(pricesApi, "/global", {}, 5 * 60 * 1000);
  return data.data;
};

export const fetchCoins = async ({
  currency = "usd",
  page = 1,
  perPage = 20,
  order = "market_cap_desc",
  sparkline = false,
  category,
} = {}) => {
  const params = {
    currency,
    page,
    perPage,
    order,
    sparkline: String(sparkline),
  };
  if (category && category !== "all") params.category = category;
  return cachedRequest(pricesApi, "/markets", params, 30 * 1000);
};

export const fetchCoinById = async (id) => {
  return cachedRequest(pricesApi, `/coin/${id}`, {}, 60 * 1000);
};

export const fetchMarketChart = async (id, { currency = "usd", days = "7" } = {}) => {
  return cachedRequest(pricesApi, `/chart/${id}`, { days, currency }, 30 * 1000);
};

export const fetchTopMovers = async ({ currency = "usd" } = {}) => {
  const data = await cachedRequest(
    pricesApi,
    "/markets",
    { currency, order: "volume_desc", perPage: "50", sparkline: "false" },
    30 * 1000
  );
  return data
    .sort(
      (a, b) =>
        Math.abs(b.price_change_percentage_24h) -
        Math.abs(a.price_change_percentage_24h)
    )
    .slice(0, 8);
};

// ─── Direct CoinGecko endpoints ───────────────────────────────

export const fetchTrending = async () => {
  const data = await cachedRequest(cgApi, "/search/trending", {}, 5 * 60 * 1000);
  return data.coins;
};

export const searchCoins = async (query) => {
  const data = await cachedRequest(cgApi, "/search", { query }, 60 * 1000);
  return data.coins;
};

export const fetchCategories = async () => {
  return cachedRequest(cgApi, "/coins/categories", {}, 10 * 60 * 1000);
};

export const fetchCoinsByIds = async ({
  ids = [],
  currency = "usd",
  sparkline = false,
} = {}) => {
  if (!ids.length) return [];
  return cachedRequest(
    cgApi,
    "/coins/markets",
    {
      vs_currency: currency,
      ids: ids.join(","),
      order: "market_cap_desc",
      per_page: 20,
      page: 1,
      sparkline,
      price_change_percentage: "7d",
    },
    30 * 1000
  );
};

// Evict stale cache entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache) {
    if (now - value.ts > 10 * 60 * 1000) cache.delete(key);
  }
}, 5 * 60 * 1000);

export default cgApi;
