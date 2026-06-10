import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";

export function AddHoldingModal({ isOpen, onClose }) {
  const addToPortfolio = useAppStore((s) => s.addToPortfolio);
  const [form, setForm] = useState({ coin: "", amount: "", buyPrice: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.coin || !form.amount || !form.buyPrice) {
      toast.error("Please fill all fields");
      return;
    }
    addToPortfolio({
      coin: form.coin.toUpperCase(),
      amount: parseFloat(form.amount),
      buyPrice: parseFloat(form.buyPrice),
      date: new Date().toISOString(),
    });
    toast.success(`Added ${form.coin.toUpperCase()} to portfolio`);
    setForm({ coin: "", amount: "", buyPrice: "" });
    onClose();
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
              <div>
                <label className="block text-text-secondary text-sm mb-1">Coin Symbol</label>
                <input
                  type="text"
                  placeholder="e.g. BTC"
                  value={form.coin}
                  onChange={(e) => setForm({ ...form, coin: e.target.value.toUpperCase() })}
                  className="w-full bg-primary-bg border border-primary-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent"
                />
              </div>
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
                <label className="block text-text-secondary text-sm mb-1">Buy Price (USD)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={form.buyPrice}
                  onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
                  className="w-full bg-primary-bg border border-primary-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className="btn-primary flex-1"
                  whileTap={{ scale: 0.96 }}
                >
                  Add
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
