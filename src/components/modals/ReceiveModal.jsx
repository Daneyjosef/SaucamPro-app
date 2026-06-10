import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// Deterministic mock address per coin for demo purposes
const MOCK_ADDRESSES = {
  BTC: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
  ETH: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
  SOL: "7EcDhSYGxXyscszYEp35KHN8vvw3svAuF3mZcxDffCNT",
  USDT: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
  USDC: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
  BNB: "bnb1ar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
  XRP: "r9PfV3sQp1Qp1Qp1Qp1Qp1Qp1Qp1Qp1Qp1",
  DOGE: "D5j7Tm9R3mQp4T5xqkL9y3xVQp6zN8qW2p",
  ADA: "addr1q9p9z9p9z9p9z9p9z9p9z9p9z9p9z9p9z9p9z9",
  DEFAULT: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
};

export function ReceiveModal({ isOpen, onClose, coin }) {
  const [copied, setCopied] = useState(false);
  const address = MOCK_ADDRESSES[coin] || MOCK_ADDRESSES.DEFAULT;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
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
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gain/15 flex items-center justify-center text-gain">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  Receive {coin}
                </h2>
                <p className="text-xs text-text-secondary">
                  Send only {coin} to this address
                </p>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40 bg-primary-bg border border-primary-border rounded-xl flex items-center justify-center">
                <div className="grid grid-cols-8 gap-0.5">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-sm ${
                        address.charCodeAt(i % address.length) % 3 === 0
                          ? "bg-text-primary"
                          : address.charCodeAt(i % address.length) % 3 === 1
                          ? "bg-primary-accent"
                          : "bg-primary-border"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="block text-text-secondary text-xs">
                {coin} Deposit Address
              </label>
              <div className="flex gap-2">
                <code className="flex-1 bg-primary-bg border border-primary-border rounded-lg px-4 py-2.5 text-text-primary text-xs font-mono break-all select-all">
                  {address}
                </code>
                <motion.button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-primary-accent hover:bg-blue-600 rounded-lg transition-colors flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                >
                  {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3">
              <p className="text-yellow-400 text-xs font-medium">
                ⚠️ Send only {coin} to this address. Sending other coins may
                result in permanent loss.
              </p>
            </div>

            {/* Close */}
            <div className="mt-4">
              <motion.button
                onClick={onClose}
                className="w-full btn-secondary"
                whileTap={{ scale: 0.96 }}
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
