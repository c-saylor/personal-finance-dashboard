import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Budget, Expense, useFinance } from '../context/FinanceContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { categoryColors } from '../utils/colors';
import { currencySymbols } from '../utils/currency';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingByCategoryChartProps {
  expenses: Expense[];
  budgets: Budget[];
}

const SpendingByCategoryChart: React.FC<SpendingByCategoryChartProps> = ({ expenses, budgets }) => {
  const { settings } = useFinance();
  const currencySymbol = currencySymbols[settings.currency] || settings.currency;

  const categories = Array.from(new Set(expenses.map(e => e.category)));

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: categories.map(cat =>
          expenses.filter(e => e.category === cat)
                  .reduce((sum, e) => sum + e.amount, 0)
        ),
        backgroundColor: categories.map(cat => categoryColors[cat] || '#4A7C59'),
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#5A3E36', font: { weight: 'bold' as const } },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const value = tooltipItem.raw;
            return `${currencySymbol}${value.toFixed(2)}`;
          },
        },
      },
      title: { display: false },
    },
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};

export default SpendingByCategoryChart;
