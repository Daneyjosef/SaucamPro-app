import axios from "axios";
import NodeCache from "node-cache";

const BASE_URL = "https://api.coingecko.com/api/v3";

// Separate caches with different TTLs
const priceCache = new NodeCache({ stdTTL: 30, checkperiod: 15 });   // 30 s — live prices
const metaCache  = new NodeCache({ stdTTL: 300, checkperiod: 60 });  // 5 min — coin metadata / global

const cgAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: {
    Accept: "application/json",
    ...(process.env.COINGECKO_API_KEY
      ? { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }
      : {}),
  },
});

function cacheKey(path, params = {}) {
  return `${path}|${JSON.stringify(params)}`;
}

async function cachedGet(path, params, cache) {
  const key = cacheKey(path, params);
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  const { data } = await cgAxios.get(path, { params });
  cache.set(key, data);
  return data;
}

// ─── Public API functions ────────────────────────────────────

export async function getMarkets({
  currency = "usd",
  page = 1,
  perPage = 20,
  order = "market_cap_desc",
  sparkline = false,
  category,
} = {}) {
  const params = {
    vs_currency: currency,
    order,
    per_page: perPage,
    page,
    sparkline,
    price_change_percentage: "7d",
  };
  if (category) params.category = category;
  return cachedGet("/coins/markets", params, priceCache);
}

export async function getMarketChart(coinId, { currency = "usd", days = "30" } = {}) {
  return cachedGet(
    `/coins/${coinId}/market_chart`,
    { vs_currency: currency, days },
    priceCache
  );
}

export async function getCoin(coinId) {
  return cachedGet(
    `/coins/${coinId}`,
    {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    },
    metaCache
  );
}

export async function getGlobal() {
  return cachedGet("/global", {}, metaCache);
}

/**
 * Fetch simple spot prices for one or more coin IDs.
 * Returns: { bitcoin: { usd: 65000 }, ethereum: { usd: 3000 }, ... }
 * Used by the alert engine to avoid pulling full market data.
 */
export async function getSimplePrices(coinIds, currency = "usd") {
  if (!coinIds.length) return {};
  return cachedGet(
    "/simple/price",
    { ids: coinIds.join(","), vs_currencies: currency },
    priceCache
  );
}
