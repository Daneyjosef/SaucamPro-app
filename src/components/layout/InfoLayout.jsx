import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function InfoLayout({ children }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <img src="/favicon.png" alt="SaucamPro" className="h-8 w-auto" />
          </button>
          {/* desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link to="/trade" className="hover:text-gray-900 transition-colors">Trade</Link>
            <Link to="/invest" className="hover:text-gray-900 transition-colors">Invest</Link>
            <Link to="/spend" className="hover:text-gray-900 transition-colors">Spend</Link>
            <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">Log In</button>
            <button onClick={() => navigate("/signup")} className="text-sm font-semibold bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-700 transition-colors">Get Started</button>
          </div>
          {/* mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 px-5 py-4 flex flex-col gap-3 bg-white text-sm font-medium text-gray-700">
            <Link to="/trade" onClick={() => setMenuOpen(false)}>Trade</Link>
            <Link to="/invest" onClick={() => setMenuOpen(false)}>Invest</Link>
            <Link to="/spend" onClick={() => setMenuOpen(false)}>Spend</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <hr className="border-gray-100" />
            <button onClick={() => navigate("/login")} className="text-left">Log In</button>
            <button onClick={() => navigate("/signup")} className="bg-gray-900 text-white rounded-full px-5 py-2.5 text-center font-semibold">Get Started</button>
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-10 px-5 sm:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <button onClick={() => navigate("/")} className="flex items-center gap-2 mb-4">
                <img src="/favicon.png" alt="SaucamPro" className="h-8 w-auto" />
              </button>
              <p className="text-gray-400 text-xs leading-relaxed">A licensed global digital assets platform — secure, transparent, and built for modern traders.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Products</h4>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                {[["Trade", "/trade"], ["Invest", "/invest"], ["Spend", "/spend"], ["Payments", "/payments"]].map(([l, href]) => (
                  <li key={l}><Link to={href} className="hover:text-gray-900 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li><Link to="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
                <li className="cursor-default">Blog</li>
                <li className="cursor-default">Careers</li>
                <li className="cursor-default">Press</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                {[["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"], ["Contact", "/contact"], ["Help Center", "/help"]].map(([l, href]) => (
                  <li key={l}><Link to={href} className="hover:text-gray-900 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-gray-400 text-xs">
            <span>&copy; 2026 SaucamPro. All rights reserved.</span>
            <span>Licensed · Regulated · Trusted Globally</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
