import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/app/markets", label: "Markets" },
  { to: "/app/wallet", label: "Wallet" },
  { to: "/app/portfolio", label: "Portfolio" },
  { to: "/app/watchlist", label: "Watchlist" },
  { to: "/app/settings", label: "Settings" },
];

function getDisplayName(user) {
  return (
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Trader"
  );
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const signOut = useAppStore((s) => s.signOut);
  const user = useAppStore((s) => s.user);

  const displayName = getDisplayName(user);
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[240px] bg-primary-bg border-r border-primary-border z-50">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-primary-border">
          <NavLink to="/app/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-accent rounded-lg flex items-center justify-center">
              <span className="text-text-primary font-bold text-lg">₿</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">SaucamPro</h1>
              <p className="text-xs text-text-secondary">Crypto Platform</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink key={item.to} to={item.to} className="relative block">
                <motion.div
                  className={`relative flex items-center px-4 py-[10px] rounded-lg font-medium overflow-hidden ${
                    isActive ? "text-primary-accent" : "text-text-secondary"
                  }`}
                  whileHover={{
                    x: 8,
                    transition: { type: "spring", stiffness: 400, damping: 20 },
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Hover background sweep — only when not active */}
                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-primary-card"
                      initial={{ opacity: 0, scaleX: 0.85 }}
                      whileHover={{
                        opacity: 1,
                        scaleX: 1,
                        transition: { type: "spring", stiffness: 350, damping: 22 },
                      }}
                      style={{ transformOrigin: "left center" }}
                    />
                  )}

                  {/* Active left accent bar — animated between items */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-accent"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-primary-accent rounded-r-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Label text */}
                  <motion.span
                    className="relative z-10 text-sm tracking-wide"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.label}
                  </motion.span>
                </motion.div>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile */}
        <div className="px-4 py-4 border-t border-primary-border">
          <div className="flex items-center gap-3 px-2">
            <motion.div
              className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden"
              whileHover={{ scale: 1.08, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-accent to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {initial}
                </div>
              )}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{displayName}</p>
              <p className="text-xs text-text-secondary truncate">{user?.email || "Free Account"}</p>
            </div>
            <motion.button
              onClick={() => {
                signOut();
                navigate("/");
              }}
              className="text-text-secondary hover:text-loss text-xs font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              title="Sign Out"
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary-bg border-t border-primary-border z-50 safe-area-bottom">
        <div className="flex justify-around py-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5"
              >
                <motion.span
                  className={`text-[10px] font-semibold ${
                    isActive ? "text-primary-accent" : "text-text-secondary"
                  }`}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ y: -1 }}
                >
                  {item.label}
                </motion.span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-active"
                    className="w-5 h-[2px] bg-primary-accent rounded-full mt-0.5"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
