import { useState } from "react";
import { motion } from "framer-motion";
import InfoLayout from "../../components/layout/InfoLayout";

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: "spring", stiffness: 280, damping: 24 } }) };

const CHANNELS = [
  { icon: "💬", title: "Live chat", desc: "Chat with our support team in real time. Available Monday–Friday, 8am–8pm GMT.", action: "Start a chat", href: "#" },
  { icon: "📧", title: "Email support", desc: "Send us a message and we'll get back to you within 24 hours.", action: "support@saucampro.com", href: "mailto:support@saucampro.com" },
  { icon: "📞", title: "Phone support", desc: "Speak directly with our team. Available Monday–Friday, 9am–5pm GMT.", action: "+1 800 000 0000", href: "tel:+18000000000" },
  { icon: "🐦", title: "Twitter / X", desc: "Tweet us or send a DM. We monitor our social channels closely.", action: "@SaucamPro", href: "#" },
];

const TOPICS = ["General enquiry", "Account & verification", "Deposits & withdrawals", "Trading issue", "Security concern", "Business / partnerships", "Press enquiry", "Other"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <InfoLayout>
      {/* HERO */}
      <section className="px-5 sm:px-10 pt-20 pb-16 bg-gradient-to-b from-gray-50 to-white text-center">
        <motion.div initial="hidden" animate="visible" className="max-w-2xl mx-auto">
          <motion.p variants={fadeUp} custom={0} className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-4">Contact</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">We're here to help</motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-lg leading-relaxed">
            Our support team is available seven days a week. Choose the channel that works best for you.
          </motion.p>
        </motion.div>
      </section>

      {/* CONTACT CHANNELS */}
      <section className="px-5 sm:px-10 py-14 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CHANNELS.map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex gap-4">
                <div className="text-3xl flex-shrink-0">{c.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{c.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">{c.desc}</p>
                  <a href={c.href} className="text-blue-600 font-semibold text-sm hover:underline">{c.action}</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="px-5 sm:px-10 py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Send us a message</h2>
          <p className="text-gray-400 text-center text-sm mb-10">We'll get back to you within one business day.</p>

          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Message sent!</h3>
              <p className="text-gray-500 text-sm">Thank you for reaching out. Our support team will reply within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Topic</label>
                <select required value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors bg-white">
                  <option value="">Select a topic</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Describe your issue or question in detail..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors resize-none" />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white font-semibold py-4 rounded-xl hover:bg-gray-700 transition-colors text-sm">
                Send message
              </button>
            </form>
          )}
        </div>
      </section>

      {/* OFFICE */}
      <section className="px-5 sm:px-10 py-14 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Our offices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left">
              <p className="font-bold text-gray-900 mb-1">Global HQ</p>
              <p className="text-gray-400 text-sm">SaucamPro International<br />contact@saucampro.com</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left">
              <p className="font-bold text-gray-900 mb-1">Support</p>
              <p className="text-gray-400 text-sm">24 / 7 online support<br />support@saucampro.com</p>
            </div>
          </div>
        </div>
      </section>
    </InfoLayout>
  );
}
