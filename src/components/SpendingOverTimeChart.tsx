import React, { useState } from "react";
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
  [],               // solid
  [10, 6],          // long dash
  [4, 4],           // medium dash
  [2, 6],           // dot-like
  [12, 4, 2, 4],    // dash-dot
  [16, 6, 2, 6, 2, 6], // dash-dot-dot
];


const SpendingOverTimeChart: React.FC = () => {
  const { expenses, budgets } = useFinance();
  const [granularity, setGranularity] = useState<"week" | "month" | "year">("month");

  const categories = budgets.map((b) => b.category);

  // Helper: get time key by granularity
  const getTimeKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");

    if (granularity === "year") return `${y}`;
    if (granularity === "month") return `${y}-${m}`;
    if (granularity === "week") {
      const week = Math.ceil(((date.getTime() - new Date(y, 0, 1).getTime()) / 86400000 + 1) / 7);
      return `${y}-W${String(week).padStart(2, "0")}`;
    }
    return `${y}-${m}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Aggregate expenses by category and time
  const dataMap: Record<string, Record<string, number>> = {};
  categories.forEach((cat) => (dataMap[cat] = {}));
  const allKeysSet = new Set<string>();

  expenses.forEach((exp) => {
    const date = new Date(exp.date);
    if (isNaN(date.getTime())) return;

    const key = getTimeKey(date);
    allKeysSet.add(key);

    if (!dataMap[exp.category]) dataMap[exp.category] = {};
    dataMap[exp.category][key] = (dataMap[exp.category][key] || 0) + Number(exp.amount || 0);
  });

  const allKeys = Array.from(allKeysSet).sort(
    (a, b) => new Date(a + "-01").getTime() - new Date(b + "-01").getTime()
  );

  const chartData = {
    labels: allKeys.map((key) => {
      if (granularity === "year") return key;
      const [y, m] = key.split("-");
      return new Date(Number(y), Number(m) - 1).toLocaleString("default", {
        month: "short",
        year: granularity === "month" ? "numeric" : undefined,
      });
    }),
    datasets: categories.map((cat, i): ChartDataset<"line"> => ({
      label: cat,
      data: allKeys.map((key) => dataMap[cat][key] || 0),
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
      legend: {
        display: true,
        position: "top",
        labels: {
          boxHeight: 10
        }
      },
      title: {
        display: true,
        text: "Spending Over Time",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `$${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => {
            const num = typeof val === "number" ? val : parseFloat(val);
            return `$${num.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="granularity" className="form-label">
          Time Range:
        </label>
        <select
          id="granularity"
          className="form-select"
          value={granularity}
          onChange={(e) => setGranularity(e.target.value as "week" | "month" | "year")}
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
