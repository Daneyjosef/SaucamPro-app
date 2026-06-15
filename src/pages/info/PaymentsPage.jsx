import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import InfoLayout from "../../components/layout/InfoLayout";

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: "spring", stiffness: 280, damping: 24 } }) };

const FEATURES = [
  { icon: "⚡", title: "Instant settlement", desc: "Receive crypto payments and settle to your NGN bank account in real time. No waiting, no delays." },
  { icon: "🌍", title: "Accept any currency", desc: "Accept Bitcoin, Ethereum, USDT and more. We handle the conversion so you always receive NGN." },
  { icon: "🔗", title: "Payment links", desc: "Generate shareable payment links in seconds. No website or technical knowledge required." },
  { icon: "🖥️", title: "Developer API", desc: "Integrate crypto payments into your app or website with our clean, well-documented REST API." },
  { icon: "📊", title: "Real-time dashboard", desc: "Monitor transactions, volume, and settlements from a single dashboard. Export reports anytime." },
  { icon: "🔒", title: "Fraud protection", desc: "Automatic fraud detection, chargeback-proof transactions, and end-to-end encryption on every payment." },
];

const STEPS = [
  { n: "01", title: "Create an account", desc: "Sign up for SaucamPro and complete business verification. Takes less than 10 minutes." },
  { n: "02", title: "Get your payment address", desc: "We assign you a unique crypto payment address. Share it, embed it, or use the API." },
  { n: "03", title: "Accept payments", desc: "Customers pay in crypto. We notify you instantly and settle NGN to your bank account." },
];

export default function PaymentsPage() {
  const navigate = useNavigate();

  return (
    <InfoLayout>
      {/* HERO */}
      <section className="px-5 sm:px-10 pt-20 pb-16 bg-gradient-to-b from-green-50 to-white text-center">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto">
          <motion.p variants={fadeUp} custom={0} className="text-green-600 text-sm font-semibold uppercase tracking-widest mb-4">Payments</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Accept crypto payments<br className="hidden sm:block" /> for your business
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            The easiest way for Nigerian businesses to accept Bitcoin, Ethereum, and USDT — and settle directly to your NGN bank account.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/signup")} className="bg-gray-900 text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-700 transition-colors text-base">
              Get started — it's free
            </button>
            <button onClick={() => navigate("/contact")} className="border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-full hover:bg-gray-50 transition-colors text-base">
              Talk to sales
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-5 sm:px-10 py-14 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Start accepting payments in minutes</h2>
          <p className="text-gray-400 mb-12 text-sm">No coding required. Just sign up and share your payment link.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="text-4xl font-bold text-gray-100 mb-3">{s.n}</div>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Everything your business needs</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">Enterprise-grade infrastructure, startup-friendly pricing</p>
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

      {/* PRICING */}
      <section className="px-5 sm:px-10 py-14 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Simple, transparent pricing</h2>
          <p className="text-gray-400 mb-10 text-sm">No monthly fees. No hidden charges. Pay only when you receive.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Transaction fee", value: "1.0%", note: "per successful payment" },
              { label: "Settlement fee", value: "Free", note: "instant NGN settlement" },
              { label: "Payment links", value: "Free", note: "unlimited" },
              { label: "API access", value: "Free", note: "up to 1,000 calls/day" },
            ].map(p => (
              <div key={p.label} className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100">
                <p className="text-gray-400 text-sm mb-1">{p.label}</p>
                <p className="text-2xl font-bold text-gray-900">{p.value}</p>
                <p className="text-gray-400 text-xs mt-1">{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-10 py-20 text-center bg-green-600">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Start accepting crypto payments today</h2>
        <p className="text-green-100 mb-8 text-base max-w-md mx-auto">Join hundreds of Nigerian businesses already using SaucamPro Payments.</p>
        <button onClick={() => navigate("/signup")} className="bg-white text-green-600 font-bold px-10 py-4 rounded-full hover:bg-green-50 transition-colors text-base">
          Get started free
        </button>
      </section>
    </InfoLayout>
  );
}
