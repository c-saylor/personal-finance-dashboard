import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useFinance } from '../context/FinanceContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, ChartOptions } from 'chart.js';
import { categoryColors } from '../utils/colors';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const SpendingByCategoryChart: React.FC = () => {
  const { expenses } = useFinance();

  const categories = Array.from(new Set(expenses.map(e => e.category)));

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: categories.map(cat =>
          expenses
            .filter(e => e.category === cat)
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
        labels: {
          color: '#5A3E36',
          font: {
            weight: 'bold' as const, 
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const value = tooltipItem.raw;
            return `$${value.toFixed(2)}`;
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};

export default SpendingByCategoryChart;
