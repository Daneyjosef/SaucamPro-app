export const CURRENCY_SYMBOLS = {
  usd: "$",
  eur: "€",
  gbp: "£",
  ngn: "₦",
  jpy: "¥",
  aud: "A$",
  cad: "C$",
  chf: "Fr",
  cny: "¥",
  inr: "₹",
  krw: "₩",
  brl: "R$",
  mxn: "Mex$",
  sgd: "S$",
  hkd: "HK$",
  sek: "kr",
  nok: "kr",
  dkk: "kr",
  nzd: "NZ$",
  zar: "R",
};

export const CURRENCIES = [
  { code: "usd", name: "US Dollar", symbol: "$" },
  { code: "eur", name: "Euro", symbol: "€" },
  { code: "gbp", name: "British Pound", symbol: "£" },
  { code: "ngn", name: "Nigerian Naira", symbol: "₦" },
  { code: "jpy", name: "Japanese Yen", symbol: "¥" },
  { code: "aud", name: "Australian Dollar", symbol: "A$" },
  { code: "cad", name: "Canadian Dollar", symbol: "C$" },
  { code: "chf", name: "Swiss Franc", symbol: "Fr" },
  { code: "cny", name: "Chinese Yuan", symbol: "¥" },
  { code: "inr", name: "Indian Rupee", symbol: "₹" },
  { code: "krw", name: "South Korean Won", symbol: "₩" },
  { code: "brl", name: "Brazilian Real", symbol: "R$" },
  { code: "mxn", name: "Mexican Peso", symbol: "Mex$" },
  { code: "sgd", name: "Singapore Dollar", symbol: "S$" },
  { code: "hkd", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "sek", name: "Swedish Krona", symbol: "kr" },
  { code: "nok", name: "Norwegian Krone", symbol: "kr" },
  { code: "dkk", name: "Danish Krone", symbol: "kr" },
  { code: "nzd", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "zar", name: "South African Rand", symbol: "R" },
];

// Keys must match CoinGecko's category IDs for /coins/markets?category=...
export const CATEGORY_FILTERS = [
  { key: "all", label: "All" },
  { key: "decentralized-finance-defi", label: "DeFi" },
  { key: "layer-1", label: "Layer 1" },
  { key: "layer-2", label: "Layer 2" },
  { key: "stablecoins", label: "Stablecoins" },
  { key: "non-fungible-tokens-nft", label: "NFT" },
];

export const TIME_RANGES = [
  { key: "1", label: "1H" },
  { key: "24", label: "24H" },
  { key: "7", label: "1W" },
  { key: "30", label: "1M" },
  { key: "365", label: "1Y" },
];

export const CHART_TIME_RANGES = [
  { key: "1", label: "1H" },
  { key: "24", label: "24H" },
  { key: "7", label: "1W" },
  { key: "30", label: "1M" },
  { key: "365", label: "1Y" },
];

export const API_BASE_URL = "https://api.coingecko.com/api/v3";
