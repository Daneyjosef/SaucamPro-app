import { useMemo } from "react";
import { useAppStore } from "../store/useAppStore";
import { CURRENCY_SYMBOLS } from "../lib/constants";

export const useCurrency = () => {
  const currency = useAppStore((s) => s.currency);

  const formatPrice = useMemo(
    () => (value) => {
      if (value == null || isNaN(value)) return "$0.00";
      const symbol = CURRENCY_SYMBOLS[currency] || "$";

      let decimals = 2;
      if (value < 0.01) decimals = 6;
      else if (value < 1) decimals = 4;
      else if (value < 100) decimals = 2;
      else decimals = 2;

      const formatted = value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

      return `${symbol}${formatted}`;
    },
    [currency]
  );

  const formatLargeNumber = useMemo(
    () => (value) => {
      if (value == null || isNaN(value)) return "$0";
      const symbol = CURRENCY_SYMBOLS[currency] || "$";

      if (value >= 1e12) return `${symbol}${(value / 1e12).toFixed(2)}T`;
      if (value >= 1e9) return `${symbol}${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `${symbol}${(value / 1e6).toFixed(2)}M`;
      if (value >= 1e3) return `${symbol}${(value / 1e3).toFixed(2)}K`;

      return formatPrice(value);
    },
    [currency, formatPrice]
  );

  const formatPercent = useMemo(
    () => (value) => {
      if (value == null || isNaN(value)) return "0.00%";
      const prefix = value >= 0 ? "+" : "";
      return `${prefix}${value.toFixed(2)}%`;
    },
    []
  );

  return {
    currency,
    formatPrice,
    formatLargeNumber,
    formatPercent,
  };
};
