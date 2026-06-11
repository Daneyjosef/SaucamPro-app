import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCoins, useTrending } from "../hooks/useCoins";
import { useCurrency } from "../hooks/useCurrency";
import { useAppStore } from "../store/useAppStore";
import { CoinLogo, PriceChange, Sparkline } from "../components/common";
import { CATEGORY_FILTERS } from "../lib/constants";

// Memoized coin row to prevent re-renders of off-screen rows
const CoinRow = React.memo(({ coin, rank, formatPrice, formatLargeNumber, watchlist, onToggleWatchlist, onNavigate }) => (
  <motion.tr
    className="border-b border-primary-border cursor-pointer group"
    whileHover={{ backgroundColor: "#1A1F2E" }}
    transition={{ type: "spring", stiffness: 200 }}
    onClick={() => onNavigate(coin.id)}
  >
    <td className="py-3 px-4 text-text-secondary text-sm whitespace-nowrap">{rank}</td>
    <td className="py-3 px-2">
      <div className="flex items-center gap-2">
        <CoinLogo src={coin.image} alt={coin.name} size={24} />
        <div>
          <p className="text-text-primary font-medium text-sm">{coin.symbol?.toUpperCase()}</p>
          <p className="text-text-secondary text-xs hidden sm:block">{coin.name}</p>
        </div>
      </div>
    </td>
    <td className="py-3 px-2 text-right text-text-primary font-medium text-sm whitespace-nowrap">
      {formatPrice(coin.current_price)}
    </td>
    <td className="py-3 px-2 text-right whitespace-nowrap">
      <PriceChange value={coin.price_change_percentage_24h} />
    </td>
    <td className="py-3 px-2 text-right hidden md:table-cell whitespace-nowrap">
      <PriceChange value={coin.price_change_percentage_7d_in_currency} />
    </td>
    <td className="py-3 px-2 text-right text-text-secondary text-sm hidden lg:table-cell whitespace-nowrap">
      {formatLargeNumber(coin.market_cap)}
    </td>
    <td className="py-3 px-2 text-right hidden lg:table-cell">
      {coin.sparkline_in_7d?.price && (
        <Sparkline data={coin.sparkline_in_7d.price} />
      )}
    </td>
    <td className="py-3 px-2 text-center">
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWatchlist(coin.id);
        }}
        className={`text-lg ${
          watchlist.includes(coin.id) ? "text-yellow-400" : "text-text-secondary opacity-0 group-hover:opacity-100"
        }`}
        whileTap={{ scale: 1.4 }}
      >
        {watchlist.includes(coin.id) ? "★" : "☆"}
      </motion.button>
    </td>
  </motion.tr>
));

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

  // Refs for virtualizer and infinite scroll
  const tableContainerRef = useRef(null);
  const loaderRef = useRef(null);

  const { data: newCoins, isLoading } = useCoins({
    currency,
    page,
    perPage: 20,
    sparkline: true,
  });

  // Append data on new page — memoized dedup
  useEffect(() => {
    if (newCoins?.length) {
      setAllCoins((prev) => {
        const existing = new Map(prev.map((c) => [c.id, c]));
        newCoins.forEach((c) => existing.set(c.id, c));
        return Array.from(existing.values());
      });
    }
  }, [newCoins]);

  const { data: trending } = useTrending();

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [isLoading]);

  // Memoized filter + sort
  const filteredCoins = useMemo(() => {
    let list = allCoins;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.symbol?.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const key = sortField === "current_price" ? "current_price" : sortField;
      return ((a[key] || 0) - (b[key] || 0)) * dir;
    });
  }, [allCoins, searchQuery, sortField, sortDir]);

  // Virtualizer
  const virtualizer = useVirtualizer({
    count: filteredCoins.length + (isLoading ? 1 : 0),
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 53,
    overscan: 5,
  });

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

  const handleNavigate = useCallback((id) => navigate(`/trade/${id}`), [navigate]);
  const handleToggleWatchlist = useCallback((id) => toggleWatchlist(id), [toggleWatchlist]);

  const SortArrow = useCallback(
    ({ field }) => {
      if (sortField !== field) return <span className="ml-1 text-text-secondary">↕</span>;
      return <span className="ml-1 text-primary-accent">{sortDir === "asc" ? "↑" : "↓"}</span>;
    },
    [sortField, sortDir]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Markets</h1>
        <p className="text-text-secondary text-sm mt-1">Real-time cryptocurrency prices</p>
      </div>

      {/* Trending Bar */}
      {trending?.length > 0 && (
        <div className="card">
          <p className="text-sm font-semibold text-text-secondary mb-3">🔥 Trending</p>
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {trending.slice(0, 6).map(({ item }) => (
              <motion.button
                key={item.id}
                onClick={() => navigate(`/trade/${item.id}`)}
                className="flex items-center gap-2 flex-shrink-0 hover:bg-primary-border rounded-lg px-3 py-2 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <img loading="lazy" src={item.thumb} alt={item.name} className="w-6 h-6 rounded-full" />
                <span className="text-text-primary text-sm font-medium">{item.symbol?.toUpperCase()}</span>
                <span className={`text-xs font-semibold ${item.data?.price_change_percentage_24h?.usd >= 0 ? "text-gain" : "text-loss"}`}>
                  {item.data?.price_change_percentage_24h?.usd?.toFixed(2)}%
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 bg-primary-card rounded-lg p-1">
          {CATEGORY_FILTERS.map((cat) => (
            <motion.button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeCategory === cat.key
                  ? "bg-primary-accent text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        <div className="flex-1 min-w-[200px] max-w-sm ml-auto">
          <input
            type="text"
            placeholder="Search coins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-primary-card border border-primary-border rounded-lg px-4 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent text-sm"
          />
        </div>
      </div>

      {/* Skeleton table shown only on initial load before any coins arrive */}
      {allCoins.length === 0 && isLoading && (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-border">
                  <th className="py-3 px-2 w-8" />
                  <th className="py-3 px-2 text-left text-text-secondary text-xs font-medium">Coin</th>
                  <th className="py-3 px-2 text-right text-text-secondary text-xs font-medium">Price</th>
                  <th className="py-3 px-2 text-right text-text-secondary text-xs font-medium">24h</th>
                  <th className="py-3 px-2 text-right text-text-secondary text-xs font-medium hidden lg:table-cell">7d</th>
                  <th className="py-3 px-2 text-right text-text-secondary text-xs font-medium hidden xl:table-cell">Mkt Cap</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 12 }).map((_, i) => (
                  <tr key={i} className="border-b border-primary-border">
                    <td className="py-3 px-2"><div className="h-3 w-4 bg-primary-border rounded animate-pulse" /></td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Virtualized Table */}
      {allCoins.length > 0 && (
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-primary-card z-10">
              <tr className="border-b border-primary-border">
                <th
                  className="text-left text-text-secondary text-xs font-medium py-3 px-2 w-8 cursor-pointer hover:text-text-primary transition-colors select-none"
                  onClick={() => handleSort("market_cap_rank")}
                >
                  # <SortArrow field="market_cap_rank" />
                </th>
                <th className="text-left text-text-secondary text-xs font-medium py-3 px-2 select-none">Coin</th>
                <th
                  className="text-right text-text-secondary text-xs font-medium py-3 px-2 cursor-pointer hover:text-text-primary transition-colors select-none whitespace-nowrap"
                  onClick={() => handleSort("current_price")}
                >
                  Price <SortArrow field="current_price" />
                </th>
                <th className="text-right text-text-secondary text-xs font-medium py-3 px-2 select-none whitespace-nowrap">24h</th>
                <th className="text-right text-text-secondary text-xs font-medium py-3 px-2 select-none whitespace-nowrap hidden lg:table-cell">7d</th>
                <th
                  className="text-right text-text-secondary text-xs font-medium py-3 px-2 whitespace-nowrap hidden xl:table-cell cursor-pointer hover:text-text-primary transition-colors select-none"
                  onClick={() => handleSort("market_cap")}
                >
                  Mkt Cap <SortArrow field="market_cap" />
                </th>
                <th className="text-right text-text-secondary text-xs font-medium py-3 px-2 whitespace-nowrap hidden 2xl:table-cell select-none">7D Chart</th>
                <th className="text-center text-text-secondary text-xs font-medium py-3 px-1 w-8 select-none"></th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Virtualized scroll container */}
        <div ref={tableContainerRef} className="overflow-auto" style={{ maxHeight: "calc(100vh - 340px)" }}>
          <table className="w-full">
            <tbody
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const isLoaderRow = virtualRow.index >= filteredCoins.length;
                const coin = filteredCoins[virtualRow.index];

                if (isLoaderRow) {
                  return (
                    <tr key="loader" ref={loaderRef} style={{ height: 53, transform: `translateY(${virtualRow.start}px)` }} className="absolute w-full">
                      <td colSpan={8} className="text-center py-4">
                        <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
                          <div className="w-5 h-5 border-2 border-primary-accent border-t-transparent rounded-full animate-spin" />
                          Loading more...
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={coin.id}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="absolute w-full border-b border-primary-border cursor-pointer group hover:bg-[#1A1F2E] transition-colors"
                    onClick={() => handleNavigate(coin.id)}
                  >
                    <td className="py-3 px-2 text-text-secondary text-sm whitespace-nowrap w-8">{coin.market_cap_rank || virtualRow.index + 1}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <CoinLogo src={coin.image} alt={coin.name} size={24} />
                        <div className="min-w-0">
                          <p className="text-text-primary font-medium text-sm truncate max-w-[60px] sm:max-w-none">{coin.symbol?.toUpperCase()}</p>
                          <p className="text-text-secondary text-xs truncate hidden sm:block">{coin.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right text-text-primary font-medium text-sm whitespace-nowrap">
                      {formatPrice(coin.current_price)}
                    </td>
                    <td className="py-3 px-2 text-right whitespace-nowrap">
                      <PriceChange value={coin.price_change_percentage_24h} />
                    </td>
                    <td className="py-3 px-2 text-right whitespace-nowrap hidden lg:table-cell">
                      <PriceChange value={coin.price_change_percentage_7d_in_currency} />
                    </td>
                    <td className="py-3 px-2 text-right text-text-secondary text-sm whitespace-nowrap hidden xl:table-cell">
                      {formatLargeNumber(coin.market_cap)}
                    </td>
                    <td className="py-3 px-2 text-right hidden 2xl:table-cell">
                      {coin.sparkline_in_7d?.price && (
                        <Sparkline data={coin.sparkline_in_7d.price} />
                      )}
                    </td>
                    <td className="py-3 pl-2 text-center w-8">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWatchlist(coin.id);
                        }}
                        className={`text-base ${
                          watchlist.includes(coin.id) ? "text-yellow-400" : "text-text-secondary opacity-0 group-hover:opacity-100"
                        }`}
                        whileTap={{ scale: 1.4 }}
                      >
                        {watchlist.includes(coin.id) ? "★" : "☆"}
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </motion.div>
  );
}
