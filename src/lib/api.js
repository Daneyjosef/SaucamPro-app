import axios from "axios";
import { API_BASE_URL } from "./constants";

// In-memory cache with TTL to avoid redundant requests
const cache = new Map();
const pendingRequests = new Map();

function cacheKey(url, params) {
  return `${url}|${JSON.stringify(params || {})}`;
}

async function cachedRequest(url, params = {}, ttl = 30000) {
  const key = cacheKey(url, params);

  // Return cached if fresh
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < ttl) {
    return cached.data;
  }

  // Deduplicate in-flight requests
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const promise = api.get(url, { params }).then((res) => {
    cache.set(key, { data: res.data, ts: Date.now() });
    pendingRequests.delete(key);
    return res.data;
  }).catch((err) => {
    pendingRequests.delete(key);
    throw err;
  });

  pendingRequests.set(key, promise);
  return promise;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { Accept: "application/json" },
});

// CoinGecko API functions
export const fetchGlobalData = async () => {
  const data = await cachedRequest("/global", {}, 5 * 60 * 1000);
  return data.data;
};

export const fetchCoins = async ({ currency = "usd", page = 1, perPage = 20, order = "market_cap_desc", sparkline = false, category } = {}) => {
  const params = {
    vs_currency: currency,
    order,
    per_page: perPage,
    page,
    sparkline,
    price_change_percentage: "7d",
  };
  if (category && category !== "all") {
    params.category = category;
  }
  return cachedRequest("/coins/markets", params, 30 * 1000);
};

export const fetchCoinById = async (id) => {
  const data = await cachedRequest(
    `/coins/${id}`,
    {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    },
    60 * 1000
  );
  return data;
};

export const fetchMarketChart = async (id, { currency = "usd", days = "7" } = {}) => {
  return cachedRequest(
    `/coins/${id}/market_chart`,
    { vs_currency: currency, days },
    30 * 1000
  );
};

export const fetchTrending = async () => {
  const data = await cachedRequest("/search/trending", {}, 5 * 60 * 1000);
  return data.coins;
};

export const fetchTopMovers = async ({ currency = "usd" } = {}) => {
  const data = await cachedRequest(
    "/coins/markets",
    {
      vs_currency: currency,
      order: "volume_desc",
      per_page: 50,
      sparkline: false,
    },
    30 * 1000
  );
  return data
    .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
    .slice(0, 8);
};

export const searchCoins = async (query) => {
  const data = await cachedRequest("/search", { query }, 60 * 1000);
  return data.coins;
};

export const fetchCategories = async () => {
  return cachedRequest("/coins/categories", {}, 10 * 60 * 1000);
};

// Clear stale cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache) {
    if (now - value.ts > 10 * 60 * 1000) cache.delete(key);
  }
}, 5 * 60 * 1000);

export default api;
