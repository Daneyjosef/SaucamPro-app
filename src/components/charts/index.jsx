import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useCurrency } from "../../hooks/useCurrency";

export function PortfolioAreaChart({ data }) {
  const { formatPrice } = useCurrency();

  if (!data?.length) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-primary-card border border-primary-border rounded-lg px-4 py-3 shadow-2xl">
          <p className="text-text-secondary text-xs mb-1">
            {new Date(label).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-text-primary font-bold">{formatPrice(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0052FF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0052FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2330" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#8A919E", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) =>
              new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }
            minTickGap={30}
          />
          <YAxis
            tick={{ fill: "#8A919E", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
            domain={["auto", "auto"]}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#0052FF"
            strokeWidth={2}
            fill="url(#portfolioGradient)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function PriceAreaChart({ data, color = "#0052FF" }) {
  const { formatPrice } = useCurrency();

  if (!data?.length) return null;

  const isUp = data[data.length - 1] >= data[0];
  const lineColor = isUp ? "#05B169" : "#F6465D";

  const chartData = data.map((val, i) => ({
    time: i,
    value: val,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-primary-card border border-primary-border rounded-lg px-4 py-3 shadow-2xl">
          <p className="text-text-primary font-bold">{formatPrice(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2330" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: "#8A919E", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => {
              const len = data.length;
              const labels = ["1D", "7D", "1M", "1Y"];
              const intervals = [24, 168, 720, 8760];
              const idx = intervals.findIndex((i) => len <= i);
              const step = Math.max(1, Math.floor(len / 5));
              return val % step === 0 ? "" : "";
            }}
          />
          <YAxis
            tick={{ fill: "#8A919E", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => formatPrice(val)}
            domain={["auto", "auto"]}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            fill="url(#priceGradient)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function DonutChart({ data, colors = ["#0052FF", "#05B169", "#F6465D", "#F59E0B", "#8B5CF6"] }) {
  if (!data?.length) return null;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={1200}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.length ? (
                <div className="bg-primary-card border border-primary-border rounded-lg px-4 py-3 shadow-2xl">
                  <p className="text-text-secondary text-xs">{payload[0].name}</p>
                  <p className="text-text-primary font-bold">
                    ${payload[0].value.toLocaleString()}
                  </p>
                </div>
              ) : null
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
