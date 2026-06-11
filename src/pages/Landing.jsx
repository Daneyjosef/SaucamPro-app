import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { fetchCoins } from "../lib/api";
import { useCurrency } from "../hooks/useCurrency";

/* ─── animation presets ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 280, damping: 24 },
  }),
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

/* ─── static data ─── */
const NAV_LINKS = ["Features", "Markets", "About"];

const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Real-time Prices",
    desc: "Live market data for 10,000+ cryptocurrencies, updated every 30 seconds with accurate CoinGecko feeds.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "20+ Currencies",
    desc: "View prices in USD, EUR, GBP, NGN, JPY and 15+ more currencies. Switch instantly across the entire app.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Portfolio Tracking",
    desc: "Track your holdings across assets. Add buys at historical prices, monitor P&L, and analyse performance.",
  },
];


/* ─── floating orb component ─── */
function Orb({ x, y, size, color, delay }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color }}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ─── live ticker strip ─── */
function HeroTicker({ coins }) {
  const { formatPrice } = useCurrency();
  if (!coins.length) return null;
  const items = [...coins, ...coins];
  return (
    <div className="overflow-hidden w-full mt-8 mb-2">
      <div className="flex animate-marquee w-max gap-6">
        {items.map((coin, i) => (
          <div key={`${coin.id}-${i}`} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex-shrink-0">
            <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
            <span className="text-white/80 text-xs font-semibold">{coin.symbol?.toUpperCase()}</span>
            <span className="text-white text-xs font-bold">{formatPrice(coin.current_price)}</span>
            <span className={`text-xs font-semibold ${coin.price_change_percentage_24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {coin.price_change_percentage_24h >= 0 ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── market preview table ─── */
function MarketPreview({ coins }) {
  const navigate = useNavigate();
  const { formatPrice, formatLargeNumber } = useCurrency();
  return (
    <div className="overflow-x-auto rounded-card border border-primary-border bg-primary-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-primary-border">
            <th className="text-left text-text-secondary text-xs font-medium py-3 px-4">#</th>
            <th className="text-left text-text-secondary text-xs font-medium py-3 px-4">Coin</th>
            <th className="text-right text-text-secondary text-xs font-medium py-3 px-4">Price</th>
            <th className="text-right text-text-secondary text-xs font-medium py-3 px-4">24h</th>
            <th className="text-right text-text-secondary text-xs font-medium py-3 px-4 hidden sm:table-cell">Mkt Cap</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, idx) => (
            <tr
              key={coin.id}
              onClick={() => navigate("/signup")}
              className="border-b border-primary-border last:border-0 cursor-pointer hover:bg-primary-border/20 transition-colors"
            >
              <td className="py-3 px-4 text-text-secondary text-sm">{idx + 1}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                  <div>
                    <p className="text-text-primary font-semibold text-sm">{coin.symbol?.toUpperCase()}</p>
                    <p className="text-text-secondary text-xs hidden sm:block">{coin.name}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-right text-text-primary font-medium text-sm tabular-nums">
                {formatPrice(coin.current_price)}
              </td>
              <td className={`py-3 px-4 text-right text-sm font-semibold tabular-nums ${coin.price_change_percentage_24h >= 0 ? "text-gain" : "text-loss"}`}>
                {coin.price_change_percentage_24h >= 0 ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(2)}%
              </td>
              <td className="py-3 px-4 text-right text-text-secondary text-sm tabular-nums hidden sm:table-cell">
                {formatLargeNumber(coin.market_cap)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const heroRef = useRef(null);

  useEffect(() => {
    fetchCoins({ perPage: 10, sparkline: false }).then(setCoins).catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEmailCTA = (e) => {
    e.preventDefault();
    if (emailInput) navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-primary-bg text-text-primary overflow-x-hidden">

      {/* ════════════════════════════════
          NAVBAR
      ════════════════════════════════ */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-primary-bg/90 backdrop-blur-xl border-b border-primary-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">₿</span>
            </div>
            <span className="text-xl font-bold text-text-primary">SaucamPro</span>
          </div>

          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => navigate("/signup")}
                className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
              >
                {link}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate("/login")}
              className="text-text-secondary hover:text-text-primary font-medium text-sm px-4 py-2 rounded-btn transition-colors border border-transparent hover:border-primary-border"
              whileHover={{ scale: 1.02 }}
            >
              Log In
            </motion.button>
            <motion.button
              onClick={() => navigate("/signup")}
              className="bg-primary-accent text-white font-semibold text-sm px-5 py-2 rounded-btn hover:bg-blue-600 transition-colors shadow-sm shadow-primary-accent/20"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section ref={heroRef} className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 overflow-hidden bg-[#0A0B0D]">
        {/* Floating orbs */}
        <Orb x={10} y={20} size={480} color="rgba(0,82,255,0.12)" delay={0} />
        <Orb x={70} y={60} size={360} color="rgba(0,82,255,0.08)" delay={2.5} />
        <Orb x={50} y={5} size={260} color="rgba(5,177,105,0.06)" delay={1.2} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary-accent/10 text-primary-accent border border-primary-accent/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-accent animate-pulse" />
              Live market data · 10,000+ coins
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-6">
              Trade crypto with{" "}
              <span className="text-primary-accent">confidence</span>
            </h1>

            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Real-time markets, portfolio analytics, and enterprise-grade security — everything you need to manage your crypto in one place.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
              <motion.button
                onClick={() => navigate("/signup")}
                className="bg-primary-accent text-white font-semibold text-base px-8 py-3.5 rounded-btn hover:bg-blue-600 transition-colors shadow-xl shadow-primary-accent/25"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Start trading free
              </motion.button>
              <motion.button
                onClick={() => navigate("/app/markets")}
                className="border border-white/20 text-white font-semibold text-base px-8 py-3.5 rounded-btn hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                View markets →
              </motion.button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-white/40 mb-2">
              <span>⭐ 4.6★ App Store</span>
              <span>⭐ 4.5★ Google Play</span>
              <span>🔒 SEC-Licensed</span>
              <span>👤 1M+ users</span>
            </div>
          </motion.div>

          {/* Live ticker strip */}
          <HeroTicker coins={coins} />
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURES  — 3-column grid
      ════════════════════════════════ */}
      <section id="features" className="py-20 px-4 border-t border-primary-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-primary-accent text-sm font-semibold uppercase tracking-widest mb-3">
              Why SaucamPro
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-text-primary">
              Everything you need in one platform
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {FEATURES.map((feat, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                className="card p-6 group cursor-default"
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,82,255,0.12)" }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-accent/10 text-primary-accent flex items-center justify-center mb-4 group-hover:bg-primary-accent group-hover:text-white transition-colors duration-300">
                  {feat.icon}
                </div>
                <h3 className="text-text-primary font-bold text-lg mb-2">{feat.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════
          LIVE MARKET PREVIEW
      ════════════════════════════════ */}
      <section id="markets" className="py-20 px-4 border-t border-primary-border">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="text-center mb-10"
          >
            <motion.p variants={fadeUp} className="text-primary-accent text-sm font-semibold uppercase tracking-widest mb-3">
              Live markets
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Top cryptocurrencies right now
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-secondary">
              Prices update every 30 seconds — no refresh needed.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            {coins.length > 0 ? (
              <MarketPreview coins={coins.slice(0, 5)} />
            ) : (
              <div className="card py-12 text-center text-text-secondary text-sm">
                Loading market data...
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-6"
          >
            <motion.button
              onClick={() => navigate("/signup")}
              className="text-primary-accent font-semibold text-sm hover:underline"
              whileHover={{ scale: 1.04 }}
            >
              See all markets →
            </motion.button>
          </motion.div>
        </div>
      </section>


      {/* ════════════════════════════════
          CTA BANNER
      ════════════════════════════════ */}
      <section className="py-20 px-4 border-t border-primary-border">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Join 50,000+ traders on SaucamPro
          </motion.h2>
          <motion.p variants={fadeUp} className="text-text-secondary mb-8">
            Get started in minutes. No credit card required.
          </motion.p>
          <motion.form
            variants={fadeUp}
            onSubmit={handleEmailCTA}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-primary-card border border-primary-border rounded-btn px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent text-sm"
            />
            <motion.button
              type="submit"
              className="bg-primary-accent text-white font-semibold px-7 py-3 rounded-btn hover:bg-blue-600 transition-colors text-sm whitespace-nowrap"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Get started
            </motion.button>
          </motion.form>
        </motion.div>
      </section>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer className="border-t border-primary-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">₿</span>
                </div>
                <span className="text-lg font-bold text-text-primary">SaucamPro</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed mb-4">
                Nigeria's SEC-licensed digital assets platform — secure, transparent, and built for modern traders.
              </p>
              {/* Social icons */}
              <div className="flex gap-3">
                {["twitter", "telegram", "instagram"].map((s) => (
                  <button key={s} className="w-8 h-8 rounded-lg border border-primary-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary-accent transition-colors">
                    {s === "twitter" && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )}
                    {s === "telegram" && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    )}
                    {s === "instagram" && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-text-primary font-semibold text-sm mb-4">Products</h4>
              <ul className="space-y-2.5 text-text-secondary text-sm">
                {["Trade", "Invest", "Spend", "Payments"].map((l) => (
                  <li key={l} className="hover:text-text-primary cursor-pointer transition-colors">{l}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-text-primary font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2.5 text-text-secondary text-sm">
                {["About", "Blog", "Careers", "Press"].map((l) => (
                  <li key={l} className="hover:text-text-primary cursor-pointer transition-colors">{l}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-text-primary font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5 text-text-secondary text-sm">
                {["Privacy Policy", "Terms of Use", "Contact", "Help Center"].map((l) => (
                  <li key={l} className="hover:text-text-primary cursor-pointer transition-colors">{l}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-text-secondary text-xs">
            <span>&copy; 2026 SaucamPro. All rights reserved.</span>
            <span>SEC-Licensed · Built in Nigeria 🇳🇬</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
