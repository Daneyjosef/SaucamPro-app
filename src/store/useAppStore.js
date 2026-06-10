import { create } from "zustand";

const getInitialTheme = () => {
  const stored = localStorage.getItem("saucampro-theme");
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getInitialCurrency = () => {
  return localStorage.getItem("saucampro-currency") || "usd";
};

const getInitialPortfolio = () => {
  try {
    const stored = localStorage.getItem("saucampro-portfolio");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getInitialWatchlist = () => {
  try {
    const stored = localStorage.getItem("saucampro-watchlist");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const useAppStore = create((set, get) => ({
  // Theme
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem("saucampro-theme", theme);
    set({ theme });
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  },
  toggleTheme: () => {
    const newTheme = get().theme === "dark" ? "light" : "dark";
    get().setTheme(newTheme);
  },

  // Currency
  currency: getInitialCurrency(),
  setCurrency: (currency) => {
    localStorage.setItem("saucampro-currency", currency);
    set({ currency });
  },

  // Portfolio
  portfolio: getInitialPortfolio(),
  addToPortfolio: (asset) => {
    const updated = [...get().portfolio, { ...asset, id: Date.now().toString() }];
    localStorage.setItem("saucampro-portfolio", JSON.stringify(updated));
    set({ portfolio: updated });
  },
  removeFromPortfolio: (id) => {
    const updated = get().portfolio.filter((a) => a.id !== id);
    localStorage.setItem("saucampro-portfolio", JSON.stringify(updated));
    set({ portfolio: updated });
  },
  updatePortfolio: (id, data) => {
    const updated = get().portfolio.map((a) =>
      a.id === id ? { ...a, ...data } : a
    );
    localStorage.setItem("saucampro-portfolio", JSON.stringify(updated));
    set({ portfolio: updated });
  },

  // Watchlist
  watchlist: getInitialWatchlist(),
  toggleWatchlist: (coinId) => {
    const current = get().watchlist;
    const exists = current.includes(coinId);
    const updated = exists
      ? current.filter((id) => id !== coinId)
      : [...current, coinId];
    localStorage.setItem("saucampro-watchlist", JSON.stringify(updated));
    set({ watchlist: updated });
    return !exists;
  },
  isWatchlisted: (coinId) => get().watchlist.includes(coinId),
}));
