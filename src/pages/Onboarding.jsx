import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAppStore } from "../store/useAppStore";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export default function Onboarding() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);

  const googleName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || "";
  const avatarUrl = user?.user_metadata?.avatar_url;

  // All hooks must come before any early return
  const [username, setUsername] = useState(googleName);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false);

  // Keep input in sync if user loads asynchronously
  useEffect(() => {
    if (!edited && googleName) setUsername(googleName);
  }, [googleName, edited]);

  // Synchronous check — returning user never sees the form at all
  if (user?.id && localStorage.getItem(`saucampro-onboarded-${user.id}`)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  const initial = username.trim().charAt(0).toUpperCase() || "?";

  const handleContinue = async (e) => {
    e.preventDefault();
    const name = username.trim();
    if (!name) {
      toast.error("Please enter a display name");
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.updateUser({
          data: { username: name },
        });
        if (error) throw error;
        // Flag before setUser so any re-render triggered by the store update
        // already sees it and the form never flashes again
        if (user?.id) localStorage.setItem(`saucampro-onboarded-${user.id}`, "true");
        setUser(data.user);
      } else {
        if (user?.id) localStorage.setItem(`saucampro-onboarded-${user.id}`, "true");
        setUser({ ...user, name });
      }

      toast.success(`Welcome, ${name}!`);
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-10 h-10 bg-primary-accent rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">₿</span>
          </div>
        </div>

        <div className="card p-8">
          {/* Avatar */}
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary-accent/25">
                <AnimatePresence mode="wait">
                  {avatarUrl ? (
                    <motion.img
                      key="avatar"
                      src={avatarUrl}
                      alt="Your photo"
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  ) : (
                    <motion.div
                      key="initial"
                      className="w-full h-full bg-gradient-to-br from-primary-accent to-purple-600 flex items-center justify-center text-white font-bold text-3xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {initial}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Verified badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gain rounded-full border-2 border-primary-bg flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <span className="text-text-secondary text-xs">Signed in with Google</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl font-bold text-text-primary text-center mb-1"
          >
            One last step
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary text-sm text-center mb-8"
          >
            This is how you'll appear on SaucamPro. Keep your Google name or choose something else.
          </motion.p>

          <form onSubmit={handleContinue} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
                Display Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setEdited(true);
                  }}
                  placeholder="Enter your name"
                  className="input-field pr-10 text-base font-medium"
                  autoFocus
                  maxLength={32}
                />
                {/* Clear / reset button */}
                {edited && username !== googleName && googleName && (
                  <button
                    type="button"
                    onClick={() => { setUsername(googleName); setEdited(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors text-xs font-medium"
                    title="Reset to Google name"
                  >
                    Reset
                  </button>
                )}
              </div>
              <p className="text-text-secondary text-xs mt-1.5 flex justify-between">
                <span>You can change this anytime in Settings</span>
                <span className={username.trim().length > 28 ? "text-loss" : ""}>
                  {username.trim().length}/32
                </span>
              </p>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading || !username.trim()}
              className="w-full bg-primary-accent text-white font-semibold py-3 rounded-btn hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Setting up your account…
                </span>
              ) : (
                "Get Started →"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
