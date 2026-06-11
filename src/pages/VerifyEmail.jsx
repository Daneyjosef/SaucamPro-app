import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export default function VerifyEmail() {
  const location = useLocation();
  const email = location.state?.email || "";
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error("No email address found. Please sign up again.");
      return;
    }
    setResending(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resend({ type: "signup", email });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Verification email resent!");
        }
      } else {
        await new Promise((r) => setTimeout(r, 600));
        toast.success("Verification email resent!");
      }
    } finally {
      setResending(false);
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

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.05 }}
          className="card p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
            className="w-20 h-20 bg-primary-accent/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </motion.div>

          <h1 className="text-2xl font-bold text-text-primary mb-2">Check your inbox</h1>
          <p className="text-text-secondary text-sm leading-relaxed mb-2">
            We've sent a verification link to
          </p>
          {email && (
            <p className="text-text-primary font-semibold text-sm mb-4">{email}</p>
          )}
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            Click the link in the email to activate your account. Check your spam folder if you don't see it.
          </p>

          <motion.button
            onClick={handleResend}
            disabled={resending}
            className="w-full border border-primary-border text-text-primary font-medium py-3 rounded-btn hover:bg-primary-border/30 transition-colors disabled:opacity-50 text-sm mb-4"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {resending ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-accent border-t-transparent rounded-full animate-spin" />
                Resending...
              </span>
            ) : (
              "Resend verification email"
            )}
          </motion.button>

          <Link to="/login" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            ← Back to login
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
