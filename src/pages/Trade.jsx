import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useCoinById, useMarketChart } from "../hooks/useCoins";
import { useCurrency } from "../hooks/useCurrency";
import { PriceAreaChart } from "../components/charts";
import { CoinLogo, PriceChange, AnimatedCounter } from "../components/common";
import { TIME_RANGES } from "../lib/constants";

export default function Trade() {
  const { coinId } = useParams();
  const { formatPrice, formatLargeNumber, formatPercent } = useCurrency();
  const [timeRange, setTimeRange] = useState("7");
  const [tradeType, setTradeType] = useState("buy");
  const [amount, setAmount] = useState("");

  const { data: coin, isLoading: coinLoading } = useCoinById(coinId);
  const { data: chartData } = useMarketChart(coinId, {
    days: timeRange,
  });

  if (coinLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-primary-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="card text-center py-12">
        <p className="text-text-secondary">Coin not found</p>
      </div>
    );
  }

  const currentPrice = coin.market_data?.current_price?.usd || 0;
  const priceChange24h = coin.market_data?.price_change_percentage_24h || 0;
  const prices = chartData?.prices?.map((p) => p[1]) || [];

  const handleTrade = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    toast.success(
      `${tradeType === "buy" ? "Bought" : "Sold"} ${amount} ${coin.symbol?.toUpperCase()} successfully!`
    );
    setAmount("");
  };

  const estimatedReceive = amount ? (parseFloat(amount) / currentPrice).toFixed(6) : "0";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Left - Chart Area (70%) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Coin Header */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <CoinLogo src={coin.image?.large} alt={coin.name} size={48} />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-text-primary">{coin.name}</h1>
                  <span className="text-text-secondary text-lg">{coin.symbol?.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <AnimatedCounter
                    value={currentPrice}
                    className="text-3xl font-bold text-text-primary"
                  />
                  <PriceChange value={priceChange24h} className="text-base" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Price Chart */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-1 bg-primary-bg rounded-lg p-1 mb-4 inline-flex">
            {TIME_RANGES.map((range) => (
              <motion.button
                key={range.key}
                onClick={() => setTimeRange(range.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  timeRange === range.key
                    ? "bg-primary-accent text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {range.label}
              </motion.button>
            ))}
          </div>
          {prices.length > 0 ? (
            <PriceAreaChart data={prices} />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-text-secondary">
              Loading chart...
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { label: "Market Cap", value: formatLargeNumber(coin.market_data?.market_cap?.usd) },
            { label: "24h Volume", value: formatLargeNumber(coin.market_data?.total_volume?.usd) },
            { label: "ATH", value: formatPrice(coin.market_data?.ath?.usd) },
            { label: "ATL", value: formatPrice(coin.market_data?.atl?.usd) },
            { label: "Circ Supply", value: formatLargeNumber(coin.market_data?.circulating_supply) },
            { label: "Rank", value: `#${coin.market_cap_rank || "—"}` },
          ].map((stat, idx) => (
            <div key={idx} className="card text-center">
              <p className="stats-label">{stat.label}</p>
              <p className="text-text-primary font-bold text-sm mt-1">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* About */}
        {coin.description?.en && (
          <motion.div
            className="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-text-primary mb-2">About {coin.name}</h3>
            <p
              className="text-text-secondary text-sm leading-relaxed line-clamp-4"
              dangerouslySetInnerHTML={{
                __html: coin.description.en.split(". ").slice(0, 5).join(". ") + ".",
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Right - Trade Panel (30%) */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Buy/Sell Toggle */}
        <div className="card">
          <div className="bg-primary-bg rounded-lg p-1 flex">
            {["buy", "sell"].map((type) => (
              <motion.button
                key={type}
                onClick={() => setTradeType(type)}
                className={`flex-1 py-2.5 rounded-md font-semibold text-sm capitalize transition-colors ${
                  tradeType === type
                    ? type === "buy"
                      ? "bg-gain text-text-primary"
                      : "bg-loss text-text-primary"
                    : "text-text-secondary"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="card space-y-4">
          <div>
            <label className="block text-text-secondary text-sm mb-1">Amount ({coin.symbol?.toUpperCase()})</label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-primary-bg border border-primary-border rounded-lg px-4 py-3 text-text-primary text-xl font-bold placeholder-text-secondary focus:outline-none focus:border-primary-accent"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Price</span>
            <span className="text-text-primary font-medium">{formatPrice(currentPrice)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Est. Receive</span>
            <span className="text-text-primary font-medium">{estimatedReceive} {coin.symbol?.toUpperCase()}</span>
          </div>

          {/* Trade Button */}
          <motion.button
            onClick={handleTrade}
            className={`w-full py-3 rounded-lg font-bold text-text-primary transition-colors ${
              tradeType === "buy"
                ? "bg-gain hover:bg-green-600"
                : "bg-loss hover:bg-red-600"
            }`}
            whileTap={{ scale: 0.96 }}
          >
            {tradeType === "buy" ? "Buy" : "Sell"} {coin.symbol?.toUpperCase()}
          </motion.button>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">Recent Transactions</h3>
          <div className="space-y-3">
            {[
              { type: "buy", amount: "0.05", coin: coin.symbol, price: currentPrice * 0.98, time: "2h ago" },
              { type: "sell", amount: "0.02", coin: coin.symbol, price: currentPrice * 1.02, time: "6h ago" },
              { type: "buy", amount: "0.1", coin: coin.symbol, price: currentPrice * 0.95, time: "1d ago" },
            ].map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${tx.type === "buy" ? "bg-gain" : "bg-loss"}`} />
                  <div>
                    <p className="text-text-primary text-xs font-medium uppercase">
                      {tx.type} {tx.coin}
                    </p>
                    <p className="text-text-secondary text-xs">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-text-primary text-xs font-medium">
                    {tx.type === "buy" ? "+" : "-"}{tx.amount} {tx.coin}
                  </p>
                  <p className="text-text-secondary text-xs">${tx.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
