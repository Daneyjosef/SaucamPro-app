import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, type: "spring", stiffness: 320, damping: 26 },
  }),
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          toast.error(error.message);
        } else {
          setSent(true);
          toast.success("Reset link sent!");
        }
      } else {
        await new Promise((r) => setTimeout(r, 800));
        setSent(true);
        toast.success("If that email exists, a reset link has been sent.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">₿</span>
            </div>
            <span className="text-2xl font-bold text-text-primary">SaucamPro</span>
          </Link>
        </motion.div>

        <div className="card p-8">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-gain/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gain" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">Check your email</h2>
                <p className="text-text-secondary text-sm mb-6">
                  We've sent a password reset link to <span className="text-text-primary font-medium">{email}</span>
                </p>
                <Link
                  to="/login"
                  className="text-primary-accent hover:underline text-sm font-medium"
                >
                  Back to login
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.h1
                  custom={0}
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-2xl font-bold text-text-primary mb-1"
                >
                  Forgot password?
                </motion.h1>
                <motion.p
                  custom={1}
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-text-secondary text-sm mb-7"
                >
                  Enter your email and we'll send you a reset link.
                </motion.p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                    <label className="block text-text-primary text-sm font-medium mb-2">Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-field"
                      autoComplete="email"
                    />
                  </motion.div>

                  <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary-accent text-white font-semibold py-3 rounded-btn hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </motion.span>
                        ) : (
                          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            Send Reset Link
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                </form>

                <p className="text-center text-text-secondary text-sm mt-7">
                  Remember it?{" "}
                  <Link to="/login" className="text-primary-accent hover:underline font-medium">
                    Back to login
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
