import { lazy, Suspense, useEffect, useRef, useState, Component } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useAppStore } from "./store/useAppStore";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { fetchCoins } from "./lib/api";
import { LiveTicker } from "./components/common";
import { supabase, isSupabaseConfigured } from "./lib/supabase";

// Route-level code splitting
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Markets = lazy(() => import("./pages/Markets"));
const Trade = lazy(() => import("./pages/Trade"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const Settings = lazy(() => import("./pages/Settings"));
const BuyCoin = lazy(() => import("./pages/BuyCoin"));
const SellCoin = lazy(() => import("./pages/SellCoin"));
const TradePage = lazy(() => import("./pages/info/TradePage"));
const InvestPage = lazy(() => import("./pages/info/InvestPage"));
const SpendPage = lazy(() => import("./pages/info/SpendPage"));
const PaymentsPage = lazy(() => import("./pages/info/PaymentsPage"));
const AboutPage = lazy(() => import("./pages/info/AboutPage"));
const PrivacyPage = lazy(() => import("./pages/info/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/info/TermsPage"));
const ContactPage = lazy(() => import("./pages/info/ContactPage"));
const HelpPage = lazy(() => import("./pages/info/HelpPage"));
const Onboarding = lazy(() => import("./pages/Onboarding"));

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
          <p className="text-text-secondary text-sm">Something went wrong on this page.</p>
          <button
            className="px-4 py-2 bg-primary-accent text-white rounded-lg text-sm font-semibold"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const Spinner = () => (
  <div className="flex items-center justify-center h-96">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-2 border-primary-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-text-secondary text-sm">Loading...</p>
    </div>
  </div>
);

function AppLayout() {
  const currency = useAppStore((s) => s.currency);
  const queryClient = useQueryClient();
  const [tickerCoins, setTickerCoins] = useState([]);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["coins", currency, 1, 20, "market_cap_desc", true, undefined],
      queryFn: () => fetchCoins({ currency, page: 1, perPage: 20, sparkline: true }),
      staleTime: 2 * 60 * 1000,
    });
  }, [currency, queryClient]);

  useEffect(() => {
    fetchCoins({ perPage: 10 }).then(setTickerCoins).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-primary-bg">
      <Sidebar />
      <div className="flex-1 md:ml-[240px] pb-16 md:pb-0 min-w-0">
        <TopBar />
        <LiveTicker coins={tickerCoins} />
        <main className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto w-full">
            <ErrorBoundary>
              <Suspense fallback={<Spinner />}>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="markets" element={<Markets />} />
                  <Route path="trade/:coinId" element={<Trade />} />
                  <Route path="wallet" element={<Wallet />} />
                  <Route path="portfolio" element={<Portfolio />} />
                  <Route path="watchlist" element={<Watchlist />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<Dashboard />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}

function AuthHandler() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const authLoading = useAppStore((s) => s.authLoading);
  const prevUserId = useRef(undefined);

  useEffect(() => {
    if (authLoading) return;

    const justSignedIn = !prevUserId.current && !!user;
    prevUserId.current = user?.id ?? null;

    if (justSignedIn && user) {
      const isOAuth = user.app_metadata?.provider !== "email";
      const hasOnboarded = localStorage.getItem(`saucampro-onboarded-${user.id}`);
      if (isOAuth && !hasOnboarded) {
        navigate("/onboarding", { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  return null;
}

function AppContent() {
  const setUser = useAppStore((s) => s.setUser);
  const theme = useAppStore((s) => s.theme);

  // Sync theme class on every render (handles SSR-like scenarios and initial load)
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Supabase session init — runs once, keeps auth state in sync
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(null, false);
      return;
    }

    // If the URL contains an auth callback (PKCE code or implicit token), Supabase will
    // exchange it asynchronously and fire onAuthStateChange. Calling getSession() first
    // would return null and clear authLoading before the exchange completes, causing
    // ProtectedRoute to redirect to /login before the session is established.
    const params = new URLSearchParams(window.location.search);
    const isAuthCallback = params.has("code") || window.location.hash.includes("access_token");

    if (!isAuthCallback) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null, false);
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null, false);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <div className="min-h-screen bg-primary-bg text-text-primary">
      <BrowserRouter>
        <AuthHandler />
        <Suspense fallback={<div className="min-h-screen bg-primary-bg" />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/buy/:coinId" element={<BuyCoin />} />
            <Route path="/buy" element={<BuyCoin />} />
            <Route path="/sell/:coinId" element={<SellCoin />} />
            <Route path="/sell" element={<SellCoin />} />
            <Route path="/trade" element={<TradePage />} />
            <Route path="/invest" element={<InvestPage />} />
            <Route path="/spend" element={<SpendPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />

            {/* Onboarding — protected but outside the app shell */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            {/* Protected app routes */}
            <Route
              path="/app/*"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--toast-bg)",
              color: "var(--toast-color)",
              border: "1px solid var(--toast-border)",
              borderRadius: "12px",
            },
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
