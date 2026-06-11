import { create } from "zustand";

const getInitialTheme = () => {
  localStorage.setItem("saucampro-theme", "dark");
  return "dark";
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
  setTheme: () => {
    // Dark mode only
    localStorage.setItem("saucampro-theme", "dark");
    set({ theme: "dark" });
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  },
  toggleTheme: () => {
    // Dark mode only — no-op
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
    get().addNotification({
      type: "portfolio_add",
      title: "Asset Added",
      description: `Added ${asset.amount} ${asset.coin} to portfolio`,
      coin: asset.coin,
    });
  },
  removeFromPortfolio: (id) => {
    const asset = get().portfolio.find((a) => a.id === id);
    const updated = get().portfolio.filter((a) => a.id !== id);
    localStorage.setItem("saucampro-portfolio", JSON.stringify(updated));
    set({ portfolio: updated });
    if (asset) {
      get().addNotification({
        type: "portfolio_remove",
        title: "Asset Removed",
        description: `Removed ${asset.coin} from portfolio`,
        coin: asset.coin,
      });
    }
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
    if (!exists) {
      get().addNotification({
        type: "watchlist_add",
        title: "Added to Watchlist",
        description: `${coinId.charAt(0).toUpperCase() + coinId.slice(1)} added to watchlist`,
        coin: coinId,
      });
    }
    return !exists;
  },
  isWatchlisted: (coinId) => get().watchlist.includes(coinId),

  // Notifications
  notifications: [],
  addNotification: (notif) => {
    const notification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notif,
    };
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50),
    }));
  },
  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },
  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },
  clearNotifications: () => {
    set({ notifications: [] });
  },
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
