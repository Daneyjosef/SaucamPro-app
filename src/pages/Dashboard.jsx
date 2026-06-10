import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGlobalData, useCoins, useTopMovers } from "../hooks/useCoins";
import { useCurrency } from "../hooks/useCurrency";
import { useAppStore } from "../store/useAppStore";
import { PortfolioAreaChart } from "../components/charts";
import { AnimatedCounter, PriceChange, CoinLogo, Sparkline } from "../components/common";

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { formatPrice, formatLargeNumber, formatPercent } = useCurrency();
  const watchlist = useAppStore((s) => s.watchlist);
  const toggleWatchlist = useAppStore((s) => s.toggleWatchlist);
  const portfolio = useAppStore((s) => s.portfolio);
  const [chartRange, setChartRange] = useState("7");

  const { data: globalData } = useGlobalData();
  const { data: coins } = useCoins({ sparkline: true });
  const { data: topMovers } = useTopMovers();

  // Simulated portfolio chart data
  const portfolioChartData = useMemo(() => {
    const days = chartRange === "1" ? 1 : chartRange === "7" ? 7 : chartRange === "30" ? 30 : chartRange === "365" ? 365 : 7;
    const points = days * 24;
    const now = Date.now();
    const baseValue = portfolio.reduce((sum, a) => sum + a.amount * a.buyPrice, 10000) || 10000;
    return Array.from({ length: Math.min(points, 168) }, (_, i) => ({
      date: new Date(now - (Math.min(points, 168) - 1 - i) * 3600000).toISOString(),
      value: baseValue * (1 + Math.sin(i / 15) * 0.05 + Math.random() * 0.02),
    }));
  }, [chartRange, portfolio]);

  const totalValue = portfolio.reduce((s, a) => s + a.amount * a.buyPrice, 0);
  const bestPerformer = coins?.[0];

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* A. Hero Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeInUp} className="card">
          <p className="stats-label">Total Portfolio Value</p>
          <AnimatedCounter value={totalValue || 0} className="stats-value" />
          <div className="mt-1">
            <PriceChange value={globalData?.market_cap_change_percentage_24h_usd} />
            <span className="text-text-secondary text-xs ml-2">vs yesterday</span>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="card">
          <p className="stats-label">24h Change</p>
          <AnimatedCounter
            value={totalValue * ((globalData?.market_cap_change_percentage_24h_usd || 2) / 100)}
            className={`stats-value ${
              (globalData?.market_cap_change_percentage_24h_usd || 0) >= 0 ? "text-gain" : "text-loss"
            }`}
          />
          <div className="mt-1">
            <PriceChange value={globalData?.market_cap_change_percentage_24h_usd} />
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="card">
          <p className="stats-label">Best Performer</p>
          {bestPerformer ? (
            <div className="flex items-center gap-2 mt-2">
              <CoinLogo src={bestPerformer.image} alt={bestPerformer.name} size={24} />
              <div>
                <p className="text-text-primary font-semibold text-sm">{bestPerformer.symbol?.toUpperCase()}</p>
                <PriceChange value={bestPerformer.price_change_percentage_24h} />
              </div>
            </div>
          ) : (
            <p className="text-text-secondary text-sm mt-2">Loading...</p>
          )}
        </motion.div>

        <motion.div variants={fadeInUp} className="card">
          <p className="stats-label">BTC Dominance</p>
          <p className="stats-value">{globalData?.market_cap_percentage?.btc?.toFixed(1) || "0"}%</p>
          <p className="text-text-secondary text-xs mt-1">Market Dominance</p>
        </motion.div>
      </div>

      {/* B. Portfolio Chart */}
      <motion.div variants={fadeInUp} className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Portfolio Performance</h2>
          <div className="flex gap-1 bg-primary-bg rounded-lg p-1">
            {["7", "30", "365"].map((range) => (
              <motion.button
                key={range}
                onClick={() => setChartRange(range)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  chartRange === range
                    ? "bg-primary-accent text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {range === "7" ? "1W" : range === "30" ? "1M" : "1Y"}
              </motion.button>
            ))}
          </div>
        </div>
        <PortfolioAreaChart data={portfolioChartData} />
      </motion.div>

      {/* C. Top Movers */}
      <motion.div variants={fadeInUp}>
        <h2 className="text-lg font-bold text-text-primary mb-4">Top Movers</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {topMovers?.map((coin) => (
            <motion.button
              key={coin.id}
              onClick={() => navigate(`/trade/${coin.id}`)}
              className="card min-w-[160px] flex-shrink-0 text-left"
              whileHover={{ scale: 1.02, backgroundColor: "#1A1F2E" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CoinLogo src={coin.image} alt={coin.name} size={28} />
                <div>
                  <p className="text-text-primary font-semibold text-sm">{coin.symbol?.toUpperCase()}</p>
                  <p className="text-text-secondary text-xs">{coin.name?.slice(0, 12)}</p>
                </div>
              </div>
              <p className="text-text-primary font-bold">{formatPrice(coin.current_price)}</p>
              <PriceChange value={coin.price_change_percentage_24h} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* D. Market Table */}
      <motion.div variants={fadeInUp} className="card overflow-hidden">
        <h2 className="text-lg font-bold text-text-primary mb-4">Market Overview</h2>
        <div className="-mx-4 md:-mx-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle px-4 md:px-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-primary-border">
                  <th className="text-left text-text-secondary text-xs font-medium pb-3 pr-2 py-2 w-8">#</th>
                  <th className="text-left text-text-secondary text-xs font-medium pb-3 px-2 py-2">Coin</th>
                  <th className="text-right text-text-secondary text-xs font-medium pb-3 px-2 py-2 whitespace-nowrap">Price</th>
                  <th className="text-right text-text-secondary text-xs font-medium pb-3 px-2 py-2 whitespace-nowrap">24h</th>
                  <th className="text-right text-text-secondary text-xs font-medium pb-3 px-2 py-2 whitespace-nowrap hidden lg:table-cell">7d</th>
                  <th className="text-right text-text-secondary text-xs font-medium pb-3 px-2 py-2 whitespace-nowrap hidden xl:table-cell">Mkt Cap</th>
                  <th className="text-right text-text-secondary text-xs font-medium pb-3 px-2 py-2 whitespace-nowrap hidden 2xl:table-cell">Volume</th>
                  <th className="text-right text-text-secondary text-xs font-medium pb-3 px-2 py-2 hidden 2xl:table-cell">7D</th>
                  <th className="text-center text-text-secondary text-xs font-medium pb-3 pl-2 py-2 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {coins?.slice(0, 20).map((coin, idx) => (
                  <motion.tr
                    key={coin.id}
                    className="border-b border-primary-border cursor-pointer group"
                    whileHover={{ backgroundColor: "#1A1F2E" }}
                    transition={{ type: "spring", stiffness: 200 }}
                    onClick={() => navigate(`/trade/${coin.id}`)}
                  >
                    <td className="py-3 pr-2 text-text-secondary text-sm w-8">{idx + 1}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <CoinLogo src={coin.image} alt={coin.name} size={24} />
                        <div className="min-w-0">
                          <p className="text-text-primary font-medium text-sm truncate max-w-[60px] sm:max-w-none">{coin.symbol?.toUpperCase()}</p>
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
                    <td className="py-3 px-2 text-right text-text-secondary text-sm whitespace-nowrap hidden 2xl:table-cell">
                      {formatLargeNumber(coin.total_volume)}
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
                          toggleWatchlist(coin.id);
                        }}
                        className={`text-base ${watchlist.includes(coin.id) ? "text-yellow-400" : "text-text-secondary opacity-0 group-hover:opacity-100"}`}
                        whileTap={{ scale: 1.4 }}
                      >
                        {watchlist.includes(coin.id) ? "★" : "☆"}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
