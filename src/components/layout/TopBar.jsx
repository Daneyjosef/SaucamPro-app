import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { CURRENCIES } from "../../lib/constants";
import { fetchCoins, searchCoins } from "../../lib/api";

export default function TopBar() {
  const { theme, toggleTheme, currency, setCurrency } = useAppStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const [tickerCoins, setTickerCoins] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Fetch ticker data
  useEffect(() => {
    const loadTicker = async () => {
      try {
        const data = await fetchCoins({ currency: "usd", perPage: 10, order: "volume_desc" });
        setTickerCoins(data);
      } catch {}
    };
    loadTicker();
    const interval = setInterval(loadTicker, 60000);
    return () => clearInterval(interval);
  }, []);

  // Search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await searchCoins(searchQuery);
        setSearchResults(res.slice(0, 8));
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCoinClick = (coinId) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/trade/${coinId}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-primary-bg/80 backdrop-blur-xl border-b border-primary-border">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left - Live Ticker */}
        <div className="flex-1 overflow-hidden hidden md:block">
          <div className="flex animate-marquee gap-8 whitespace-nowrap">
            {[...tickerCoins, ...tickerCoins].map((coin, idx) => (
              <span key={idx} className="flex items-center gap-2 text-sm">
                <span className="text-text-secondary">{coin.symbol?.toUpperCase()}</span>
                <span className="text-text-primary font-medium">${coin.current_price?.toLocaleString()}</span>
                <span className={coin.price_change_percentage_24h >= 0 ? "text-gain" : "text-loss"}>
                  {coin.price_change_percentage_24h >= 0 ? "▲" : "▼"}
                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <motion.button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-primary-card border border-primary-border rounded-btn text-text-secondary text-sm hover:text-text-primary transition-colors"
              whileTap={{ scale: 0.96 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 bg-primary-border rounded text-text-secondary">⌘K</kbd>
            </motion.button>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute right-0 top-12 w-[360px] bg-primary-card border border-primary-border rounded-card shadow-2xl overflow-hidden"
                >
                  <div className="p-3 border-b border-primary-border">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search cryptocurrencies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-primary-bg border border-primary-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent text-sm"
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((coin) => (
                        <motion.button
                          key={coin.id}
                          onClick={() => handleCoinClick(coin.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-border transition-colors text-left"
                        >
                          <img src={coin.thumb} alt={coin.name} className="w-6 h-6 rounded-full" />
                          <div className="flex-1">
                            <span className="text-text-primary text-sm font-medium">{coin.name}</span>
                            <span className="text-text-secondary text-xs ml-2">{coin.symbol?.toUpperCase()}</span>
                          </div>
                          {coin.market_cap_rank && (
                            <span className="text-text-secondary text-xs">#{coin.market_cap_rank}</span>
                          )}
                        </motion.button>
                      ))
                    ) : searchQuery.length >= 2 ? (
                      <div className="px-4 py-8 text-center text-text-secondary text-sm">No results found</div>
                    ) : (
                      <div className="px-4 py-8 text-center text-text-secondary text-sm">Type to search coins</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Currency Selector */}
          <div className="relative">
            <motion.button
              onClick={() => setCurrencyDropdown(!currencyDropdown)}
              className="px-3 py-2 bg-primary-card border border-primary-border rounded-btn text-text-primary text-sm font-medium hover:bg-primary-border transition-colors"
              whileTap={{ scale: 0.96 }}
            >
              {currency.toUpperCase()}
            </motion.button>

            <AnimatePresence>
              {currencyDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-[200px] bg-primary-card border border-primary-border rounded-card shadow-2xl max-h-[300px] overflow-y-auto z-50"
                >
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setCurrencyDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-primary-border transition-colors ${
                        currency === c.code ? "text-primary-accent" : "text-text-secondary"
                      }`}
                    >
                      <span>
                        {c.symbol} {c.name}
                      </span>
                      {currency === c.code && <span className="text-primary-accent">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center bg-primary-card border border-primary-border rounded-btn text-text-secondary hover:text-text-primary transition-colors"
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: 15 }}
          >
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </motion.button>

          {/* Notification Bell */}
          <motion.button
            className="w-9 h-9 flex items-center justify-center bg-primary-card border border-primary-border rounded-btn text-text-secondary hover:text-text-primary transition-colors relative"
            whileTap={{ scale: 0.9 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-loss rounded-full" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
