import React, { useMemo, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const AnimatedCounter = React.memo(function AnimatedCounter({
  value,
  decimals = 2,
  prefix = "$",
  className = "",
}) {
  const display = useMemo(
    () =>
      value?.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [value, decimals]
  );

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={value}
    >
      {prefix}
      {display}
    </motion.span>
  );
});

export const PriceChange = React.memo(function PriceChange({ value, className = "" }) {
  if (value == null) return null;
  const isPositive = value >= 0;
  const prefix = isPositive ? "+" : "";

  return (
    <motion.span
      className={`inline-flex items-center gap-1 font-semibold ${
        isPositive ? "text-gain" : "text-loss"
      } ${className}`}
    >
      <span>{isPositive ? "▲" : "▼"}</span>
      {prefix}
      {value.toFixed(2)}%
    </motion.span>
  );
});

export const CoinLogo = React.memo(function CoinLogo({ src, alt, size = 32, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    const initials = alt?.slice(0, 2)?.toUpperCase() || "?";
    return (
      <div
        className={`rounded-full bg-primary-accent/15 flex items-center justify-center text-primary-accent font-bold flex-shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.32,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`rounded-full flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
});

export function Skeleton({ className = "", count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-primary-card rounded-lg animate-pulse ${className}`}
        />
      ))}
    </>
  );
}

export const Sparkline = React.memo(function Sparkline({ data, width = 60, height = 24 }) {
  const gradientId = useId();

  const { points, lineColor, fillColor, polygonPoints } = useMemo(() => {
    if (!data || data.length < 2)
      return { points: "", lineColor: "#0052FF", fillColor: "rgba(0,82,255,0.1)", polygonPoints: "" };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const isUp = data[data.length - 1] >= data[0];

    const pts = data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 2) - 1;
        return `${x},${y}`;
      })
      .join(" ");

    return {
      points: pts,
      polygonPoints: `0,${height} ${pts} ${width},${height}`,
      lineColor: isUp ? "#05B169" : "#F6465D",
      fillColor: isUp ? "rgba(5, 177, 105, 0.1)" : "rgba(246, 70, 93, 0.1)",
    };
  }, [data, width, height]);

  if (!points) return null;

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={polygonPoints} fill={fillColor} />
      <polyline
        points={points}
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const LiveTicker = React.memo(function LiveTicker({ coins }) {
  const navigate = useNavigate();

  if (!coins?.length) return null;

  return (
    <div className="overflow-hidden py-2 border-b border-primary-border bg-primary-card/50">
      <div className="flex animate-marquee gap-8 whitespace-nowrap">
        {[...coins, ...coins].map((coin, idx) => (
          <motion.button
            key={`${coin.id}-${idx}`}
            onClick={() => navigate(`/trade/${coin.id}`)}
            className="flex items-center gap-2 text-sm hover:text-text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={coin.image}
              alt={coin.symbol}
              loading="lazy"
              className="w-5 h-5 rounded-full"
            />
            <span className="font-medium text-text-secondary">
              {coin.symbol?.toUpperCase()}
            </span>
            <span className="text-text-primary">
              ${coin.current_price?.toLocaleString()}
            </span>
            <span
              className={`font-semibold ${
                coin.price_change_percentage_24h >= 0 ? "text-gain" : "text-loss"
              }`}
            >
              {coin.price_change_percentage_24h >= 0 ? "▲" : "▼"}
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
});
