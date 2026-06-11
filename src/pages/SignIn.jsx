import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAppStore } from "../store/useAppStore";

export default function SignIn() {
  const navigate = useNavigate();
  const signIn = useAppStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    const result = signIn(email, password);
    setLoading(false);
    if (result.ok) {
      toast.success("Welcome back!");
      navigate("/app/dashboard");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-accent rounded-xl flex items-center justify-center">
              <span className="text-text-primary font-bold text-xl">₿</span>
            </div>
            <span className="text-2xl font-bold text-text-primary">SaucamPro</span>
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome back</h1>
          <p className="text-text-secondary text-sm mb-8">Log in to your SaucamPro account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-text-primary text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-primary-bg border border-primary-border rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/20 text-sm"
              />
            </div>

            <div>
              <label className="block text-text-primary text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-primary-bg border border-primary-border rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/20 text-sm"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-accent text-white font-semibold py-3 rounded-btn hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </motion.button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary-accent hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link to="/" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
