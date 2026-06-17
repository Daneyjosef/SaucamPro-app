import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MENU_ITEMS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    label: "Preferences",
    href: null,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Help",
    href: "/help",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    label: "Legal",
    href: "/terms",
  },
];

export default function SettingsPanel({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
          className="absolute inset-0 bg-white rounded-3xl z-20 flex flex-col overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center px-5 pt-5 pb-4 border-b border-gray-100">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <p className="font-bold text-gray-900 text-base mx-auto">Settings</p>
            <div className="w-8" />
          </div>

          {/* Sign-in section */}
          <div className="flex flex-col items-center px-6 pt-5 pb-5 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center mb-3 shadow-lg">
              <img src="/favicon.png" alt="SaucamPro" className="w-10 h-10 object-contain" />
            </div>
            <p className="font-bold text-gray-900 text-base mb-1">Welcome to SaucamPro</p>
            <p className="text-gray-400 text-xs text-center mb-4">Sign in to unlock the full experience</p>
            <button
              onClick={() => { onClose(); navigate("/login"); }}
              className="w-full py-3.5 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 transition-colors"
            >
              Sign in
            </button>
          </div>

          {/* Menu items */}
          <div className="px-4 py-3">
            <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-100">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.href) { onClose(); navigate(item.href); }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="font-semibold text-gray-900 text-sm flex-1">{item.label}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
