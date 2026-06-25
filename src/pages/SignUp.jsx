import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAppStore } from "../store/useAppStore";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.7 29.3 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l5.9-5.9C34.4 5.1 29.5 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-4z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.5 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.9 1.1 8.1 2.9l5.9-5.9C34.4 5.1 29.5 3 24 3c-7.6 0-14.2 4.2-17.7 10.7z" />
    <path fill="#4CAF50" d="M24 43c5.3 0 10.1-1.9 13.8-5.1l-6.4-5.4C29.4 34.3 26.8 35 24 35c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.9 39 16.5 43 24 43z" />
    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.4 5.4C41.4 35.2 44 29.6 44 23c0-1.3-.1-2-.4-3z" />
  </svg>
);

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, type: "spring", stiffness: 320, damping: 26 },
  }),
};

function getStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["", "bg-loss", "bg-yellow-500", "bg-yellow-400", "bg-gain"];
const strengthTextColors = ["", "text-loss", "text-yellow-500", "text-yellow-400", "text-gain"];

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp, setUser } = useAppStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const strength = useMemo(() => getStrength(password), [password]);
  const passwordsMatch = confirmPassword ? password === confirmPassword : null;

  const handleGoogleSignUp = async () => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error("Supabase is not configured. Add your env vars to enable Google sign-up.");
      return;
    }
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/onboarding` },
    });
    if (error) {
      toast.error(error.message);
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to the Terms of Service");
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/app/dashboard`,
          },
        });
        if (error) {
          toast.error(error.message);
        } else if (data.user && !data.session) {
          // Email confirmation required
          navigate("/verify-email", { state: { email } });
        } else if (data.session) {
          // Auto-confirmed (e.g., email confirmation disabled in Supabase)
          setUser(data.user);
          toast.success("Account created! Welcome to SaucamPro.");
          navigate("/app/dashboard");
        }
      } else {
        // Local auth fallback
        await new Promise((r) => setTimeout(r, 700));
        const result = signUp({ name, email, password });
        if (result.ok) {
          toast.success("Account created! Welcome to SaucamPro.");
          navigate("/app/dashboard");
        } else {
          toast.error(result.error);
        }
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
          <motion.h1
            custom={0}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="text-2xl font-bold text-text-primary mb-1"
          >
            Create your account
          </motion.h1>
          <motion.p
            custom={1}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="text-text-secondary text-sm mb-7"
          >
            Start managing your crypto portfolio today
          </motion.p>

          {/* Google OAuth */}
          <motion.button
            custom={2}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-primary-border rounded-lg py-3 text-sm font-medium text-text-primary hover:bg-primary-border/30 transition-colors mb-6 disabled:opacity-50"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <AnimatePresence mode="wait">
              {googleLoading ? (
                <motion.div
                  key="spinner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-4 h-4 border-2 border-primary-accent border-t-transparent rounded-full animate-spin"
                />
              ) : (
                <motion.span key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <GoogleIcon />
                </motion.span>
              )}
            </AnimatePresence>
            Continue with Google
          </motion.button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-primary-border" />
            <span className="text-text-secondary text-xs">or sign up with email</span>
            <div className="flex-1 h-px bg-primary-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
              <label className="block text-text-primary text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input-field"
                autoComplete="name"
              />
            </motion.div>

            <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
              <label className="block text-text-primary text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
              />
            </motion.div>

            <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
              <label className="block text-text-primary text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="input-field pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`strength-bar flex-1 ${
                          strength >= level ? strengthColors[strength] : "bg-primary-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strengthTextColors[strength]}`}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
              <label className="block text-text-primary text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`input-field pr-10 ${
                    passwordsMatch === false
                      ? "border-loss focus:border-loss focus:ring-loss/20"
                      : passwordsMatch === true
                      ? "border-gain focus:border-gain focus:ring-gain/20"
                      : ""
                  }`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPw ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <AnimatePresence>
                {passwordsMatch === false && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-loss text-xs mt-1"
                  >
                    Passwords don't match
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-primary-border text-primary-accent focus:ring-primary-accent/20 cursor-pointer flex-shrink-0"
                />
                <span className="text-text-secondary text-sm leading-relaxed">
                  I agree to the{" "}
                  <Link to="#" className="text-primary-accent hover:underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link to="#" className="text-primary-accent hover:underline">Privacy Policy</Link>
                </span>
              </label>
            </motion.div>

            <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible">
              <motion.button
                type="submit"
                disabled={loading || !agreed}
                className="w-full bg-primary-accent text-white font-semibold py-3 rounded-btn hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                      Creating account...
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Create Account
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          <motion.p
            custom={8}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="text-center text-text-secondary text-sm mt-6"
          >
            Already have an account?{" "}
            <Link to="/login" className="text-primary-accent hover:underline font-medium">
              Log in
            </Link>
          </motion.p>
        </div>

        <p className="text-center mt-5">
          <Link to="/" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
