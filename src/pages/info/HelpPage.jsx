import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import InfoLayout from "../../components/layout/InfoLayout";

const CATEGORIES = [
  {
    icon: "🚀", title: "Getting started", faqs: [
      { q: "How do I create a SaucamPro account?", a: "Creating a SaucamPro account takes less than two minutes. Visit our sign-up page, enter your email address and a secure password, verify your email, and complete our KYC process by providing your BVN or NIN and a valid government-issued ID." },
      { q: "What documents do I need to verify my identity?", a: "We accept a National ID Card (NIN slip), Bank Verification Number (BVN), International Passport, or Driver's Licence. You'll also need to take a selfie for biometric verification. All documents must be current and clearly legible." },
      { q: "Is SaucamPro available outside Nigeria?", a: "SaucamPro currently serves users in Nigeria. We are expanding to other African markets and will announce availability in new countries on our website and social channels." },
    ]
  },
  {
    icon: "💳", title: "Deposits & withdrawals", faqs: [
      { q: "How do I fund my SaucamPro account?", a: "You can fund your account via bank transfer (all Nigerian banks supported), USSD, or debit card. Funds are credited instantly for most methods. Go to Wallet → Deposit and choose your preferred method." },
      { q: "How long do withdrawals take?", a: "NGN withdrawals to Nigerian bank accounts are processed within 5–30 minutes during business hours (8am–8pm WAT). Crypto withdrawals are sent to the blockchain immediately after internal processing, which typically takes 10–30 minutes." },
      { q: "What are the minimum and maximum deposit amounts?", a: "The minimum deposit is ₦500. There is no maximum deposit limit, though very large deposits may require additional verification under our AML policy." },
      { q: "Are there fees for deposits and withdrawals?", a: "Naira deposits are free. Naira withdrawals attract a small fee of ₦50 per transaction. Crypto withdrawals incur the standard network (gas) fee for the relevant blockchain, which varies with network congestion." },
    ]
  },
  {
    icon: "📊", title: "Trading", faqs: [
      { q: "What cryptocurrencies can I trade on SaucamPro?", a: "SaucamPro supports over 150 cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Solana (SOL), BNB, XRP, USDT, USDC, and many more. We regularly add new assets based on community demand and regulatory approval." },
      { q: "What trading fees does SaucamPro charge?", a: "Our standard trading fee is 1.0% per transaction for retail users. Higher-volume traders and verified institutional accounts receive tiered discounts. All fees are clearly displayed before you confirm any trade." },
      { q: "Can I set limit orders?", a: "Yes. SaucamPro supports both market orders (execute immediately at current price) and limit orders (execute only when price reaches your specified level). Limit orders are available from your Trade dashboard." },
      { q: "What happens if a trade fails?", a: "If a trade fails for any reason (insufficient balance, network error, price slippage), any debited funds are immediately returned to your wallet. You will receive an in-app notification explaining the reason for failure." },
    ]
  },
  {
    icon: "🔒", title: "Security", faqs: [
      { q: "How does SaucamPro keep my funds safe?", a: "We store the majority of customer digital assets in offline cold storage, use AES-256 encryption for data at rest and TLS 1.3 for data in transit, and conduct regular third-party security audits. We also maintain a reserve fund to cover unexpected events." },
      { q: "What is two-factor authentication (2FA) and should I enable it?", a: "2FA adds an extra layer of security by requiring a one-time code (from an app like Google Authenticator or via SMS) in addition to your password. We strongly recommend enabling 2FA. Go to Settings → Security to set it up." },
      { q: "What should I do if I think my account has been compromised?", a: "Immediately contact our support team via live chat at support@saucampro.com or call +234 800 000 0000. We will temporarily freeze your account, investigate the incident, and guide you through securing it. Change your password and 2FA immediately if you still have access." },
    ]
  },
  {
    icon: "🏛️", title: "Compliance & legal", faqs: [
      { q: "Is SaucamPro regulated?", a: "Yes. SaucamPro holds a Digital Asset Exchange Operator (DAEO) licence issued by the Securities and Exchange Commission of Nigeria (SEC). We comply fully with all applicable Nigerian regulations including AML/CFT, KYC, and data protection laws." },
      { q: "Do I need to pay taxes on my crypto gains?", a: "In Nigeria, capital gains from cryptocurrency trading may be subject to Capital Gains Tax (CGT). SaucamPro does not provide tax advice. We recommend consulting a qualified Nigerian tax professional. We can provide transaction history exports to assist with your tax filings." },
      { q: "Why has my account been restricted?", a: "Account restrictions may be applied for a number of reasons including incomplete KYC, suspicious activity detected by our fraud prevention systems, or a request from a competent Nigerian regulatory authority. Contact support@saucampro.com for assistance." },
    ]
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left gap-4">
        <span className="font-medium text-gray-900 text-sm">{q}</span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="text-gray-500 text-sm leading-relaxed pb-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HelpPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? CATEGORIES.map(c => ({ ...c, faqs: c.faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())) })).filter(c => c.faqs.length > 0)
    : [CATEGORIES[active]];

  return (
    <InfoLayout>
      {/* HERO */}
      <section className="px-5 sm:px-10 pt-20 pb-16 bg-gradient-to-b from-gray-900 to-gray-800 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Help Center</h1>
          <p className="text-gray-400 mb-8">Find answers to the most common questions about SaucamPro</p>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for help..."
            className="w-full max-w-lg mx-auto block bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition-colors text-sm"
          />
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="px-5 sm:px-10 py-12 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10">
          {/* sidebar */}
          {!search && (
            <div className="flex-shrink-0 md:w-48">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Categories</p>
              <ul className="space-y-1">
                {CATEGORIES.map((c, i) => (
                  <li key={c.title}>
                    <button onClick={() => setActive(i)} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 ${active === i ? "bg-gray-900 text-white font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
                      <span>{c.icon}</span>{c.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* faqs */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-medium text-gray-900 mb-1">No results found</p>
                <p className="text-sm">Try a different search term or <button onClick={() => navigate("/contact")} className="text-blue-600 hover:underline">contact support</button>.</p>
              </div>
            ) : (
              filtered.map(cat => (
                <div key={cat.title} className="mb-10">
                  {(search || filtered.length > 1) && <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span>{cat.icon}</span>{cat.title}</h2>}
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 px-5">
                    {cat.faqs.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* STILL NEED HELP */}
      <section className="px-5 sm:px-10 py-14 bg-gray-50 border-t border-gray-100 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h2>
        <p className="text-gray-400 text-sm mb-6">Our support team is available 7 days a week, 8am–10pm WAT.</p>
        <button onClick={() => navigate("/contact")} className="bg-gray-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-700 transition-colors text-sm">
          Contact support
        </button>
      </section>
    </InfoLayout>
  );
}
