import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import ExpenseForm from '../components/ExpenseForm';
import SpendingByCategoryChart from '../components/SpendingByCategoryChart';

const Dashboard: React.FC = () => {
    // TODO: Replace with dynamic data once context/state is set up
    const { expenses } = useFinance();

    const [showForm, setShowForm] = useState(false);

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const expenseCount = expenses.length;

    const budgetUsedPercent = totalExpenses > 1000 ? 100 : Math.round((totalExpenses / 1000) * 100);
    const recentExpenses = expenses.slice(0, 5);

    return (
        <div className="dashboard container py-4">
            <h1 className="mb-4" style={{ color: '#5A3E36' }}>
                Welcome back, User!
            </h1>
            <button
                onClick={() => setShowForm(true)}
                className="btn btn-success mb-4"
                style={{ fontWeight: 600, borderRadius: 8 }}
            >
                + Add New Expense
            </button>

            <div className="summary-cards d-flex flex-wrap gap-3 mb-5">
                <div className="card p-3 flex-fill" style={{ minWidth: '220px' }}>
                    <h5>Total Expenses</h5>
                    <p className="fs-3 fw-bold summary-value">${totalExpenses.toFixed(2)}</p>
                </div>
                <div className="card p-3 flex-fill" style={{ minWidth: '220px' }}>
                    <h5>Budget Used</h5>
                    <p className="fs-3 fw-bold summary-value">
                        {budgetUsedPercent}%
                    </p>
                    <div className="progress" style={{ height: '8px' }}>
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${budgetUsedPercent}%`, backgroundColor: '#4A7C59' }}
                            aria-valuenow={budgetUsedPercent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        ></div>
                    </div>
                </div>
                <div className="card p-3 flex-fill" style={{ minWidth: '220px' }}>
                    <h5>Number of Expenses</h5>
                    <p className="fs-3 fw-bold summary-value" >{expenseCount}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-md-7 mb-4">
                    <div className="card p-3 h-100">
                        <h5>Spending by Category</h5>
                        <SpendingByCategoryChart/>
                    </div>
                </div>
                <div className="col-md-5 mb-4">
                    <div className="card p-3 h-100">
                        <h5>Recent Expenses</h5>
                        <ul className="list-group list-group-flush">
                            {recentExpenses.map(({ id, description, amount, date }) => (
                                <li
                                    key={id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    style={{ borderColor: '#A88F77' }}
                                >
                                    <div>
                                        <div>{description}</div>
                                        <small className="text-muted">{new Date(date).toLocaleDateString()}</small>
                                    </div>
                                    <span className="summary-value">${amount}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <ExpenseForm show={showForm} onClose={() => setShowForm(false)}/>
        </div>
    );
};

export default Dashboard;
