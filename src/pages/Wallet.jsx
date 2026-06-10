import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAppStore } from "../store/useAppStore";
import { useCurrency } from "../hooks/useCurrency";
import { AnimatedCounter, CoinLogo } from "../components/common";
import { AddHoldingModal } from "../components/modals/AddHoldingModal";
import { SendModal } from "../components/modals/SendModal";
import { ReceiveModal } from "../components/modals/ReceiveModal";
import axios from "axios";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

const fetchWalletPrices = async (coinIds) => {
  if (!coinIds.length) return {};
  const { data } = await axios.get(`${COINGECKO_BASE}/simple/price`, {
    params: {
      ids: coinIds.join(","),
      vs_currencies: "usd",
      include_24hr_change: "true",
    },
  });
  return data;
};

const SYMBOL_TO_ID = {
  BTC: "bitcoin", ETH: "ethereum", USDT: "tether", BNB: "binancecoin",
  SOL: "solana", XRP: "xrp", USDC: "usd-coin", ADA: "cardano",
  DOGE: "dogecoin", DOT: "polkadot", MATIC: "matic-network",
  SHIB: "shiba-inu", TRX: "tron", AVAX: "avalanche-2", DAI: "dai",
  LTC: "litecoin", UNI: "uniswap", LINK: "chainlink", ATOM: "cosmos",
  XLM: "stellar", APT: "aptos", ARB: "arbitrum", OP: "optimism",
  SUI: "sui", PEPE: "pepe", NEAR: "near", FIL: "filecoin", HBAR: "hedera-hashgraph",
  VET: "vechain", ALGO: "algorand", FTM: "fantom", CRO: "crypto-com-chain",
};

const DONUT_COLORS = ["#0052FF", "#05B169", "#F6465D", "#F59E0B", "#8B5CF6", "#EC4899"];

const MOCK_TX = [
  { hash: "0x8f3…a1b2", type: "send", amount: 0.05, coin: "BTC", date: "2026-06-09", status: "confirmed" },
  { hash: "0x4d1…c9e8", type: "receive", amount: 120, coin: "SOL", date: "2026-06-08", status: "confirmed" },
  { hash: "0x7a2…b3f4", type: "buy", amount: 500, coin: "USDC", date: "2026-06-07", status: "confirmed" },
  { hash: "0x9e5…d6c7", type: "send", amount: 0.02, coin: "ETH", date: "2026-06-06", status: "pending" },
  { hash: "0x3b8…f1a2", type: "receive", amount: 50, coin: "SOL", date: "2026-06-05", status: "confirmed" },
];

export default function Wallet() {
  const navigate = useNavigate();
  const { portfolio, removeFromPortfolio } = useAppStore();
  const { formatPrice } = useCurrency();
  const [modalOpen, setModalOpen] = useState(false);
  const [sendTarget, setSendTarget] = useState(null);
  const [receiveTarget, setReceiveTarget] = useState(null);

  const coinIds = useMemo(
    () => [...new Set(portfolio.map((a) => SYMBOL_TO_ID[a.coin]).filter(Boolean))],
    [portfolio]
  );

  const { data: prices } = useQuery({
    queryKey: ["wallet-prices", coinIds],
    queryFn: () => fetchWalletPrices(coinIds),
    enabled: coinIds.length > 0,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const assets = useMemo(
    () =>
      portfolio.map((a) => {
        const coinId = SYMBOL_TO_ID[a.coin];
        const live = prices?.[coinId];
        const currentPrice = live?.usd ?? a.buyPrice;
        const change24h = live?.usd_24h_change;
        const currentValue = a.amount * currentPrice;
        const costBasis = a.amount * a.buyPrice;
        const pnl = currentValue - costBasis;
        const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
        return { ...a, currentPrice, change24h, currentValue, costBasis, pnl, pnlPercent, coinId };
      }),
    [portfolio, prices]
  );

  const totalBalance = useMemo(() => assets.reduce((s, a) => s + a.currentValue, 0), [assets]);
  const totalCost = useMemo(() => assets.reduce((s, a) => s + a.costBasis, 0), [assets]);
  const totalPnL = totalBalance - totalCost;
  const pnlPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
  const totalChange24h = assets.reduce((s, a) => s + (a.change24h ?? 0) * (a.currentValue / (totalBalance || 1)), 0);

  const donutData = useMemo(
    () => assets.map((a) => ({ name: a.coin, value: a.currentValue })),
    [assets]
  );

  // Glassmorphism card wrapper
  const GlassCard = ({ children, className = "", delay = 0, ...props }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 24 }}
      className={`bg-primary-card/60 backdrop-blur-xl border border-primary-border/50 rounded-2xl p-5 ${className}`}
      whileHover={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
      {...props}
    >
      {children}
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* ═══ HEADER ═══ */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Wallet</h1>
          <p className="text-text-secondary text-sm mt-0.5">Your crypto assets at a glance</p>
        </div>
        <motion.button
          onClick={() => setModalOpen(true)}
          className="bg-primary-accent hover:bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          whileTap={{ scale: 0.94 }}
        >
          + Add Asset
        </motion.button>
      </div>

      {/* ═══ BALANCE HERO ═══ */}
      <GlassCard delay={0}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-text-secondary text-sm font-medium tracking-wide uppercase">Total Balance</p>
            <AnimatedCounter value={totalBalance} className="text-4xl md:text-5xl font-bold text-text-primary mt-1" />
            <div className="flex items-center gap-3 mt-2">
              {assets.length > 0 && (
                <>
                  <span className={`inline-flex items-center gap-1 text-sm font-semibold ${totalChange24h >= 0 ? "text-gain" : "text-loss"}`}>
                    {totalChange24h >= 0 ? "▲" : "▼"} {Math.abs(totalChange24h).toFixed(2)}%
                  </span>
                  <span className="text-text-secondary text-xs">24h change</span>
                  <span className="text-text-secondary/40">·</span>
                </>
              )}
              <span className={`text-sm font-semibold ${totalPnL >= 0 ? "text-gain" : "text-loss"}`}>
                {totalPnL >= 0 ? "+" : ""}{formatPrice(Math.abs(totalPnL))}
              </span>
              <span className="text-text-secondary text-xs">all-time P&L</span>
            </div>
          </div>
          {assets.length > 0 && (
            <div className="flex gap-2">
              {["Send", "Receive", "Buy"].map((action) => (
                <motion.button
                  key={action}
                  onClick={() => {
                    if (action === "Buy") navigate("/markets");
                    else if (action === "Send") setSendTarget(assets[0]);
                    else setReceiveTarget(assets[0]);
                  }}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all backdrop-blur-md border"
                  whileTap={{ scale: 0.93 }}
                  style={{
                    background: action === "Send"
                      ? "rgba(246,70,93,0.12)"
                      : action === "Receive"
                      ? "rgba(5,177,105,0.12)"
                      : "rgba(0,82,255,0.12)",
                    borderColor: action === "Send"
                      ? "rgba(246,70,93,0.25)"
                      : action === "Receive"
                      ? "rgba(5,177,105,0.25)"
                      : "rgba(0,82,255,0.25)",
                    color: action === "Send" ? "#F6465D" : action === "Receive" ? "#05B169" : "#0052FF",
                  }}
                >
                  {action === "Send" && "↑ "}{action === "Receive" && "↓ "}{action === "Buy" && "+ "}{action}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </GlassCard>

      {/* ═══ MAIN GRID: Asset cards + Donut ═══ */}
      {assets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Asset cards — 2/3 width */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider px-1">Your Assets</h2>
            <div className="space-y-3">
              {assets.map((asset, i) => (
                <GlassCard key={asset.id} delay={0.05 * i} className="!p-4">
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <CoinLogo src={null} alt={asset.coin} size={44} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-text-primary font-bold text-base">{asset.coin}</span>
                        <span className="text-text-secondary text-xs">{asset.amount} {asset.coin}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-text-primary font-semibold text-sm">{formatPrice(asset.currentValue)}</span>
                        <span className="text-text-secondary text-xs">@ {formatPrice(asset.currentPrice)}</span>
                        {asset.change24h != null && (
                          <span className={`text-xs font-semibold ${asset.change24h >= 0 ? "text-gain" : "text-loss"}`}>
                            {asset.change24h >= 0 ? "▲" : "▼"} {Math.abs(asset.change24h).toFixed(2)}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons per asset */}
                    <div className="flex gap-1.5 flex-shrink-0">
                      {[
                        { label: "Send", color: "#F6465D", onClick: () => setSendTarget(asset) },
                        { label: "Receive", color: "#05B169", onClick: () => setReceiveTarget(asset) },
                        { label: "Trade", color: "#0052FF", onClick: () => { const id = SYMBOL_TO_ID[asset.coin]; if (id) navigate(`/trade/${id}`); } },
                      ].map((act) => (
                        <motion.button
                          key={act.label}
                          onClick={(e) => { e.stopPropagation(); act.onClick(); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all backdrop-blur-sm border"
                          whileTap={{ scale: 0.9 }}
                          style={{
                            background: `${act.color}15`,
                            borderColor: `${act.color}25`,
                            color: act.color,
                          }}
                        >
                          {act.label}
                        </motion.button>
                      ))}
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); removeFromPortfolio(asset.id); }}
                        className="px-2 py-1.5 rounded-lg text-xs text-text-secondary hover:text-loss transition-colors"
                        whileTap={{ scale: 0.9 }}
                      >
                        ✕
                      </motion.button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Donut chart — 1/3 width */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider px-1">Allocation</h2>
            <GlassCard delay={0.15}>
              {donutData.length > 0 ? (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1200}
                      >
                        {donutData.map((_, i) => (
                          <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-full space-y-2 mt-2">
                    {donutData.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                          <span className="text-text-secondary">{d.name}</span>
                        </div>
                        <span className="text-text-primary font-medium">{((d.value / totalBalance) * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-text-secondary text-sm">No data</div>
              )}
            </GlassCard>
          </div>
        </div>
      ) : (
        /* Empty state */
        <GlassCard delay={0.1} className="text-center py-16">
          <div className="text-5xl mb-4">🏦</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No assets yet</h3>
          <p className="text-text-secondary text-sm mb-6">Add your first crypto asset to your wallet</p>
          <motion.button onClick={() => setModalOpen(true)} className="bg-primary-accent hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors" whileTap={{ scale: 0.94 }}>
            Add Asset
          </motion.button>
        </GlassCard>
      )}

      {/* ═══ TRANSACTION HISTORY ═══ */}
      {assets.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider px-1">Transaction History</h2>
          <GlassCard delay={0.2} className="!p-0 overflow-hidden">
            <div className="divide-y divide-primary-border/50">
              {MOCK_TX.map((tx, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-primary-border/20 transition-colors cursor-pointer"
                >
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: tx.type === "send" ? "rgba(246,70,93,0.12)" : tx.type === "receive" ? "rgba(5,177,105,0.12)" : "rgba(0,82,255,0.12)",
                    }}
                  >
                    <span style={{ color: tx.type === "send" ? "#F6465D" : tx.type === "receive" ? "#05B169" : "#0052FF" }} className="text-sm">
                      {tx.type === "send" ? "↑" : tx.type === "receive" ? "↓" : "+"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-text-primary text-sm font-medium capitalize">{tx.type}</span>
                      <span className="text-text-secondary text-xs">{tx.coin}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        tx.status === "confirmed" ? "bg-gain/10 text-gain" : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-text-secondary text-xs mt-0.5 font-mono">{tx.hash}</p>
                  </div>

                  {/* Amount + Date */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-semibold ${tx.type === "send" ? "text-loss" : "text-gain"}`}>
                      {tx.type === "send" ? "-" : "+"}{tx.amount} {tx.coin}
                    </p>
                    <p className="text-text-secondary text-xs mt-0.5">{tx.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ═══ MODALS ═══ */}
      {modalOpen && <AddHoldingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />}
      {sendTarget && <SendModal isOpen={!!sendTarget} onClose={() => setSendTarget(null)} coin={sendTarget.coin} maxAmount={sendTarget.amount} />}
      {receiveTarget && <ReceiveModal isOpen={!!receiveTarget} onClose={() => setReceiveTarget(null)} coin={receiveTarget.coin} />}
    </motion.div>
  );
}
