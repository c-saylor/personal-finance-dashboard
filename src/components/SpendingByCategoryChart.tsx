import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useFinance } from '../context/FinanceContext';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const categoryColors = [
  '#4A7C59', // dark green
  '#7DA17A', // lighter green
  '#A88F77', // brownish
  '#D98CFF', // pink accent
  '#FFB37E', // peach accent
  '#8093F1', // (optional, muted blue)
];

const SpendingByCategoryChart: React.FC = () => {
  const { expenses } = useFinance();

  // Aggregate amounts by category
  const categoryMap: Record<string, number> = {};

  expenses.forEach(({ category, amount }) => {
    categoryMap[category] = (categoryMap[category] || 0) + amount;
  });

  const categories = Object.keys(categoryMap);
  const data = Object.values(categoryMap);

  const chartData = {
    labels: categories.length > 0 ? categories : ['No Data'],
    datasets: [
      {
        data: categories.length > 0 ? data : [1],
        backgroundColor: categories.length > 0 ? categoryColors.slice(0, categories.length) : ['#ccc'],
        hoverBackgroundColor: categories.length > 0 ? categoryColors.slice(0, categories.length).map(c => c + 'cc') : ['#999'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Doughnut
        data={chartData}
        options={{
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#5A3E36',
              },
            },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const label = ctx.label || '';
                  const value = ctx.raw || 0;
                  return `${label}: $${value}`;
                },
              },
            },
          },
          maintainAspectRatio: true,
          responsive: true,
        }}
      />
    </div>
  );
};

export default SpendingByCategoryChart;
