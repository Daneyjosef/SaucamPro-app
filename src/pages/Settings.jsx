import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { CURRENCIES } from "../lib/constants";

export default function Settings() {
  const { theme, toggleTheme, currency, setCurrency } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Customize your experience</p>
      </div>

      {/* Theme */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold text-text-primary mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary font-medium">Dark Mode</p>
            <p className="text-text-secondary text-sm">Toggle dark and light theme</p>
          </div>
          <motion.button
            onClick={toggleTheme}
            className={`w-14 h-7 rounded-full p-1 transition-colors ${
              theme === "dark" ? "bg-primary-accent" : "bg-primary-border"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-md"
              animate={{ x: theme === "dark" ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Default Currency */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <h3 className="text-lg font-bold text-text-primary mb-4">Default Currency</h3>
        <p className="text-text-secondary text-sm mb-4">
          Select your preferred currency for all price displays
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {CURRENCIES.map((c) => (
            <motion.button
              key={c.code}
              onClick={() => setCurrency(c.code)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currency === c.code
                  ? "bg-primary-accent text-text-primary"
                  : "bg-primary-bg text-text-secondary hover:text-text-primary hover:bg-primary-border"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <span>{c.symbol}</span>
              <span>{c.code.toUpperCase()}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Price Alerts */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-bold text-text-primary mb-4">Price Alerts</h3>
        <p className="text-text-secondary text-sm mb-4">
          Configure alert preferences (UI only - no backend)
        </p>
        <div className="space-y-4">
          {[
            { label: "Price increase alerts", desc: "Notify when price goes up by 5%+" },
            { label: "Price drop alerts", desc: "Notify when price drops by 5%+" },
            { label: "Daily summary", desc: "Receive daily performance summary" },
          ].map((alert, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div>
                <p className="text-text-primary text-sm font-medium">{alert.label}</p>
                <p className="text-text-secondary text-xs">{alert.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={idx === 0} />
                <div className="w-10 h-5 bg-primary-border rounded-full peer peer-checked:bg-primary-accent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Display Preferences */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="text-lg font-bold text-text-primary mb-4">Display Preferences</h3>
        <p className="text-text-secondary text-sm mb-4">Show/Hide columns in market tables</p>
        <div className="space-y-3">
          {[
            "7d Change",
            "Market Cap",
            "Volume",
            "Sparkline Chart",
            "Watchlist Star",
          ].map((col, idx) => (
            <label key={idx} className="flex items-center justify-between">
              <span className="text-text-primary text-sm">{col}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-10 h-5 bg-primary-border rounded-full peer peer-checked:bg-primary-accent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </label>
          ))}
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        className="card text-center py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-text-secondary text-sm">
          SaucamPro v1.0.0 • Built with React + Vite
        </p>
        <p className="text-text-secondary text-xs mt-1">
          Data provided by CoinGecko API
        </p>
      </motion.div>
    </motion.div>
  );
}
