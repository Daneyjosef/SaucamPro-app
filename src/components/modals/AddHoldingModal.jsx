import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAddHolding } from "../../hooks/usePortfolio";

export function AddHoldingModal({ isOpen, onClose }) {
  const addHolding = useAddHolding();
  const [form, setForm] = useState({
    coinSymbol: "",
    coinId: "",
    amount: "",
    avgBuyPrice: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.coinSymbol || !form.coinId || !form.amount || !form.avgBuyPrice) {
      toast.error("Please fill all fields");
      return;
    }
    addHolding.mutate(
      {
        coin_symbol: form.coinSymbol.toUpperCase(),
        coin_id: form.coinId.toLowerCase().trim(),
        amount: parseFloat(form.amount),
        avg_buy_price: parseFloat(form.avgBuyPrice),
      },
      {
        onSuccess: () => {
          setForm({ coinSymbol: "", coinId: "", amount: "", avgBuyPrice: "" });
          onClose();
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-primary-card border border-primary-border rounded-card p-6 w-full max-w-md mx-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-text-primary mb-6">Add Holding</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-secondary text-sm mb-1">Symbol</label>
                  <input
                    type="text"
                    placeholder="BTC"
                    value={form.coinSymbol}
                    onChange={(e) =>
                      setForm({ ...form, coinSymbol: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-primary-bg border border-primary-border rounded-lg px-3 py-2.5 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-1">
                    CoinGecko ID
                  </label>
                  <input
                    type="text"
                    placeholder="bitcoin"
                    value={form.coinId}
                    onChange={(e) =>
                      setForm({ ...form, coinId: e.target.value.toLowerCase() })
                    }
                    className="w-full bg-primary-bg border border-primary-border rounded-lg px-3 py-2.5 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent"
                  />
                </div>
              </div>
              <p className="text-text-secondary text-xs -mt-1">
                CoinGecko ID examples: bitcoin, ethereum, solana, binancecoin
              </p>
              <div>
                <label className="block text-text-secondary text-sm mb-1">Amount</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full bg-primary-bg border border-primary-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-1">
                  Avg Buy Price (USD)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={form.avgBuyPrice}
                  onChange={(e) => setForm({ ...form, avgBuyPrice: e.target.value })}
                  className="w-full bg-primary-bg border border-primary-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary flex-1"
                  disabled={addHolding.isPending}
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className="btn-primary flex-1"
                  whileTap={{ scale: 0.96 }}
                  disabled={addHolding.isPending}
                >
                  {addHolding.isPending ? "Adding..." : "Add"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
