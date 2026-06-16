import { create } from "zustand";

const getInitialTheme = () => {
  const saved = localStorage.getItem("saucampro-theme") || "dark";
  if (saved === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  return saved;
};

const getInitialCurrency = () => {
  const saved = localStorage.getItem("saucampro-currency");
  if (!saved) localStorage.setItem("saucampro-currency", "usd");
  return saved || "usd";
};

export const useAppStore = create((set, get) => ({
  // Theme — light or dark, persisted
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem("saucampro-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },

  // Currency
  currency: getInitialCurrency(),
  setCurrency: (currency) => {
    localStorage.setItem("saucampro-currency", currency);
    set({ currency });
  },

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

  // Auth — supports both Supabase (via setUser) and local fallback
  authLoading: true,
  isAuthenticated: !!localStorage.getItem("saucampro-auth"),
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem("saucampro-user") || "null");
    } catch {
      return null;
    }
  })(),

  setUser: (user, loading = false) => {
    if (user) {
      localStorage.setItem("saucampro-auth", "true");
      localStorage.setItem("saucampro-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("saucampro-auth");
      localStorage.removeItem("saucampro-user");
    }
    set({ isAuthenticated: !!user, user, authLoading: loading });
  },

  // Local auth fallback (used when Supabase is not configured)
  signUp: (userData) => {
    const users = JSON.parse(localStorage.getItem("saucampro-users") || "[]");
    const exists = users.find((u) => u.email === userData.email);
    if (exists) return { ok: false, error: "Email already registered" };
    users.push({ ...userData, id: Date.now().toString() });
    localStorage.setItem("saucampro-users", JSON.stringify(users));
    get().setUser(userData);
    return { ok: true };
  },
  signIn: (email, password) => {
    const users = JSON.parse(localStorage.getItem("saucampro-users") || "[]");
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return { ok: false, error: "Invalid email or password" };
    get().setUser(user);
    return { ok: true };
  },
  signOut: () => {
    get().setUser(null);
  },
}));
