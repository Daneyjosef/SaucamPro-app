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

const cgApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    ...(import.meta.env.VITE_COINGECKO_API_KEY
      ? { "x-cg-demo-api-key": import.meta.env.VITE_COINGECKO_API_KEY }
      : {}),
  },
});

export const fetchGlobalData = async () => {
  const data = await cachedRequest(cgApi, "/global", {}, 5 * 60 * 1000);
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
    vs_currency: currency,
    page,
    per_page: Math.min(Number(perPage), 250),
    order,
    sparkline,
    price_change_percentage: "1h,24h,7d",
  };
  if (category && category !== "all") params.category = category;
  return cachedRequest(cgApi, "/coins/markets", params, 2 * 60 * 1000);
};

export const fetchCoinById = async (id) => {
  return cachedRequest(cgApi, `/coins/${id}`, {
    localization: false,
    tickers: false,
    community_data: false,
    developer_data: false,
    sparkline: false,
  }, 60 * 1000);
};

export const fetchMarketChart = async (id, { currency = "usd", days = "7" } = {}) => {
  return cachedRequest(cgApi, `/coins/${id}/market_chart`, { vs_currency: currency, days }, 2 * 60 * 1000);
};

export const fetchTopMovers = async ({ currency = "usd" } = {}) => {
  const data = await cachedRequest(
    cgApi,
    "/coins/markets",
    { vs_currency: currency, order: "volume_desc", per_page: 50, page: 1, sparkline: false, price_change_percentage: "24h" },
    2 * 60 * 1000
  );
  return data
    .sort(
      (a, b) =>
        Math.abs(b.price_change_percentage_24h) -
        Math.abs(a.price_change_percentage_24h)
    )
    .slice(0, 8);
};

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
