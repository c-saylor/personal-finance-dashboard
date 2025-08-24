import React, { useState } from 'react';
import { useFinance, Expense } from '../context/FinanceContext';
import SpendingByCategoryChart from '../components/SpendingByCategoryChart';
import ExpenseModal from '../components/ExpenseModal';
import { categoryColors } from '../utils/colors';
import CountUp from '../components/CountUp';

const Dashboard: React.FC = () => {
    const { expenses, budgets, addExpense, updateExpense, removeExpense } = useFinance();
    const [showModal, setShowModal] = useState(false);

    // Totals
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const expenseCount = expenses.length;

    // Sum of all budgets (you could also calculate per-category if you want to compare category by category)
    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);

    // Percent used
    const budgetUsedPercent = totalBudget > 0
        ? Math.min(100, Math.round((totalExpenses / totalBudget) * 100))
        : 0;

    const recentExpenses = expenses.slice(0, 5);

    const handleModalSave = (expenseData: Omit<Expense, 'id'>) => {
        addExpense(expenseData);
        setShowModal(false);
    }

    return (
        <div className="dashboard container py-4">
            <h1 className="mb-4" style={{ color: '#5A3E36' }}>
                Welcome back, User!
            </h1>
            <button
                onClick={() => setShowModal(true)}
                className="btn btn-success mb-4"
                style={{ fontWeight: 600, borderRadius: 8 }}
            >
                + Add New Expense
            </button>

            <div className="summary-cards d-flex flex-wrap gap-3 mb-5">
                {/* Total Expenses */}
                <div className="card p-3 flex-fill">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5>Total Expenses</h5>
                        <i className="bi bi-currency-dollar fs-4"></i>
                    </div>
                    <p className="fs-3 fw-bold summary-value"><CountUp value={totalExpenses} prefix="$"/></p>
                </div>

                {/* Budget Used */}
                <div className="card p-3 flex-fill">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5>Budget Used</h5>
                        <i className="bi bi-pie-chart fs-4"></i>
                    </div>
                    <p className="fs-3 fw-bold summary-value"><CountUp value={budgetUsedPercent} suffix="%"/></p>
                    <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${budgetUsedPercent}%`, backgroundColor: '#4A7C59' }}
                            aria-valuenow={budgetUsedPercent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        ></div>
                    </div>
                    <small className="text-muted">${totalExpenses.toFixed(2)} of ${totalBudget.toFixed(2)}</small>
                </div>

                {/* Number of Expenses */}
                <div className="card p-3 flex-fill">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5>Number of Expenses</h5>
                        <i className="bi bi-list-check fs-4"></i>
                    </div>
                    <p className="fs-3 fw-bold summary-value"><CountUp value={expenseCount}/></p>
                </div>
            </div>


            <div className="row">
                <div className="col-md-7 mb-4">
                    <div className="card p-3 h-100">
                        <h5>Spending by Category</h5>
                        <SpendingByCategoryChart />
                    </div>
                </div>
                <div className="col-md-5 mb-4">
                    <div className="card p-3 h-100">
                        <h5>Recent Expenses</h5>
                        <ul className="list-group list-group-flush">
                            {recentExpenses.map((expense) => (
                                <li
                                    key={expense.id}
                                    className="list-group-item d-flex justify-content-between align-items-center interactive"
                                    style={{ borderColor: '#A88F77' }}
                                >
                                    <div>
                                        <div>{expense.description}</div>
                                        <small className="text-muted">{new Date(expense.date).toLocaleDateString()}</small>
                                    </div>
                                    <span className="summary-value me-3"><CountUp value={expense.amount} prefix="$"/></span>
                                    <div className="d-flex align-items-center quick-actions">
                                        <button
                                            className="btn btn-sm btn-outline-primary me-1"
                                            onClick={() => {
                                                setShowModal(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => {
                                                if (window.confirm('Delete this expense?')) {
                                                    removeExpense(expense.id);
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                            {recentExpenses.length === 0 && (
                                <li className="list-group-item text-muted">No recent expenses</li>
                            )}
                        </ul>

                    </div>
                </div>
            </div>

            <ExpenseModal expense={null} isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleModalSave} />
        </div>
    );
};

export default Dashboard;
