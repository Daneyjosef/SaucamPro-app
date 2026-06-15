import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import InfoLayout from "../../components/layout/InfoLayout";

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: "spring", stiffness: 280, damping: 24 } }) };

const USECASES = [
  { icon: "🛍️", title: "Shop online", desc: "Pay at thousands of online merchants worldwide using your crypto balance. Converted at the best available rate." },
  { icon: "🍔", title: "Food & dining", desc: "Order from your favourite restaurants and food delivery platforms. Pay with Bitcoin, Ethereum, or any supported coin." },
  { icon: "✈️", title: "Travel & hotels", desc: "Book flights, hotels, and experiences using crypto. Access global travel at your fingertips." },
  { icon: "⛽", title: "Bills & utilities", desc: "Pay electricity, data, airtime, and other bills directly from your SaucamPro wallet — no conversion needed." },
  { icon: "🎮", title: "Gaming & entertainment", desc: "Fund gaming wallets, buy gift cards, and pay for streaming services with crypto." },
  { icon: "💸", title: "Peer-to-peer payments", desc: "Send crypto to friends and family instantly. No bank required, no delays, ultra-low fees." },
];

export default function SpendPage() {
  const navigate = useNavigate();

  return (
    <InfoLayout>
      {/* HERO */}
      <section className="px-5 sm:px-10 pt-20 pb-16 bg-gradient-to-b from-purple-50 to-white text-center">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto">
          <motion.p variants={fadeUp} custom={0} className="text-purple-600 text-sm font-semibold uppercase tracking-widest mb-4">Spend</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Spend crypto<br className="hidden sm:block" /> anywhere in the world
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Use your crypto for everyday purchases. Pay bills, shop online, send money to friends — all with the tap of a button.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/signup")} className="bg-gray-900 text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-700 transition-colors text-base">
              Get your card
            </button>
            <button onClick={() => navigate("/buy")} className="border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-full hover:bg-gray-50 transition-colors text-base">
              Buy crypto
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* CARD VISUAL */}
      <section className="px-5 sm:px-10 py-14 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex-shrink-0">
            <div className="w-72 h-44 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 p-6 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
              <img src="/favicon.png" alt="" className="h-7 w-auto mb-8 relative z-10" />
              <p className="text-gray-400 text-xs mb-1 relative z-10">Balance</p>
              <p className="text-2xl font-bold relative z-10">₦ 0.00</p>
              <p className="text-gray-500 text-xs mt-4 relative z-10">•••• •••• •••• 0000</p>
            </div>
          </motion.div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">The SaucamPro virtual card</h2>
            <p className="text-gray-500 leading-relaxed mb-4">Get a virtual Visa card loaded with your crypto balance. Use it anywhere Visa is accepted — online or in stores. Your crypto is automatically converted at the best available rate when you pay.</p>
            <ul className="space-y-2 text-sm text-gray-500">
              {["Instant issuance — no waiting", "Zero foreign transaction fees", "Real-time spend notifications", "Lock or unlock your card instantly"].map(f => (
                <li key={f} className="flex items-center gap-2"><span className="text-green-500">✓</span>{f}</li>
              ))}
            </ul>
            <button onClick={() => navigate("/signup")} className="mt-6 bg-gray-900 text-white font-semibold px-7 py-3 rounded-full hover:bg-gray-700 transition-colors text-sm">
              Get my card
            </button>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="px-5 sm:px-10 py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">What can you spend crypto on?</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">Everyday use cases, now powered by crypto</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {USECASES.map((f, i) => (
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
      <section className="px-5 sm:px-10 py-20 text-center bg-purple-600">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Your crypto. Your money. Spend it.</h2>
        <p className="text-purple-100 mb-8 text-base max-w-md mx-auto">Get your SaucamPro card and start spending crypto in minutes.</p>
        <button onClick={() => navigate("/signup")} className="bg-white text-purple-600 font-bold px-10 py-4 rounded-full hover:bg-purple-50 transition-colors text-base">
          Get started free
        </button>
      </section>
    </InfoLayout>
  );
}
