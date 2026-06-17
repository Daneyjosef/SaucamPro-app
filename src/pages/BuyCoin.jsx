import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { CURRENCIES, CURRENCY_SYMBOLS } from "../lib/constants";
import SettingsPanel from "../components/common/SettingsPanel";

const COINS = [
  { id: "bitcoin",   sym: "BTC",  name: "Bitcoin",   img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",      color: "#F7931A" },
  { id: "ethereum",  sym: "ETH",  name: "Ethereum",  img: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",    color: "#627EEA" },
  { id: "solana",    sym: "SOL",  name: "Solana",    img: "https://assets.coingecko.com/coins/images/4128/small/solana.png",     color: "#9945FF" },
  { id: "dogecoin",  sym: "DOGE", name: "Dogecoin",  img: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",      color: "#C2A633" },
  { id: "ripple",    sym: "XRP",  name: "XRP",       img: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png", color: "#00AAE4" },
  { id: "cardano",   sym: "ADA",  name: "Cardano",   img: "https://assets.coingecko.com/coins/images/975/small/cardano.png",     color: "#0033AD" },
  { id: "avalanche-2", sym: "AVAX", name: "Avalanche", img: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png", color: "#E84142" },
  { id: "matic-network", sym: "POL", name: "Polygon", img: "https://assets.coingecko.com/coins/images/4713/small/polygon.png",  color: "#8247E5" },
  { id: "chainlink", sym: "LINK", name: "Chainlink", img: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png", color: "#2A5ADA" },
  { id: "polkadot",  sym: "DOT",  name: "Polkadot",  img: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png", color: "#E6007A" },
  { id: "uniswap",   sym: "UNI",  name: "Uniswap",   img: "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png", color: "#FF007A" },
  { id: "tether",    sym: "USDT", name: "Tether",    img: "https://assets.coingecko.com/coins/images/325/small/Tether.png",     color: "#26A17B" },
];

const QUICK_AMOUNTS = [100, 250, 500, 1000];

function CoinDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-3 py-2"
      >
        <img src={selected.img} alt={selected.sym} className="w-5 h-5 rounded-full" />
        <span className="text-gray-900 text-sm font-semibold">Buy {selected.sym}</span>
        <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1"
          >
            {COINS.map((c) => (
              <button
                key={c.id}
                onClick={() => { onSelect(c); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left ${selected.id === c.id ? "bg-gray-50" : ""}`}
              >
                <img src={c.img} alt={c.sym} className="w-6 h-6 rounded-full" />
                <div>
                  <p className="text-gray-900 text-sm font-semibold leading-tight">{c.name}</p>
                  <p className="text-gray-400 text-xs">{c.sym}</p>
                </div>
                {selected.id === c.id && (
                  <svg className="w-4 h-4 text-blue-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CurrencyDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const symbol = CURRENCY_SYMBOLS[selected] || "$";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-3 py-2"
      >
        <span className="text-gray-900 text-sm font-semibold">{selected.toUpperCase()}</span>
        <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { onSelect(c.code); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${selected === c.code ? "bg-gray-50" : ""}`}
                >
                  <span className="w-5 text-center font-semibold text-gray-700 text-sm">{c.symbol}</span>
                  <span className="text-gray-900 text-sm font-medium">{c.code.toUpperCase()}</span>
                  <span className="ml-auto text-gray-400 text-xs truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BuyCoin() {
  const navigate = useNavigate();
  const { coinId } = useParams();
  const globalCurrency = useAppStore((s) => s.currency);

  const defaultCoin = COINS.find((c) => c.id === coinId) || COINS[0];
  const [coin, setCoin] = useState(defaultCoin);
  const [currency, setCurrency] = useState(globalCurrency || "usd");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(null);

  const symbol = CURRENCY_SYMBOLS[currency] || "$";

  useEffect(() => {
    const found = COINS.find((c) => c.id === coinId);
    if (found) setCoin(found);
  }, [coinId]);

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=${currency}`)
      .then((r) => r.json())
      .then((d) => setPrice(d[coin.id]?.[currency] || null))
      .catch(() => {});
  }, [coin.id, currency]);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const coinEquiv = price && numAmount ? (numAmount / price).toFixed(6) : "0";

  const handleQuick = (val) => setAmount(String(val));

  const handleContinue = () => navigate("/signup");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-10 h-16 border-b border-gray-100">
        <button onClick={() => navigate("/")} className="flex items-center">
          <img src="/favicon.png" alt="SaucamPro" className="h-8 w-auto" />
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/login")} className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
            Log In
          </button>
          <button onClick={() => navigate("/signup")} className="bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-gray-700 transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto w-full px-6 sm:px-10 py-16 grid md:grid-cols-2 gap-16 items-center">

          {/* Left — info */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            {/* Coin icon */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8 shadow-lg" style={{ backgroundColor: coin.color + "20" }}>
              <img src={coin.img} alt={coin.name} className="w-10 h-10 rounded-full" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              Buy {coin.name} the<br />fast and easy way
            </h1>

            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
              SaucamPro offers a fast and easy way to buy {coin.name} ({coin.sym}) with a credit or debit card, bank transfer, Apple Pay, Google Pay, and more.
            </p>

            {/* Store ratings */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <span className="text-gray-700 text-sm font-medium">4.6 ★ on App Store</span>
              </div>
              <div className="w-px h-5 bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M3.18 23.76c.3.16.65.17.96.03l13.08-7.56-2.76-2.76-11.28 10.29z" fill="#EA4335"/>
                    <path d="M20.94 9.48c-.56-.48-1.38-.48-1.94 0L17.22 10.8l-2.76-2.76 1.8-1.8c.56-.56.56-1.46 0-2.02l-.12-.12c-.56-.56-1.46-.56-2.02 0L3.18.24C2.88.1 2.54.1 2.22.24L14.46 12.48l6.48-1.98c.56-.18.92-.74.92-1.32v-.18c0-.6-.38-1.14-.92-1.5z" fill="#FBBC04"/>
                    <path d="M3.18.24c-.3-.14-.65-.14-.96 0C1.62.56 1.5 1.14 1.5 1.5v21c0 .36.12.94.72 1.26.3.16.65.17.96.03L14.46 12 3.18.24z" fill="#4285F4"/>
                    <path d="M20.94 9.48l-6.48 2.52L17.22 10.8l1.78-1.08c.56-.3.94-.88.94-1.5v-.18c0-.6-.38-1.14-.92-1.5l-.08-.06z" fill="#34A853"/>
                  </svg>
                </div>
                <span className="text-gray-700 text-sm font-medium">4.5 ★ on Google Play</span>
              </div>
            </div>

            {/* CTA + TrustScore */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="bg-gray-900 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-gray-700 transition-colors text-sm"
              >
                Get Started
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#00B67A" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-bold">TrustScore 4.1</p>
                  <p className="text-gray-400 text-xs">111K Reviews</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — widget */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 max-w-sm mx-auto relative overflow-hidden">
              <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
              {/* Top controls */}
              <div className="flex items-center gap-2 mb-8">
                <CurrencyDropdown selected={currency} onSelect={setCurrency} />
                <CoinDropdown selected={coin} onSelect={setCoin} />
                <button onClick={() => setSettingsOpen(true)} className="ml-auto w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              {/* Amount display */}
              <div className="text-center mb-6">
                <div className="flex items-start justify-center gap-1 mb-2">
                  <span className="text-gray-400 text-2xl font-light mt-2">{symbol}</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="text-6xl font-bold text-gray-900 w-40 text-center bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="flex items-center justify-center gap-1.5 text-gray-400 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <span>{coinEquiv} {coin.sym}</span>
                </div>
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {QUICK_AMOUNTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuick(q)}
                    className={`py-2 rounded-full text-sm font-semibold transition-colors border ${amount === String(q) ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}
                  >
                    {symbol}{q >= 1000 ? "1,000" : q}
                  </button>
                ))}
              </div>

              {/* CTA button */}
              <button
                onClick={handleContinue}
                style={{ backgroundColor: coin.color }}
                className="w-full py-4 rounded-2xl text-white font-bold text-base hover:opacity-90 transition-opacity"
              >
                Continue with {coin.name}
              </button>

              <p className="text-center text-gray-400 text-xs mt-4">
                Powered by <span className="font-semibold text-gray-500">● SaucamPro</span>
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
