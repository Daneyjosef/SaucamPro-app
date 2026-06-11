import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "../hooks/useCurrency";
import { useAppStore } from "../store/useAppStore";
import { CoinLogo, PriceChange, Sparkline } from "../components/common";
import { useWatchlist } from "../hooks/useWatchlist";
import { useCoinsByIds } from "../hooks/useCoins";

export default function Watchlist() {
  const navigate = useNavigate();
  const currency = useAppStore((s) => s.currency);
  const { formatPrice } = useCurrency();

  const { watchlistIds, toggle, isLoading: watchlistLoading } = useWatchlist();

  const { data: watchedCoins = [], isLoading: coinsLoading } = useCoinsByIds({
    ids: watchlistIds,
    currency,
    sparkline: true,
  });

  const isLoading = watchlistLoading || (watchlistIds.length > 0 && coinsLoading);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Watchlist</h1>
        <p className="text-text-secondary text-sm mt-1">Your tracked cryptocurrencies</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card h-[140px] animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary-border rounded-full" />
                <div className="space-y-2">
                  <div className="w-16 h-3 bg-primary-border rounded" />
                  <div className="w-10 h-2 bg-primary-border rounded" />
                </div>
              </div>
              <div className="w-24 h-5 bg-primary-border rounded mb-2" />
              <div className="w-14 h-3 bg-primary-border rounded" />
            </div>
          ))}
        </div>
      ) : watchlistIds.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">⭐</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No coins watched yet</h3>
          <p className="text-text-secondary text-sm mb-6">
            Start adding coins to your watchlist from the Markets page
          </p>
          <motion.button
            onClick={() => navigate("/app/markets")}
            className="btn-primary"
            whileTap={{ scale: 0.96 }}
          >
            Browse Markets
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {watchedCoins.map((coin) => (
              <motion.div
                key={coin.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="card cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => navigate(`/app/trade/${coin.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CoinLogo src={coin.image} alt={coin.name} size={32} />
                    <div>
                      <p className="text-text-primary font-semibold">{coin.symbol?.toUpperCase()}</p>
                      <p className="text-text-secondary text-xs">{coin.name}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle({ coinId: coin.id, coinSymbol: coin.symbol?.toUpperCase() });
                    }}
                    className="text-yellow-400 text-lg"
                    whileTap={{ scale: 1.4 }}
                  >
                    ★
                  </motion.button>
                </div>
                <p className="text-text-primary font-bold text-lg">
                  {formatPrice(coin.current_price)}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <PriceChange value={coin.price_change_percentage_24h} />
                  {coin.sparkline_in_7d?.price && (
                    <Sparkline data={coin.sparkline_in_7d.price} />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
