import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { fetchCoins } from "../lib/api";
import { useCurrency } from "../hooks/useCurrency";
import { useAppStore } from "../store/useAppStore";
import { CURRENCIES, CURRENCY_SYMBOLS } from "../lib/constants";

/* â”€â”€â”€ animation presets â”€â”€â”€ */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 280, damping: 24 },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

/* â”€â”€â”€ animated mockup: Trade â”€â”€â”€ */
function TradeMockup() {
  const amounts = ["$50", "$100", "$200", "$500"];
  const [selected, setSelected] = useState(1);
  const [stage, setStage] = useState("idle");

  useEffect(() => {
    const cycle = setInterval(() => {
      setStage("confirm");
      setTimeout(() => setStage("success"), 900);
      setTimeout(() => { setStage("idle"); setSelected((s) => (s + 1) % amounts.length); }, 2400);
    }, 3200);
    return () => clearInterval(cycle);
  }, []);

  const values = { "$50": "0.00055 BTC", "$100": "0.0011 BTC", "$200": "0.0022 BTC", "$500": "0.0055 BTC" };

  return (
    <div className="bg-white rounded-2xl p-5 w-full max-w-[240px] shadow-2xl">
      <p className="text-gray-400 text-xs text-center mb-1">You buy</p>
      <motion.p key={selected} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-900 text-center mb-0.5">
        {amounts[selected]}
      </motion.p>
      <motion.p key={`sub-${selected}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 text-[11px] text-center mb-4">
        â‰ˆ {values[amounts[selected]]}
      </motion.p>
      <div className="flex gap-1.5 justify-center mb-4 flex-wrap">
        {amounts.map((a, i) => (
          <motion.span key={a} animate={{ backgroundColor: i === selected ? "#111" : "#fff", color: i === selected ? "#fff" : "#6b7280" }} className="text-[11px] px-2.5 py-1 rounded-full border border-gray-200 cursor-default font-medium">
            {a}
          </motion.span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {stage === "success" ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-emerald-500 rounded-xl py-2.5 flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            <span className="text-white text-xs font-semibold">Purchase Successful</span>
          </motion.div>
        ) : stage === "confirm" ? (
          <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-gray-100 rounded-xl py-2.5 flex items-center justify-center gap-2">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full" />
            <span className="text-gray-500 text-xs font-semibold">Processing...</span>
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-gray-900 rounded-xl py-2.5 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">Buy Crypto</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* â”€â”€â”€ animated mockup: Portfolio â”€â”€â”€ */
function PortfolioMockup() {
  const holdings = [
    { sym: "BTC", name: "Bitcoin", val: 8200, color: "bg-orange-100 text-orange-600", base: 2.1 },
    { sym: "ETH", name: "Ethereum", val: 3100, color: "bg-blue-100 text-blue-600", base: 6.4 },
    { sym: "SOL", name: "Solana", val: 1180, color: "bg-purple-100 text-purple-600", base: -1.2 },
  ];
  const [pcts, setPcts] = useState(holdings.map((h) => h.base));
  const [total, setTotal] = useState(12480.32);

  useEffect(() => {
    const t = setInterval(() => {
      setPcts((prev) => prev.map((p) => +(p + (Math.random() - 0.48) * 0.4).toFixed(2)));
      setTotal((prev) => +(prev + (Math.random() - 0.45) * 60).toFixed(2));
    }, 1800);
    return () => clearInterval(t);
  }, []);

  const totalPct = +((pcts.reduce((a, b) => a + b, 0) / pcts.length)).toFixed(2);

  return (
    <div className="bg-white rounded-2xl p-5 w-full max-w-[240px] shadow-2xl">
      <p className="text-gray-400 text-[11px] mb-1">Portfolio Value</p>
      <motion.p key={Math.floor(total)} className="text-2xl font-bold text-gray-900 mb-0.5 tabular-nums">
        ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </motion.p>
      <motion.p animate={{ color: totalPct >= 0 ? "#10b981" : "#f87171" }} className="text-[11px] font-semibold mb-4 tabular-nums">
        {totalPct >= 0 ? "â–²" : "â–¼"} {totalPct >= 0 ? "+" : ""}{totalPct}% today
      </motion.p>
      {holdings.map((h, i) => (
        <div key={h.sym} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${h.color}`}>{h.sym}</span>
            <span className="text-gray-500 text-[11px]">{h.name}</span>
          </div>
          <div className="text-right">
            <p className="text-gray-900 text-[11px] font-semibold tabular-nums">${h.val.toLocaleString()}</p>
            <motion.p animate={{ color: pcts[i] >= 0 ? "#10b981" : "#f87171" }} className="text-[10px] font-semibold tabular-nums">
              {pcts[i] >= 0 ? "+" : ""}{pcts[i]}%
            </motion.p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* â”€â”€â”€ animated mockup: Watchlist â”€â”€â”€ */
function WatchlistMockup() {
  const base = [
    { sym: "BTC", price: 67420, pct: 1.8 },
    { sym: "ETH", price: 3512, pct: 5.2 },
    { sym: "SOL", price: 148.3, pct: -0.9 },
    { sym: "BNB", price: 412.7, pct: 2.4 },
  ];
  const [coins, setCoins] = useState(base);
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setCoins((prev) => prev.map((c) => ({
        ...c,
        price: +(c.price + (Math.random() - 0.48) * c.price * 0.003).toFixed(c.price > 1000 ? 0 : 1),
        pct: +(c.pct + (Math.random() - 0.48) * 0.3).toFixed(2),
      })));
    }, 1400);
    const alert = setInterval(() => { setAlertShown(true); setTimeout(() => setAlertShown(false), 2000); }, 4000);
    return () => { clearInterval(t); clearInterval(alert); };
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 w-full max-w-[240px] shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-900 text-sm font-bold">Watchlist</p>
        <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">4 coins</span>
      </div>
      {coins.map((c) => (
        <div key={c.sym} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
          <span className="text-gray-900 text-xs font-bold w-8">{c.sym}</span>
          <motion.span key={c.price} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} className="text-gray-700 text-xs tabular-nums flex-1 text-center">
            ${c.price.toLocaleString()}
          </motion.span>
          <motion.span animate={{ color: c.pct >= 0 ? "#10b981" : "#f87171" }} className="text-xs font-semibold tabular-nums w-12 text-right">
            {c.pct >= 0 ? "+" : ""}{c.pct}%
          </motion.span>
        </div>
      ))}
      <div className="mt-3 h-8">
        <AnimatePresence>
          {alertShown && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="bg-emerald-500 rounded-xl h-full flex items-center justify-center gap-2">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              <span className="text-white text-[11px] font-semibold">Alert set successfully</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* â”€â”€â”€ currency switcher â”€â”€â”€ */
function CurrencySwitcher() {
  const currency = useAppStore((s) => s.currency);
  const setCurrency = useAppStore((s) => s.setCurrency);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const symbol = CURRENCY_SYMBOLS[currency] || "$";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-text-secondary hover:text-text-primary text-sm font-medium px-2 sm:px-3 py-2 rounded-btn border border-transparent hover:border-primary-border transition-colors"
      >
        <span className="font-semibold text-text-primary">{symbol}</span>
        <span className="uppercase hidden sm:inline">{currency}</span>
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 bg-primary-card border border-primary-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto py-1">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { setCurrency(c.code); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-primary-border/30 ${currency === c.code ? "text-primary-accent font-semibold" : "text-text-secondary"}`}
                >
                  <span className="w-5 text-center font-semibold text-text-primary">{c.symbol}</span>
                  <span>{c.code.toUpperCase()}</span>
                  <span className="ml-auto text-text-secondary text-xs truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* â”€â”€â”€ nav dropdown data â”€â”€â”€ */
const NAV_DROPDOWNS = [
  {
    label: "Buy",
    route: "buy",
    heading: "Buy crypto",
    desc: "Use a card, Apple Pay or Google Pay to buy crypto fast. We also accept bank transfers and wires.",
    coins: [
      { name: "Buy Bitcoin",   sym: "BTC",  id: "bitcoin",       img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
      { name: "Buy Dogecoin",  sym: "DOGE", id: "dogecoin",      img: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png" },
      { name: "Buy Ethereum",  sym: "ETH",  id: "ethereum",      img: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
      { name: "Buy Cardano",   sym: "ADA",  id: "cardano",       img: "https://assets.coingecko.com/coins/images/975/small/cardano.png" },
      { name: "Buy Polygon",   sym: "POL",  id: "matic-network", img: "https://assets.coingecko.com/coins/images/4713/small/polygon.png" },
      { name: "Buy Avalanche", sym: "AVAX", id: "avalanche-2",   img: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png" },
      { name: "Buy Solana",    sym: "SOL",  id: "solana",        img: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
      { name: "Buy XRP",       sym: "XRP",  id: "ripple",        img: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png" },
    ],
  },
  {
    label: "Sell",
    route: "sell",
    heading: "Sell crypto",
    desc: "Sell your crypto at the best available rate directly to your bank account, debit card, or SaucamPro Balance.",
    coins: [
      { name: "Sell Bitcoin",  sym: "BTC",  id: "bitcoin",       img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
      { name: "Sell Ethereum", sym: "ETH",  id: "ethereum",      img: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
      { name: "Sell Solana",   sym: "SOL",  id: "solana",        img: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
      { name: "Sell Dogecoin", sym: "DOGE", id: "dogecoin",      img: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png" },
      { name: "Sell Polygon",  sym: "POL",  id: "matic-network", img: "https://assets.coingecko.com/coins/images/4713/small/polygon.png" },
      { name: "Sell Cardano",  sym: "ADA",  id: "cardano",       img: "https://assets.coingecko.com/coins/images/975/small/cardano.png" },
      { name: "Sell Tether",   sym: "USDT", id: "tether",        img: "https://assets.coingecko.com/coins/images/325/small/Tether.png" },
      { name: "Sell USDC",     sym: "USDC", id: "usd-coin",      img: "https://assets.coingecko.com/coins/images/6319/small/usdc.png" },
    ],
  },
  {
    label: "Trade",
    route: "buy",
    heading: "Trade crypto",
    desc: "Swap one cryptocurrency for another at real-time market rates. No hidden fees, just fast and simple trading.",
    coins: [
      { name: "Trade Bitcoin",   sym: "BTC",  id: "bitcoin",       img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
      { name: "Trade Ethereum",  sym: "ETH",  id: "ethereum",      img: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
      { name: "Trade Solana",    sym: "SOL",  id: "solana",        img: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
      { name: "Trade XRP",       sym: "XRP",  id: "ripple",        img: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png" },
      { name: "Trade Avalanche", sym: "AVAX", id: "avalanche-2",   img: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png" },
      { name: "Trade Chainlink", sym: "LINK", id: "chainlink",     img: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
      { name: "Trade Polkadot",  sym: "DOT",  id: "polkadot",     img: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png" },
      { name: "Trade Uniswap",   sym: "UNI",  id: "uniswap",      img: "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png" },
    ],
  },
];

/* â”€â”€â”€ nav dropdown component â”€â”€â”€ */
function NavDropdown({ item, navigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className={`text-sm font-semibold transition-colors px-1 py-2 ${open ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`}>
        {item.label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 top-full mt-3 z-50 w-[540px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="flex">
              {/* Left panel */}
              <div className="w-48 bg-gray-50 p-6 flex flex-col justify-between border-r border-gray-100">
                <div>
                  <h3 className="text-gray-900 font-bold text-base mb-3">{item.heading}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
                <button
                  onClick={() => { navigate(`/${item.route}`); setOpen(false); }}
                  className="mt-6 text-xs font-semibold text-primary-accent hover:underline text-left"
                >
                  Show all assets â†’
                </button>
              </div>

              {/* Right panel â€” coin grid */}
              <div className="flex-1 p-3">
                <div className="grid grid-cols-2 gap-0.5">
                  {item.coins.map((coin) => (
                    <button
                      key={coin.sym}
                      onClick={() => { navigate(`/${item.route}/${coin.id}`); setOpen(false); }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                    >
                      <img src={coin.img} alt={coin.sym} className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 text-sm font-semibold leading-tight group-hover:text-primary-accent transition-colors">{coin.name}</p>
                        <p className="text-gray-400 text-xs">{coin.sym}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Real-time Prices",
    desc: "Live market data for 10,000+ cryptocurrencies, updated every 30 seconds with accurate CoinGecko feeds.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "20+ Currencies",
    desc: "View prices in USD, EUR, GBP, NGN, JPY and 15+ more currencies. Switch instantly across the entire app.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Portfolio Tracking",
    desc: "Track your holdings across assets. Add buys at historical prices, monitor P&L, and analyse performance.",
  },
];

/* â”€â”€â”€ live ticker strip â”€â”€â”€ */
function HeroTicker({ coins }) {
  const { formatPrice } = useCurrency();
  if (!coins.length) return null;
  const items = [...coins, ...coins];
  return (
    <div className="overflow-hidden w-screen relative left-1/2 -translate-x-1/2 mt-10 mb-2">
      <div className="flex animate-marquee w-max gap-4">
        {items.map((coin, i) => (
          <div key={`${coin.id}-${i}`} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex-shrink-0">
            <img src={coin.image} alt={coin.name} className="w-4 h-4 rounded-full" />
            <span className="text-white/80 text-xs font-semibold">{coin.symbol?.toUpperCase()}</span>
            <span className="text-white text-xs font-bold">{formatPrice(coin.current_price)}</span>
            <span className={`text-xs font-semibold ${coin.price_change_percentage_24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {coin.price_change_percentage_24h >= 0 ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* â”€â”€â”€ market preview table â”€â”€â”€ */
function MarketPreview({ coins, isAuthenticated }) {
  const navigate = useNavigate();
  const { formatPrice, formatLargeNumber } = useCurrency();
  return (
    <div className="overflow-x-auto rounded-card border border-primary-border bg-primary-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-primary-border">
            <th className="text-left text-text-secondary text-xs font-medium py-3 px-3 sm:px-4">#</th>
            <th className="text-left text-text-secondary text-xs font-medium py-3 px-3 sm:px-4">Coin</th>
            <th className="text-right text-text-secondary text-xs font-medium py-3 px-3 sm:px-4">Price</th>
            <th className="text-right text-text-secondary text-xs font-medium py-3 px-3 sm:px-4">24h</th>
            <th className="text-right text-text-secondary text-xs font-medium py-3 px-3 sm:px-4 hidden sm:table-cell">Mkt Cap</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, idx) => (
            <tr key={coin.id} onClick={() => navigate(isAuthenticated ? `/app/trade/${coin.id}` : "/signup")} className="border-b border-primary-border last:border-0 cursor-pointer hover:bg-primary-border/20 transition-colors">
              <td className="py-3 px-3 sm:px-4 text-text-secondary text-sm">{idx + 1}</td>
              <td className="py-3 px-3 sm:px-4">
                <div className="flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full" />
                  <div>
                    <p className="text-text-primary font-semibold text-xs sm:text-sm">{coin.symbol?.toUpperCase()}</p>
                    <p className="text-text-secondary text-xs hidden sm:block">{coin.name}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-3 sm:px-4 text-right text-text-primary font-medium text-xs sm:text-sm tabular-nums">
                {formatPrice(coin.current_price)}
              </td>
              <td className={`py-3 px-3 sm:px-4 text-right text-xs sm:text-sm font-semibold tabular-nums ${coin.price_change_percentage_24h >= 0 ? "text-gain" : "text-loss"}`}>
                {coin.price_change_percentage_24h >= 0 ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(2)}%
              </td>
              <td className="py-3 px-3 sm:px-4 text-right text-text-secondary text-sm tabular-nums hidden sm:table-cell">
                {formatLargeNumber(coin.market_cap)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const [coins, setCoins] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const heroRef = useRef(null);

  const { scrollY } = useScroll();
  const videoScale = useTransform(scrollY, [0, 600], [1, 0.75]);
  const videoBorderRadius = useTransform(scrollY, [0, 600], [0, 28]);

  const { currency } = useCurrency();

  useEffect(() => {
    fetchCoins({ perPage: 10, sparkline: false, currency }).then(setCoins).catch(() => {});
  }, [currency]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEmailCTA = (e) => {
    e.preventDefault();
    if (emailInput) navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-primary-bg text-text-primary overflow-x-hidden">

      {/* â•â•â•â•â•â•â•â• NAVBAR â•â•â•â•â•â•â•â• */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-primary-bg/90 backdrop-blur-xl border-b border-primary-border shadow-sm" : "bg-transparent"}`}>
        <div className="w-full px-5 sm:px-10 lg:px-20 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/favicon.png" alt="SaucamPro" className="h-8 sm:h-9 w-auto" />
          </div>

          {/* Desktop nav dropdowns */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_DROPDOWNS.map((item) => (
              <NavDropdown key={item.label} item={item} navigate={navigate} />
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <CurrencySwitcher />
            {isAuthenticated ? (
              <motion.button
                onClick={() => navigate("/app/dashboard")}
                className="bg-primary-accent text-white font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2 rounded-btn hover:bg-blue-600 transition-colors shadow-sm shadow-primary-accent/20"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Go to Dashboard
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={() => navigate("/login")}
                  className="hidden sm:block text-text-secondary hover:text-text-primary font-medium text-sm px-3 py-2 rounded-btn transition-colors border border-transparent hover:border-primary-border"
                  whileHover={{ scale: 1.02 }}
                >
                  Log In
                </motion.button>
                <motion.button
                  onClick={() => navigate("/signup")}
                  className="bg-primary-accent text-white font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2 rounded-btn hover:bg-blue-600 transition-colors shadow-sm shadow-primary-accent/20"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Get Started
                </motion.button>
              </>
            )}
            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen((o) => !o)} className="md:hidden ml-1 p-2 text-text-secondary hover:text-text-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-primary-bg/95 backdrop-blur-xl border-b border-primary-border overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {NAV_DROPDOWNS.map((item) => (
                  <button key={item.label} onClick={() => { navigate(isAuthenticated ? "/app/markets" : "/signup"); setMenuOpen(false); }} className="text-left text-text-secondary hover:text-text-primary text-sm font-semibold py-2.5 border-b border-primary-border/40 last:border-0 transition-colors">
                    {item.label}
                  </button>
                ))}
                {isAuthenticated ? (
                  <button onClick={() => { navigate("/app/dashboard"); setMenuOpen(false); }} className="text-left text-primary-accent font-semibold text-sm py-2.5 transition-colors">
                    Go to Dashboard
                  </button>
                ) : (
                  <button onClick={() => { navigate("/login"); setMenuOpen(false); }} className="text-left text-text-secondary hover:text-text-primary text-sm font-medium py-2.5 transition-colors">
                    Log In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* â•â•â•â•â•â•â•â• HERO â•â•â•â•â•â•â•â• */}
      <section ref={heroRef} className="relative min-h-[100svh] flex flex-col justify-center bg-[#0A0B0D]">
        {/* Scroll-shrinking video */}
        <motion.div style={{ scale: videoScale, borderRadius: videoBorderRadius }} className="absolute inset-0 overflow-hidden origin-top">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover" src="/hero-video.mp4" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0A0B0D] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        <div className="relative z-10 w-full px-5 sm:px-10 lg:px-20 pt-24 sm:pt-32 pb-16 sm:pb-24">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
              <motion.span
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-accent/10 text-primary-accent border border-primary-accent/20 mb-5 backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary-accent animate-pulse" />
                Live market data Â· 10,000+ coins
              </motion.span>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15] text-white mb-5 drop-shadow-2xl">
                Trade crypto with{" "}
                <span className="text-primary-accent">confidence</span>
              </h1>

              <p className="text-white/70 text-base sm:text-lg md:text-xl mb-8 leading-relaxed drop-shadow-lg">
                Real-time markets, portfolio analytics, and enterprise-grade security â€” everything you need in one place.
              </p>

              <div className="flex items-center gap-3 mb-6">
                <motion.button
                  onClick={() => navigate(isAuthenticated ? "/app/dashboard" : "/signup")}
                  className="bg-primary-accent text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-btn hover:bg-blue-600 transition-colors shadow-xl shadow-primary-accent/30"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {isAuthenticated ? "Go to Dashboard" : "Buy Crypto"}
                </motion.button>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-white/50">
                <span>â­ 4.6â˜… App Store</span>
                <span>â­ 4.5â˜… Google Play</span>
                <span>ðŸ”’ SEC-Licensed</span>
              </div>
            </motion.div>
          </div>

          <HeroTicker coins={coins} />
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â• ACTIONS CARDS â•â•â•â•â•â•â•â• */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-primary-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {[
              {
                bg: "bg-gradient-to-br from-[#1a1060] via-[#2a1a8a] to-[#0d0830]",
                mockup: <TradeMockup />,
                title: "Trade",
                desc: "Buy and sell crypto instantly at real-time market rates. Fast execution with live CoinGecko price feeds.",
                cta: "Start Trading",
                appRoute: "/app/markets",
              },
              {
                bg: "bg-gradient-to-br from-[#e8f0ff] via-[#d4e4ff] to-[#c5d8f8]",
                mockup: <PortfolioMockup />,
                title: "Track",
                desc: "Monitor your entire crypto portfolio in one place. Track P&L, analyse performance and manage holdings.",
                cta: "Track Portfolio",
                appRoute: "/app/portfolio",
              },
              {
                bg: "bg-gradient-to-br from-[#1a0a40] via-[#2d1070] to-[#160840]",
                mockup: <WatchlistMockup />,
                title: "Watch & Alert",
                desc: "Add coins to your watchlist and set price alerts. Get notified the moment your target price is hit.",
                cta: "Set Alerts",
                appRoute: "/app/watchlist",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 22, delay: i * 0.1 }}
                className="rounded-3xl overflow-hidden flex flex-col"
              >
                <div className={`${card.bg} p-6 sm:p-8 flex items-center justify-center min-h-[240px] sm:min-h-[280px]`}>
                  {card.mockup}
                </div>
                <div className="bg-[#F5F5F0] p-6 sm:p-7 flex-1 flex flex-col">
                  <h3 className="text-gray-900 text-xl sm:text-2xl font-bold mb-2">{card.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">{card.desc}</p>
                  <button onClick={() => navigate(isAuthenticated ? card.appRoute : "/signup")} className="self-start bg-gray-900 text-white text-sm font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-gray-700 transition-colors">
                    {card.cta}
                  </button>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â• FEATURES â•â•â•â•â•â•â•â• */}
      <section id="features" className="py-14 sm:py-20 px-4 sm:px-6 border-t border-primary-border">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="text-center mb-10 sm:mb-14">
            <motion.p variants={fadeUp} className="text-primary-accent text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Why SaucamPro</motion.p>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary">Everything you need in one platform</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                className="card p-5 sm:p-6 group cursor-default"
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,82,255,0.12)" }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary-accent/10 text-primary-accent flex items-center justify-center mb-4 group-hover:bg-primary-accent group-hover:text-white transition-colors duration-300">
                  {feat.icon}
                </div>
                <h3 className="text-text-primary font-bold text-base sm:text-lg mb-2">{feat.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â• LIVE MARKET PREVIEW â•â•â•â•â•â•â•â• */}
      <section id="markets" className="py-14 sm:py-20 px-4 sm:px-6 border-t border-primary-border">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="text-center mb-8 sm:mb-10">
            <motion.p variants={fadeUp} className="text-primary-accent text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Live markets</motion.p>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3">Top cryptocurrencies right now</motion.h2>
            <motion.p variants={fadeUp} className="text-text-secondary text-sm sm:text-base">Prices update every 30 seconds â€” no refresh needed.</motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
            {coins.length > 0 ? (
              <MarketPreview coins={coins.slice(0, 5)} isAuthenticated={isAuthenticated} />
            ) : (
              <div className="card py-12 text-center text-text-secondary text-sm">Loading market data...</div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-6">
            <motion.button onClick={() => navigate(isAuthenticated ? "/app/markets" : "/signup")} className="text-primary-accent font-semibold text-sm hover:underline" whileHover={{ scale: 1.04 }}>
              See all markets â†’
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â• CTA BANNER â•â•â•â•â•â•â•â• */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 border-t border-primary-border">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-2xl mx-auto text-center">
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3">
            {isAuthenticated ? "Welcome back to SaucamPro" : "Join 50,000+ traders on SaucamPro"}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-text-secondary mb-8 text-sm sm:text-base">
            {isAuthenticated ? "Your portfolio is waiting." : "Get started in minutes. No credit card required."}
          </motion.p>
          {isAuthenticated ? (
            <motion.button
              variants={fadeUp}
              onClick={() => navigate("/app/dashboard")}
              className="bg-primary-accent text-white font-semibold px-8 py-3 rounded-btn hover:bg-blue-600 transition-colors text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Go to Dashboard
            </motion.button>
          ) : (
            <motion.form variants={fadeUp} onSubmit={handleEmailCTA} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-primary-card border border-primary-border rounded-btn px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent text-sm"
              />
              <motion.button
                type="submit"
                className="bg-primary-accent text-white font-semibold px-7 py-3 rounded-btn hover:bg-blue-600 transition-colors text-sm whitespace-nowrap"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Get started
              </motion.button>
            </motion.form>
          )}
        </motion.div>
      </section>

      {/* â•â•â•â•â•â•â•â• FOOTER â•â•â•â•â•â•â•â• */}
      <footer className="border-t border-primary-border py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src="/favicon.png" alt="SaucamPro" className="h-8 w-auto" />
              </div>
              <p className="text-text-secondary text-xs leading-relaxed mb-4">
                A licensed global digital assets platform â€” secure, transparent, and built for modern traders.
              </p>
              <div className="flex gap-3">
                {["twitter", "telegram", "instagram"].map((s) => (
                  <button key={s} className="w-8 h-8 rounded-lg border border-primary-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary-accent transition-colors">
                    {s === "twitter" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>}
                    {s === "telegram" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>}
                    {s === "instagram" && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-text-primary font-semibold text-sm mb-4">Products</h4>
              <ul className="space-y-2.5 text-text-secondary text-sm">
                {[["Trade", "/trade"], ["Invest", "/invest"], ["Spend", "/spend"], ["Payments", "/payments"]].map(([l, href]) => (
                  <li key={l} onClick={() => navigate(href)} className="hover:text-text-primary cursor-pointer transition-colors">{l}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-text-primary font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2.5 text-text-secondary text-sm">
                <li onClick={() => navigate("/about")} className="hover:text-text-primary cursor-pointer transition-colors">About</li>
                <li className="cursor-default opacity-50">Blog</li>
                <li className="cursor-default opacity-50">Careers</li>
                <li className="cursor-default opacity-50">Press</li>
              </ul>
            </div>

            <div>
              <h4 className="text-text-primary font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5 text-text-secondary text-sm">
                {[["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"], ["Contact", "/contact"], ["Help Center", "/help"]].map(([l, href]) => (
                  <li key={l} onClick={() => navigate(href)} className="hover:text-text-primary cursor-pointer transition-colors">{l}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-text-secondary text-xs">
            <span>&copy; 2026 SaucamPro. All rights reserved.</span>
            <span>Licensed Â· Regulated Â· Trusted Globally</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
