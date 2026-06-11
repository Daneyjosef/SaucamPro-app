import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCoins, useTrending, useSearch, useCoinsByIds } from "../hooks/useCoins";
import { useCurrency } from "../hooks/useCurrency";
import { useAppStore } from "../store/useAppStore";
import { CoinLogo, PriceChange, Sparkline } from "../components/common";
import { CATEGORY_FILTERS } from "../lib/constants";

export default function Markets() {
  const navigate = useNavigate();
  const currency = useAppStore((s) => s.currency);
  const toggleWatchlist = useAppStore((s) => s.toggleWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);
  const { formatPrice, formatLargeNumber } = useCurrency();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [allCoins, setAllCoins] = useState([]);
  const [sortField, setSortField] = useState("market_cap_rank");
  const [sortDir, setSortDir] = useState("asc");

  const loaderRef = useRef(null);
  const activeCategoryRef = useRef(activeCategory);

  // Keep ref in sync so append effect can guard stale placeholder data
  useEffect(() => {
    activeCategoryRef.current = activeCategory;
    setPage(1);
    setAllCoins([]);
  }, [activeCategory]);

  const { data: newCoins, isLoading, isPlaceholderData } = useCoins({
    currency,
    page,
    perPage: 20,
    sparkline: true,
    category: activeCategory !== "all" ? activeCategory : undefined,
  });

  // API search — returns coin metadata (id, name, symbol, thumb)
  const { data: searchResults } = useSearch(searchQuery);

  // Fetch market data for search-matched IDs so we get prices/24h etc.
  const searchIds = useMemo(
    () => (searchQuery.length > 1 && searchResults?.length ? searchResults.slice(0, 20).map((r) => r.id) : []),
    [searchQuery, searchResults]
  );
  const { data: searchMarketData, isLoading: searchLoading } = useCoinsByIds({
    ids: searchIds,
    currency,
    sparkline: true,
  });

  // Append data on new page, skip placeholder data to avoid stale category flicker
  useEffect(() => {
    if (newCoins?.length && !isPlaceholderData) {
      setAllCoins((prev) => {
        const existing = new Map(prev.map((c) => [c.id, c]));
        newCoins.forEach((c) => existing.set(c.id, c));
        return Array.from(existing.values());
      });
    }
  }, [newCoins, isPlaceholderData]);

  const { data: trending } = useTrending();

  // Infinite scroll
  useEffect(() => {
    if (searchQuery) return; // disable infinite scroll during search
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isPlaceholderData) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [isLoading, isPlaceholderData, searchQuery]);

  // Sort for browse mode
  const sortedCoins = useMemo(() => {
    return [...allCoins].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      return ((a[sortField] || 0) - (b[sortField] || 0)) * dir;
    });
  }, [allCoins, sortField, sortDir]);

  // What to display — search results override browse list
  const isSearching = searchQuery.length > 1;
  const displayCoins = isSearching ? (searchMarketData || []) : sortedCoins;

  const handleSort = useCallback((field) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("desc");
      return field;
    });
  }, []);

  const handleNavigate = useCallback((id) => navigate(`/app/trade/${id}`), [navigate]);
  const handleToggleWatchlist = useCallback((id) => toggleWatchlist(id), [toggleWatchlist]);

  const SortArrow = useCallback(
    ({ field }) => {
      if (sortField !== field) return <span className="ml-1 text-text-secondary">↕</span>;
      return <span className="ml-1 text-primary-accent">{sortDir === "asc" ? "↑" : "↓"}</span>;
    },
    [sortField, sortDir]
  );

  const showSkeleton = (isSearching ? searchLoading : allCoins.length === 0 && isLoading);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Markets</h1>
        <p className="text-text-secondary text-sm mt-1">Real-time cryptocurrency prices</p>
      </div>

      {/* Trending Bar */}
      {trending?.length > 0 && !isSearching && (
        <div className="card">
          <p className="text-sm font-semibold text-text-secondary mb-3">🔥 Trending</p>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
            {trending.slice(0, 6).map(({ item }) => (
              <motion.button
                key={item.id}
                onClick={() => navigate(`/app/trade/${item.id}`)}
                className="flex items-center gap-2 flex-shrink-0 hover:bg-primary-border rounded-lg px-3 py-2 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <img loading="lazy" src={item.thumb} alt={item.name} className="w-5 h-5 rounded-full" />
                <span className="text-text-primary text-sm font-medium">{item.symbol?.toUpperCase()}</span>
                <span className={`text-xs font-semibold ${item.data?.price_change_percentage_24h?.usd >= 0 ? "text-gain" : "text-loss"}`}>
                  {item.data?.price_change_percentage_24h?.usd?.toFixed(2)}%
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Filters + Search */}
      <div className="card flex flex-wrap items-center gap-3 p-3">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-1">
          {CATEGORY_FILTERS.map((cat) => (
            <motion.button
              key={cat.key}
              onClick={() => {
                setSearchQuery("");
                setActiveCategory(cat.key);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeCategory === cat.key && !isSearching
                  ? "bg-primary-accent text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-primary-border/30"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[180px] max-w-xs ml-auto relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search coins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-primary-border rounded-lg pl-9 pr-8 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/20 text-sm bg-primary-bg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Search state label */}
      {isSearching && (
        <p className="text-text-secondary text-sm px-1">
          {searchLoading
            ? "Searching..."
            : `${displayCoins.length} result${displayCoins.length !== 1 ? "s" : ""} for "${searchQuery}"`}
        </p>
      )}

      {/* Coins table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-primary-border">
                  <th
                    className="text-left text-text-secondary text-xs font-medium py-3 pr-2 pl-4 w-8 cursor-pointer hover:text-text-primary select-none"
                    onClick={() => !isSearching && handleSort("market_cap_rank")}
                  >
                    # {!isSearching && <SortArrow field="market_cap_rank" />}
                  </th>
                  <th className="text-left text-text-secondary text-xs font-medium py-3 px-2 select-none">Coin</th>
                  <th
                    className="text-right text-text-secondary text-xs font-medium py-3 px-2 whitespace-nowrap cursor-pointer hover:text-text-primary select-none"
                    onClick={() => !isSearching && handleSort("current_price")}
                  >
                    Price {!isSearching && <SortArrow field="current_price" />}
                  </th>
                  <th className="text-right text-text-secondary text-xs font-medium py-3 px-2 whitespace-nowrap select-none">24h</th>
                  <th className="text-right text-text-secondary text-xs font-medium py-3 px-2 whitespace-nowrap select-none hidden lg:table-cell">7d</th>
                  <th
                    className="text-right text-text-secondary text-xs font-medium py-3 px-2 whitespace-nowrap select-none hidden xl:table-cell cursor-pointer hover:text-text-primary"
                    onClick={() => !isSearching && handleSort("market_cap")}
                  >
                    Mkt Cap {!isSearching && <SortArrow field="market_cap" />}
                  </th>
                  <th className="text-right text-text-secondary text-xs font-medium py-3 px-2 select-none hidden 2xl:table-cell">7D Chart</th>
                  <th className="text-center text-text-secondary text-xs font-medium py-3 pl-2 pr-4 w-8 select-none" />
                </tr>
              </thead>
              <tbody>
                {showSkeleton ? (
                  Array.from({ length: 12 }).map((_, i) => (
                    <tr key={i} className="border-b border-primary-border">
                      <td className="py-3 pr-2 pl-4 w-8"><div className="h-3 w-4 bg-primary-border rounded animate-pulse" /></td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary-border animate-pulse" />
                          <div className="space-y-1">
                            <div className="h-3 w-12 bg-primary-border rounded animate-pulse" />
                            <div className="h-2 w-20 bg-primary-border/60 rounded animate-pulse hidden sm:block" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right"><div className="h-3 w-16 bg-primary-border rounded animate-pulse ml-auto" /></td>
                      <td className="py-3 px-2 text-right"><div className="h-3 w-12 bg-primary-border rounded animate-pulse ml-auto" /></td>
                      <td className="py-3 px-2 text-right hidden lg:table-cell"><div className="h-3 w-12 bg-primary-border rounded animate-pulse ml-auto" /></td>
                      <td className="py-3 px-2 text-right hidden xl:table-cell"><div className="h-3 w-20 bg-primary-border rounded animate-pulse ml-auto" /></td>
                      <td className="py-3 px-2 text-right hidden 2xl:table-cell"><div className="h-3 w-12 bg-primary-border rounded animate-pulse ml-auto" /></td>
                      <td className="py-3 pl-2 pr-4 text-center w-8" />
                    </tr>
                  ))
                ) : displayCoins.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-text-secondary text-sm">
                      {isSearching ? "No coins found for your search." : "No coins found for this category."}
                    </td>
                  </tr>
                ) : (
                  displayCoins.map((coin, idx) => (
                    <motion.tr
                      key={coin.id}
                      className="border-b border-primary-border cursor-pointer group hover:bg-primary-card/50 transition-colors"
                      onClick={() => handleNavigate(coin.id)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: idx < 20 ? idx * 0.02 : 0 }}
                    >
                      <td className="py-3 pr-2 pl-4 text-text-secondary text-sm tabular-nums w-8">
                        {coin.market_cap_rank || idx + 1}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <CoinLogo src={coin.image} alt={coin.name} size={24} />
                          <div className="min-w-0">
                            <p className="text-text-primary font-medium text-sm truncate max-w-[80px] sm:max-w-none">
                              {coin.symbol?.toUpperCase()}
                            </p>
                            <p className="text-text-secondary text-xs truncate hidden sm:block">{coin.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right text-text-primary font-medium text-sm tabular-nums whitespace-nowrap">
                        {formatPrice(coin.current_price)}
                      </td>
                      <td className="py-3 px-2 text-right text-sm tabular-nums whitespace-nowrap">
                        <PriceChange value={coin.price_change_percentage_24h} />
                      </td>
                      <td className="py-3 px-2 text-right text-sm tabular-nums whitespace-nowrap hidden lg:table-cell">
                        <PriceChange value={coin.price_change_percentage_7d_in_currency} />
                      </td>
                      <td className="py-3 px-2 text-right text-text-secondary text-sm tabular-nums whitespace-nowrap hidden xl:table-cell">
                        {formatLargeNumber(coin.market_cap)}
                      </td>
                      <td className="py-3 px-2 text-right hidden 2xl:table-cell">
                        {coin.sparkline_in_7d?.price && (
                          <Sparkline data={coin.sparkline_in_7d.price} />
                        )}
                      </td>
                      <td className="py-3 pl-2 pr-4 text-center w-8">
                        <motion.button
                          onClick={(e) => { e.stopPropagation(); handleToggleWatchlist(coin.id); }}
                          className={`text-base ${
                            watchlist.includes(coin.id)
                              ? "text-yellow-400"
                              : "text-text-secondary opacity-0 group-hover:opacity-100"
                          }`}
                          whileTap={{ scale: 1.4 }}
                        >
                          {watchlist.includes(coin.id) ? "★" : "☆"}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Infinite scroll sentinel — hidden during search */}
        {!isSearching && (
          <div ref={loaderRef} className="py-4 flex items-center justify-center">
            {isLoading && (
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <div className="w-5 h-5 border-2 border-primary-accent border-t-transparent rounded-full animate-spin" />
                Loading more...
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
