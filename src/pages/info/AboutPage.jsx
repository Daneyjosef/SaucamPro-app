import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import InfoLayout from "../../components/layout/InfoLayout";

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: "spring", stiffness: 280, damping: 24 } }) };

const VALUES = [
  { icon: "🇳🇬", title: "Built for Nigeria", desc: "We are a Nigerian company, built by Nigerians, for Nigerians. Every product decision starts with understanding the unique needs of our market." },
  { icon: "🔒", title: "Security first", desc: "We hold a Nigerian SEC digital assets licence and comply with all CBN and SEC regulations. Your assets are safe, your data is private." },
  { icon: "⚡", title: "Speed and simplicity", desc: "Crypto should be as easy as mobile banking. We obsess over making complex financial infrastructure feel effortless." },
  { icon: "🌍", title: "Financial inclusion", desc: "We believe every Nigerian deserves access to global financial markets. SaucamPro breaks down the barriers that have kept people out." },
  { icon: "🤝", title: "Transparency", desc: "No hidden fees, no vague terms. We are upfront about what we charge, how we operate, and who we are." },
  { icon: "🚀", title: "Constant improvement", desc: "We ship fast, listen to feedback, and iterate. Our community drives our roadmap and we build in public." },
];

const STATS = [
  { value: "50,000+", label: "Registered users" },
  { value: "₦2B+", label: "Transaction volume" },
  { value: "150+", label: "Supported assets" },
  { value: "99.9%", label: "Platform uptime" },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <InfoLayout>
      {/* HERO */}
      <section className="px-5 sm:px-10 pt-20 pb-16 bg-gradient-to-b from-gray-900 to-gray-800 text-center text-white">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto">
          <motion.p variants={fadeUp} custom={0} className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-4">About SaucamPro</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            Nigeria's home for<br className="hidden sm:block" /> digital assets
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-gray-300 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            SaucamPro is Nigeria's SEC-licensed digital asset trading platform. We are on a mission to make crypto accessible, safe, and useful for every Nigerian.
          </motion.p>
        </motion.div>
      </section>

      {/* MISSION */}
      <section className="px-5 sm:px-10 py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Our mission</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Democratising access to global crypto markets for Africa</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              We started SaucamPro because we believed that Nigerians deserved a world-class crypto trading experience — one built with the Nigerian user in mind, not an afterthought of a foreign platform.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Today, we serve tens of thousands of users across Nigeria, offering a regulated, secure, and intuitive platform for buying, selling, and managing digital assets.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-shrink-0">
            {STATS.map(s => (
              <div key={s.label} className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-gray-400 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-5 sm:px-10 py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">What we believe in</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">The values that guide every decision we make</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEC BADGE */}
      <section className="px-5 sm:px-10 py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm mb-6">
            <span className="text-2xl">🛡️</span>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-sm">SEC-Licensed Digital Asset Exchange</p>
              <p className="text-gray-400 text-xs">Securities and Exchange Commission of Nigeria</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Regulated, compliant, and trustworthy</h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xl mx-auto">
            SaucamPro holds a Digital Asset Exchange Operator (DAEO) licence issued by the Nigerian Securities and Exchange Commission. We comply fully with CBN and SEC regulations on virtual assets, AML/CFT, and customer data protection.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-10 py-20 text-center bg-gray-900">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Join the SaucamPro community</h2>
        <p className="text-gray-400 mb-8 text-base max-w-md mx-auto">Start trading today and be part of Nigeria's fastest-growing crypto platform.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate("/signup")} className="bg-white text-gray-900 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition-colors text-base">
            Create free account
          </button>
          <button onClick={() => navigate("/contact")} className="border border-gray-600 text-gray-300 font-semibold px-10 py-4 rounded-full hover:border-gray-400 hover:text-white transition-colors text-base">
            Contact us
          </button>
        </div>
      </section>
    </InfoLayout>
  );
}
