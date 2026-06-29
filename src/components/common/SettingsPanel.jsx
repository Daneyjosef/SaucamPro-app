import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import { CURRENCIES } from "../../lib/constants";

const BackIcon = () => (
  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ExternalIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

function PreferencesPanel({ onBack }) {
  const currency = useAppStore((s) => s.currency);
  const setCurrency = useAppStore((s) => s.setCurrency);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const [view, setView] = useState(null); // null | "currency" | "theme"

  if (view === "currency") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <button onClick={() => setView(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <BackIcon />
          </button>
          <p className="font-bold text-gray-900 text-base mx-auto">Currency</p>
          <div className="w-8" />
        </div>
        <div className="overflow-y-auto flex-1 px-4 py-3">
          <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-100">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code); setView(null); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors text-left"
              >
                <span className="w-7 text-center font-bold text-gray-700 text-sm">{c.flag}</span>
                <span className="text-gray-900 text-sm font-semibold flex-1">{c.code.toUpperCase()}</span>
                <span className="text-gray-400 text-xs">{c.name}</span>
                {currency === c.code && (
                  <svg className="w-4 h-4 text-blue-500 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === "theme") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <button onClick={() => setView(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <BackIcon />
          </button>
          <p className="font-bold text-gray-900 text-base mx-auto">Theme</p>
          <div className="w-8" />
        </div>
        <div className="px-4 py-3">
          <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-100">
            {[{ value: "light", label: "Light", icon: "☀️" }, { value: "dark", label: "Dark", icon: "🌙" }].map((t) => (
              <button
                key={t.value}
                onClick={() => { setTheme(t.value); setView(null); }}
                className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-100 transition-colors text-left"
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-gray-900 text-sm font-semibold flex-1">{t.label}</span>
                {theme === t.value && (
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <BackIcon />
        </button>
        <p className="font-bold text-gray-900 text-base mx-auto">Preferences</p>
        <div className="w-8" />
      </div>
      <div className="px-4 py-3">
        <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-100">
          <button onClick={() => setView("currency")} className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-100 transition-colors text-left">
            <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm flex-1">Currency</span>
            <ChevronRight />
          </button>
          <button onClick={() => setView("theme")} className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-100 transition-colors text-left">
            <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm flex-1">Theme</span>
            <ChevronRight />
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-100 transition-colors text-left">
            <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm flex-1">Cookies</span>
            <ExternalIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPanel({ open, onClose }) {
  const navigate = useNavigate();
  const [view, setView] = useState("main"); // "main" | "preferences"

  const handleClose = () => { setView("main"); onClose(); };

  const MENU_ITEMS = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      label: "Preferences",
      action: () => setView("preferences"),
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Help",
      action: () => { handleClose(); navigate("/help"); },
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      label: "Legal",
      action: () => { handleClose(); navigate("/terms"); },
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
          className="absolute inset-0 bg-white rounded-3xl z-20 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {view === "preferences" ? (
              <motion.div key="prefs" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 380, damping: 34 }} className="absolute inset-0 overflow-y-auto">
                <PreferencesPanel onBack={() => setView("main")} />
              </motion.div>
            ) : (
              <motion.div key="main" initial={{ x: 0 }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 380, damping: 34 }} className="absolute inset-0 overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="flex items-center px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
                  <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <BackIcon />
                  </button>
                  <p className="font-bold text-gray-900 text-base mx-auto">Settings</p>
                  <div className="w-8" />
                </div>

                {/* Sign-in section */}
                <div className="flex flex-col items-center px-6 pt-5 pb-5 border-b border-gray-100 flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center mb-3 shadow-lg">
                    <img src="/favicon.png" alt="SaucamPro" className="w-10 h-10 object-contain" />
                  </div>
                  <p className="font-bold text-gray-900 text-base mb-1">Welcome to SaucamPro</p>
                  <p className="text-gray-400 text-xs text-center mb-4">Sign in to unlock the full experience</p>
                  <button onClick={() => { handleClose(); navigate("/login"); }} className="w-full py-3.5 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 transition-colors">
                    Sign in
                  </button>
                </div>

                {/* Menu items */}
                <div className="px-4 py-3">
                  <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-100">
                    {MENU_ITEMS.map((item) => (
                      <button key={item.label} onClick={item.action} className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-100 transition-colors text-left">
                        <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                          {item.icon}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm flex-1">{item.label}</span>
                        <ChevronRight />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
