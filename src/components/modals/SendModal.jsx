import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";

export function SendModal({ isOpen, onClose, coin, maxAmount }) {
  const addNotification = useAppStore((s) => s.addNotification);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!address || !amount) {
      toast.error("Please fill all fields");
      return;
    }
    if (parseFloat(amount) > maxAmount) {
      toast.error(`Insufficient ${coin} balance`);
      return;
    }
    addNotification({
      type: "send",
      title: `Sent ${coin}`,
      description: `${amount} ${coin} sent to ${address.slice(0, 6)}...${address.slice(-4)}`,
      coin,
    });
    toast.success(
      `Sent ${amount} ${coin} to ${address.slice(0, 6)}...${address.slice(-4)}`
    );
    setAddress("");
    setAmount("");
    onClose();
  };

  const fillMax = () => setAmount(maxAmount.toString());

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
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-loss/15 flex items-center justify-center text-loss">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Send {coin}</h2>
                <p className="text-xs text-text-secondary">
                  Balance: {maxAmount} {coin}
                </p>
              </div>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              {/* Recipient Address */}
              <div>
                <label className="block text-text-secondary text-sm mb-1">
                  Recipient Address
                </label>
                <input
                  type="text"
                  placeholder="Enter wallet address (0x...)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-primary-bg border border-primary-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent font-mono text-sm"
                />
              </div>

              {/* Amount */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-text-secondary text-sm">Amount</label>
                  <button
                    type="button"
                    onClick={fillMax}
                    className="text-primary-accent text-xs font-medium hover:underline"
                  >
                    Max
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-primary-bg border border-primary-border rounded-lg px-4 py-2.5 text-text-primary text-lg font-bold placeholder-text-secondary focus:outline-none focus:border-primary-accent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">
                    {coin}
                  </span>
                </div>
              </div>

              {/* Network Fee Estimate */}
              <div className="flex items-center justify-between text-sm bg-primary-bg rounded-lg px-4 py-2.5">
                <span className="text-text-secondary">Network Fee</span>
                <span className="text-text-primary font-medium">~$0.50</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className="flex-1 bg-loss hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-btn transition-colors"
                  whileTap={{ scale: 0.96 }}
                >
                  Send {coin}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
