import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { useCurrency } from "../hooks/useCurrency";
import { DonutChart } from "../components/charts";
import { AddHoldingModal } from "../components/modals/AddHoldingModal";
import { PriceChange, AnimatedCounter } from "../components/common";

export default function Portfolio() {
  const { portfolio, removeFromPortfolio } = useAppStore();
  const { formatPrice, formatLargeNumber, formatPercent } = useCurrency();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalValue = useMemo(
    () => portfolio.reduce((sum, a) => sum + a.amount * a.buyPrice, 0),
    [portfolio]
  );
  const totalCost = useMemo(
    () => portfolio.reduce((sum, a) => sum + a.amount * a.buyPrice, 0),
    [portfolio]
  );
  const totalPnL = totalValue - totalCost;
  const pnlPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  // Donut chart data
  const donutData = useMemo(
    () =>
      portfolio.map((a) => ({
        name: a.coin,
        value: a.amount * a.buyPrice,
      })),
    [portfolio]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Portfolio</h1>
          <p className="text-text-secondary text-sm mt-1">Manage your crypto holdings</p>
        </div>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          whileTap={{ scale: 0.96 }}
        >
          + Add Holding
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="stats-label">Total Value</p>
          <AnimatedCounter value={totalValue} className="stats-value" />
        </motion.div>
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <p className="stats-label">Total Cost</p>
          <AnimatedCounter value={totalCost} className="stats-value" />
        </motion.div>
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="stats-label">Total P&L</p>
          <p className={`stats-value ${pnlPercent >= 0 ? "text-gain" : "text-loss"}`}>
            {formatPrice(Math.abs(totalPnL))}
            <span className="text-sm ml-2">
              {pnlPercent >= 0 ? "+" : "-"}{Math.abs(pnlPercent).toFixed(2)}%
            </span>
          </p>
        </motion.div>
      </div>

      {/* Chart + Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <motion.div
          className="card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-text-primary mb-4">Asset Allocation</h3>
          {donutData.length > 0 ? (
            <DonutChart data={donutData} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-secondary">
              No holdings yet. Add one to see your allocation.
            </div>
          )}
        </motion.div>

        {/* Holdings Table */}
        <motion.div
          className="card overflow-hidden p-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-4 border-b border-primary-border">
            <h3 className="text-lg font-bold text-text-primary">Holdings</h3>
          </div>
          {portfolio.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary-border">
                    <th className="text-left text-text-secondary text-xs font-medium py-3 px-4">Asset</th>
                    <th className="text-right text-text-secondary text-xs font-medium py-3 px-2">Amount</th>
                    <th className="text-right text-text-secondary text-xs font-medium py-3 px-2">Avg Buy</th>
                    <th className="text-right text-text-secondary text-xs font-medium py-3 px-2">Value</th>
                    <th className="text-center text-text-secondary text-xs font-medium py-3 px-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((asset, idx) => (
                    <motion.tr
                      key={asset.id}
                      className="border-b border-primary-border"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-accent/20 rounded-full flex items-center justify-center text-primary-accent font-bold text-xs">
                            {asset.coin?.slice(0, 2)}
                          </div>
                          <span className="text-text-primary font-medium">{asset.coin}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right text-text-primary text-sm">{asset.amount}</td>
                      <td className="py-3 px-2 text-right text-text-secondary text-sm">
                        {formatPrice(asset.buyPrice)}
                      </td>
                      <td className="py-3 px-2 text-right text-text-primary font-medium text-sm">
                        {formatPrice(asset.amount * asset.buyPrice)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <motion.button
                          onClick={() => removeFromPortfolio(asset.id)}
                          className="text-text-secondary hover:text-loss transition-colors text-sm"
                          whileTap={{ scale: 0.9 }}
                        >
                          ✕
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-text-secondary">
              <p className="text-4xl mb-3">💼</p>
              <p className="text-sm">No holdings yet</p>
              <button onClick={() => setIsModalOpen(true)} className="text-primary-accent text-sm mt-2 hover:underline">
                Add your first holding
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <AddHoldingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.div>
  );
}
