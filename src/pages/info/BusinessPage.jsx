import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import InfoLayout from "../../components/layout/InfoLayout";

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: "spring", stiffness: 280, damping: 24 } }) };

const SERVICES = [
  {
    slug: "crypto-storage",
    title: "Saucam Crypto Storage",
    desc: "Keep your business's digital assets safe with institutional-grade custody. Multi-signature wallets, cold storage, and 24/7 monitoring protect your holdings around the clock.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l1.8 1.8L15 10" />
      </svg>
    ),
    gradient: "from-blue-600 to-blue-900",
  },
  {
    slug: "coin-exchange",
    title: "Saucam Coin Exchange",
    desc: "Swap between cryptocurrencies instantly at competitive, transparent rates. Built for businesses that need fast settlement without slippage surprises.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
    gradient: "from-emerald-600 to-emerald-900",
  },
  {
    slug: "local-currencies",
    title: "Saucam Coin / Any Local Currencies",
    desc: "Convert Saucam Coin to and from local currencies wherever you operate. Settle payroll, vendors, and invoices in the currency your business needs.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
      </svg>
    ),
    gradient: "from-amber-600 to-amber-900",
  },
  {
    slug: "trade",
    title: "Saucam Trade",
    desc: "Access deep liquidity and real-time market data to execute business-grade trades across hundreds of crypto pairs, with dedicated support when you need it.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: "from-purple-600 to-purple-900",
  },
  {
    slug: "buybacks",
    title: "Saucam Buybacks",
    desc: "Manage treasury exposure with structured buyback programs. Sell back at fair market value with predictable, scheduled settlement.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 0115-6.7M21 12a9 9 0 01-15 6.7M3 5v5h5M21 19v-5h-5" />
      </svg>
    ),
    gradient: "from-rose-600 to-rose-900",
  },
  {
    slug: "buy-sale",
    title: "Saucam Buy/Sale",
    desc: "A simple, reliable way for businesses to buy or sell crypto in bulk — cards, bank transfers, or wires, with rates built for volume.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    gradient: "from-cyan-600 to-cyan-900",
  },
];

export default function BusinessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  return (
    <InfoLayout>
      {/* HERO */}
      <section className="px-5 sm:px-10 pt-20 pb-16 bg-gradient-to-b from-gray-50 to-white text-center">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto">
          <motion.p variants={fadeUp} custom={0} className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-4">Business</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            All-in-one crypto<br className="hidden sm:block" /> infrastructure for business
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Storage, exchange, trade, and settlement — everything your business needs to operate on crypto, in one platform.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/signup")} className="bg-gray-900 text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-700 transition-colors text-base">
              Create a business account
            </button>
            <button onClick={() => navigate("/contact")} className="border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-full hover:bg-gray-50 transition-colors text-base">
              Speak to our team
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* SERVICES — alternating write-up + visual */}
      {SERVICES.map((service, i) => (
        <section
          key={service.slug}
          id={service.slug}
          className={`px-5 sm:px-10 py-16 sm:py-20 border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
        >
          <div className={`max-w-5xl mx-auto flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-10 md:gap-16`}>
            <motion.div
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex-1"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{service.title}</h2>
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-6">{service.desc}</p>
              <button
                onClick={() => navigate("/signup")}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Get started →
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`flex-1 w-full aspect-[4/3] rounded-3xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shadow-xl`}
            >
              {service.icon}
            </motion.div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="px-5 sm:px-10 py-20 text-center bg-gray-900">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to grow your business with Saucam?</h2>
        <p className="text-gray-400 mb-8 text-base max-w-md mx-auto">Join businesses across Africa using SaucamPro for payments, storage, and treasury.</p>
        <button onClick={() => navigate("/signup")} className="bg-white text-gray-900 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition-colors text-base">
          Create a business account
        </button>
      </section>
    </InfoLayout>
  );
}
