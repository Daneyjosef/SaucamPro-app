import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useAppStore } from "./store/useAppStore";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import { fetchCoins } from "./lib/api";
import { LiveTicker } from "./components/common";

// Route-level code splitting — chunks load on demand
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Markets = lazy(() => import("./pages/Markets"));
const Trade = lazy(() => import("./pages/Trade"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const Settings = lazy(() => import("./pages/Settings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

function AppContent() {
  const theme = useAppStore((s) => s.theme);
  const [tickerCoins, setTickerCoins] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCoins({ perPage: 10 });
        setTickerCoins(data);
      } catch {}
    };
    load();
  }, []);

  // Apply theme class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-primary-bg text-text-primary">
      <BrowserRouter>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 md:ml-[240px] pb-16 md:pb-0 min-w-0">
            <TopBar />
            <LiveTicker coins={tickerCoins} />
            <main className="p-4 md:p-6">
              <div className="max-w-7xl mx-auto w-full">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-96">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-2 border-primary-accent border-t-transparent rounded-full animate-spin" />
                        <p className="text-text-secondary text-sm">Loading...</p>
                      </div>
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/markets" element={<Markets />} />
                    <Route path="/trade/:coinId" element={<Trade />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Suspense>
              </div>
            </main>
          </div>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#131722",
              color: "#fff",
              border: "1px solid #1E2330",
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
