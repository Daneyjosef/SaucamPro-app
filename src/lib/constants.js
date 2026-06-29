export const CURRENCY_SYMBOLS = {
  usd: "$",
  eur: "€",
  gbp: "£",
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
  { code: "usd", name: "US Dollar", symbol: "$", countryCode: "us" },
  { code: "eur", name: "Euro", symbol: "€", countryCode: "eu" },
  { code: "gbp", name: "British Pound", symbol: "£", countryCode: "gb" },
  { code: "jpy", name: "Japanese Yen", symbol: "¥", countryCode: "jp" },
  { code: "aud", name: "Australian Dollar", symbol: "A$", countryCode: "au" },
  { code: "cad", name: "Canadian Dollar", symbol: "C$", countryCode: "ca" },
  { code: "chf", name: "Swiss Franc", symbol: "Fr", countryCode: "ch" },
  { code: "cny", name: "Chinese Yuan", symbol: "¥", countryCode: "cn" },
  { code: "inr", name: "Indian Rupee", symbol: "₹", countryCode: "in" },
  { code: "krw", name: "South Korean Won", symbol: "₩", countryCode: "kr" },
  { code: "brl", name: "Brazilian Real", symbol: "R$", countryCode: "br" },
  { code: "mxn", name: "Mexican Peso", symbol: "Mex$", countryCode: "mx" },
  { code: "sgd", name: "Singapore Dollar", symbol: "S$", countryCode: "sg" },
  { code: "hkd", name: "Hong Kong Dollar", symbol: "HK$", countryCode: "hk" },
  { code: "sek", name: "Swedish Krona", symbol: "kr", countryCode: "se" },
  { code: "nok", name: "Norwegian Krone", symbol: "kr", countryCode: "no" },
  { code: "dkk", name: "Danish Krone", symbol: "kr", countryCode: "dk" },
  { code: "nzd", name: "New Zealand Dollar", symbol: "NZ$", countryCode: "nz" },
  { code: "zar", name: "South African Rand", symbol: "R", countryCode: "za" },
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
