import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import InfoLayout from "../../components/layout/InfoLayout";

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: "spring", stiffness: 280, damping: 24 } }) };

const FEATURES = [
  { icon: "🔁", title: "Recurring buys", desc: "Set up automatic purchases on a daily, weekly, or monthly schedule. Dollar-cost average into your favourite assets effortlessly." },
  { icon: "📊", title: "Portfolio tracking", desc: "See your entire crypto portfolio in one place. Track performance, P&L, and allocation at a glance." },
  { icon: "🎯", title: "Price alerts", desc: "Set target prices and get notified the moment a coin hits your level. Never miss a market move again." },
  { icon: "🛡️", title: "Non-custodial option", desc: "Keep control of your private keys. SaucamPro supports self-custody wallets via WalletConnect." },
  { icon: "💳", title: "Easy funding", desc: "Fund your account with Naira via bank transfer, USSD, or card. Withdraw to any Nigerian bank instantly." },
  { icon: "📰", title: "Crypto news", desc: "Stay informed with curated market news, analysis, and on-chain data — all inside the app." },
];

const PLANS = [
  { name: "Starter", amount: "₦5,000", period: "/ month", desc: "Perfect for beginners building their first crypto portfolio.", features: ["Up to 5 assets", "Weekly recurring buys", "Basic price alerts", "Portfolio dashboard"] },
  { name: "Growth", amount: "₦15,000", period: "/ month", desc: "For active investors who want more control and automation.", features: ["Unlimited assets", "Daily recurring buys", "Advanced alerts", "P&L analytics", "Priority support"], highlight: true },
  { name: "Pro", amount: "₦40,000", period: "/ month", desc: "For power users and professional portfolio managers.", features: ["Everything in Growth", "API access", "Multi-wallet tracking", "Tax report export", "Dedicated account manager"] },
];

export default function InvestPage() {
  const navigate = useNavigate();

  return (
    <InfoLayout>
      {/* HERO */}
      <section className="px-5 sm:px-10 pt-20 pb-16 bg-gradient-to-b from-blue-50 to-white text-center">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto">
          <motion.p variants={fadeUp} custom={0} className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-4">Invest</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Grow your crypto<br className="hidden sm:block" /> portfolio over time
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Invest in crypto the smart way. Set up recurring buys, track your portfolio performance, and build long-term wealth — all in one place.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/signup")} className="bg-gray-900 text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-700 transition-colors text-base">
              Start investing
            </button>
            <button onClick={() => navigate("/buy")} className="border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-full hover:bg-gray-50 transition-colors text-base">
              Buy crypto now
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-5 sm:px-10 py-14 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">How it works</h2>
          <p className="text-gray-400 mb-12 text-sm">Start investing in three simple steps</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create your account", desc: "Sign up in minutes with your email. Complete a quick identity verification to unlock full investment features." },
              { step: "02", title: "Fund your account", desc: "Add Naira to your SaucamPro wallet via bank transfer, USSD, or debit card. Funds arrive instantly." },
              { step: "03", title: "Start investing", desc: "Buy your first crypto, set up a recurring investment plan, and watch your portfolio grow over time." },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="text-4xl font-bold text-gray-100 mb-3">{s.step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 sm:px-10 py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Built for long-term investors</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">Tools that help you stay disciplined and informed</p>
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

      {/* PLANS */}
      <section className="px-5 sm:px-10 py-14 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Choose your plan</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">Start free, upgrade anytime</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-6 border ${plan.highlight ? "border-gray-900 bg-gray-900 text-white" : "border-gray-100 bg-gray-50"}`}>
                <p className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-gray-400" : "text-gray-400"}`}>{plan.name}</p>
                <p className={`text-3xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}>{plan.amount}<span className="text-sm font-normal opacity-60">{plan.period}</span></p>
                <p className={`text-xs mb-6 ${plan.highlight ? "text-gray-400" : "text-gray-400"}`}>{plan.desc}</p>
                <ul className={`space-y-2 text-sm mb-6 ${plan.highlight ? "text-gray-300" : "text-gray-500"}`}>
                  {plan.features.map(f => <li key={f} className="flex items-center gap-2"><span className={plan.highlight ? "text-green-400" : "text-green-500"}>✓</span>{f}</li>)}
                </ul>
                <button onClick={() => navigate("/signup")} className={`w-full py-3 rounded-full font-semibold text-sm transition-colors ${plan.highlight ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-gray-900 text-white hover:bg-gray-700"}`}>
                  Get started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-10 py-20 text-center bg-blue-600">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">The best time to invest was yesterday.<br />The second best time is now.</h2>
        <p className="text-blue-100 mb-8 text-base max-w-md mx-auto">Start building your crypto portfolio today with as little as ₦1,000.</p>
        <button onClick={() => navigate("/signup")} className="bg-white text-blue-600 font-bold px-10 py-4 rounded-full hover:bg-blue-50 transition-colors text-base">
          Start for free
        </button>
      </section>
    </InfoLayout>
  );
}
