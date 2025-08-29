import React, { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartDataset,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useFinance } from "../context/FinanceContext";
import { categoryColors } from "../utils/colors";
import { currencySymbols } from "../utils/currency";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const lineDashPatterns: number[][] = [
  [],
  [10, 6],
  [4, 4],
  [2, 6],
  [12, 4, 2, 4],
  [16, 6, 2, 6, 2, 6],
];

const SpendingOverTimeChart: React.FC = () => {
  const { expenses, budgets, settings } = useFinance();
  const [granularity, setGranularity] = useState<"week" | "month" | "year">("month");
  const currencySymbol = currencySymbols[settings.currency] || settings.currency;

  // Build categories from both budgets and expenses
  const categories = Array.from(
    new Set([
      ...budgets.map(b => b.category),
      ...expenses.map(e => e.category),
    ])
  );

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    if (granularity === "month") {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
    } else if (granularity === "year") {
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      // week
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    }
    startDate.setHours(0, 0, 0, 0);

    return expenses.filter(exp => {
      const d = new Date(exp.date);
      return !isNaN(d.getTime()) && d >= startDate && d <= now;
    });
  }, [expenses, granularity]);

  const getTimeKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");

    if (granularity === "year") {
      // Group by month
      return `${y}-${m}`;
    }

    // For month/week, include day
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Initialize data structures
  const dataMap: Record<string, Record<string, number>> = {};
  categories.forEach(cat => (dataMap[cat] = {}));
  const allKeysSet = new Set<string>();

  filteredExpenses.forEach(exp => {
    const key = getTimeKey(new Date(exp.date));
    allKeysSet.add(key);

    if (!dataMap[exp.category]) {
      dataMap[exp.category] = {}; // safeguard for unexpected categories
    }

    dataMap[exp.category][key] =
      (dataMap[exp.category][key] || 0) + Number(exp.amount || 0);
  });

  const allKeys = Array.from(allKeysSet).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const chartData = {
    labels: allKeys.map((key) => {
      const [year, month, day] = key.split("-");
      const date = new Date(Number(year), Number(month) - 1, day ? Number(day) : 1);

      if (granularity === "year") {
        // Show Month name only
        return date.toLocaleString("default", { month: "short" });
      }

      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }),
    datasets: categories.map((cat, i): ChartDataset<"line"> => ({
      label: cat,
      data: allKeys.map(key => dataMap[cat][key] || 0),
      borderColor: categoryColors[cat] || "#4A7C59",
      backgroundColor: "rgba(74, 124, 89, 0.2)",
      fill: true,
      tension: 0.3,
      borderDash: lineDashPatterns[i % lineDashPatterns.length],
      pointRadius: 3,
      pointHoverRadius: 5,
    })),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Spending Over Time" },
      tooltip: {
        callbacks: {
          label: ctx => `${currencySymbol}${(ctx.raw as number).toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: val => `${currencySymbol}${Number(val).toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="granularity" className="form-label">Time Range:</label>
        <select
          id="granularity"
          className="form-select"
          value={granularity}
          onChange={e => setGranularity(e.target.value as "week" | "month" | "year")}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SpendingOverTimeChart;
