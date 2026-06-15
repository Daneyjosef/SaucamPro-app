import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import InfoLayout from "../../components/layout/InfoLayout";

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: "spring", stiffness: 280, damping: 24 } }) };

const FEATURES = [
  { icon: "⚡", title: "Instant execution", desc: "Buy and sell crypto in seconds with real-time order matching and lightning-fast settlement." },
  { icon: "📈", title: "Live market data", desc: "Access real-time prices, charts, and order books across hundreds of cryptocurrency pairs." },
  { icon: "🔒", title: "Secure by design", desc: "Your assets are protected by bank-grade encryption, cold storage, and multi-factor authentication." },
  { icon: "💰", title: "Competitive fees", desc: "Transparent, low fees with no hidden charges. Pay less, keep more of your gains." },
  { icon: "🌍", title: "Multi-currency support", desc: "Fund your account in your local currency via bank transfer, card, or crypto. Fast, simple, no friction." },
  { icon: "📱", title: "Trade anywhere", desc: "Our mobile-optimised platform lets you trade on the go, whenever opportunity strikes." },
];

const COINS = [
  { symbol: "BTC", name: "Bitcoin", color: "#F7931A" },
  { symbol: "ETH", name: "Ethereum", color: "#627EEA" },
  { symbol: "SOL", name: "Solana", color: "#9945FF" },
  { symbol: "BNB", name: "BNB", color: "#F3BA2F" },
  { symbol: "USDT", name: "Tether", color: "#26A17B" },
  { symbol: "XRP", name: "XRP", color: "#346AA9" },
];

export default function TradePage() {
  const navigate = useNavigate();

  return (
    <InfoLayout>
      {/* HERO */}
      <section className="px-5 sm:px-10 pt-20 pb-16 bg-gradient-to-b from-gray-50 to-white text-center">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto">
          <motion.p variants={fadeUp} custom={0} className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-4">Trade</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Buy, sell and swap<br className="hidden sm:block" /> crypto instantly
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            The fastest, easiest way to trade cryptocurrency. Get started in minutes, from anywhere in the world.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/signup")} className="bg-gray-900 text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-700 transition-colors text-base">
              Start trading
            </button>
            <button onClick={() => navigate("/buy/bitcoin")} className="border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-full hover:bg-gray-50 transition-colors text-base">
              Buy Bitcoin
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* POPULAR PAIRS */}
      <section className="px-5 sm:px-10 py-14 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Popular trading pairs</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">Buy and sell the world's most liquid cryptocurrencies</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {COINS.map((coin, i) => (
              <motion.button
                key={coin.symbol}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 260, damping: 22 }}
                onClick={() => navigate(`/buy/${coin.name.toLowerCase()}`)}
                className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: coin.color }}>
                  {coin.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{coin.symbol}/NGN</p>
                  <p className="text-gray-400 text-xs">{coin.name}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 sm:px-10 py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Everything you need to trade</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">Powerful tools built for every level of trader</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-10 py-20 text-center bg-gray-900">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to start trading?</h2>
        <p className="text-gray-400 mb-8 text-base max-w-md mx-auto">Join hundreds of thousands of traders on SaucamPro every day.</p>
        <button onClick={() => navigate("/signup")} className="bg-white text-gray-900 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition-colors text-base">
          Create a free account
        </button>
      </section>
    </InfoLayout>
  );
}
