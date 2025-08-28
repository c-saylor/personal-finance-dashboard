import React, { useState } from 'react';
import { useFinance, Expense } from '../context/FinanceContext';
import SpendingByCategoryChart from '../components/SpendingByCategoryChart';
import ExpenseModal from '../components/ExpenseModal';
import CountUp from '../components/CountUp';
import SpendingOverTimeChart from '../components/SpendingOverTimeChart';

const Dashboard: React.FC = () => {
    const { expenses, budgets, addExpense, removeExpense } = useFinance();
    const [showModal, setShowModal] = useState(false);

    // Totals
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const expenseCount = expenses.length;
    const totalBudget = budgets.reduce((sum, b) => sum + Number(b.limit || 0), 0);
    const budgetUsedPercent = totalBudget > 0
        ? Math.min(100, Math.round((totalExpenses / totalBudget) * 100))
        : 0;

    const recentExpenses = expenses.slice(0, 5);

    const handleModalSave = (expenseData: Omit<Expense, 'id'>) => {
        addExpense(expenseData);
        setShowModal(false);
    };

    const getBudgetStatus = (category: string) => {
        const budget = budgets.find(b => b.category === category);
        if (!budget) return 'safe';

        const spent = expenses
            .filter(e => e.category === category)
            .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

        if (percentage >= 100) return 'over';
        if (percentage >= 80) return 'warning';
        return 'safe';
    };

    return (
        <div className="dashboard container py-4">

            <h1 className="mb-4">Welcome back, User!</h1>

            <button
                onClick={() => setShowModal(true)}
                className="btn btn-success mb-4"
            >
                + Add New Expense
            </button>

            {/* Summary Cards */}
            <div className="summary-cards mb-5">
                {[
                    { title: 'Total Expenses', icon: 'bi-currency-dollar', value: totalExpenses, prefix: '$' },
                    { title: 'Budget Used', icon: 'bi-pie-chart', value: budgetUsedPercent, suffix: '%', progress: budgetUsedPercent, subText: `$${totalExpenses.toFixed(2)} of $${totalBudget.toFixed(2)}` },
                    { title: 'Number of Expenses', icon: 'bi-list-check', value: expenseCount },
                ].map(card => (
                    <div key={card.title} className="card p-3 flex-fill">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5>{card.title}</h5>
                            <i className={`bi ${card.icon} fs-4`} />
                        </div>
                        <p className="fs-3 fw-bold summary-value">
                            <CountUp
                                value={card.value}
                                prefix={card.prefix || ''}
                                suffix={card.suffix || ''}
                            />
                        </p>
                        {card.progress !== undefined && (
                            <>
                                <div className="progress mb-2">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: `${card.progress}%`, backgroundColor: '#4A7C59' }}
                                        aria-valuenow={card.progress}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    />
                                </div>
                                <small className="text-muted">{card.subText}</small>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts + Recent Expenses */}
            <div className="row mb-5">
                <div className="col-md-7 mb-4">
                    <div className="card p-3 h-100 d-flex flex-column">
                        <h5>Spending by Category</h5>
                        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                            <SpendingByCategoryChart />
                        </div>
                    </div>
                </div>
                <div className="col-md-5 mb-4">
                    <div className="card p-3 h-100">
                        <h5>Recent Expenses</h5>
                        <ul className="list-group list-group-flush">
                            {recentExpenses.length > 0 ? recentExpenses.map(expense => (
                                <li key={expense.id} className="list-group-item d-flex justify-content-between align-items-center interactive">
                                    <div>
                                        <div>{expense.description}</div>
                                        <small className="text-muted">{new Date(expense.date).toLocaleDateString()}</small>
                                    </div>
                                    <span className="summary-value me-3">
                                        <CountUp value={Number(expense.amount || 0)} prefix="$" />
                                    </span>
                                    <div className="d-flex align-items-center quick-actions">
                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => setShowModal(true)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => window.confirm('Delete this expense?') && removeExpense(expense.id)}>Delete</button>
                                    </div>
                                </li>
                            )) : <li className="list-group-item text-muted">No recent expenses</li>}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Budget Cards */}
            <div className="summary-cards mb-5">
                {budgets.map(budget => {
                    const { category, limit } = budget;
                    const spent = expenses
                        .filter(e => e.category === category)
                        .reduce((sum, e) => sum + Number(e.amount || 0), 0);

                    const percentUsed = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
                    const status = getBudgetStatus(category);

                    const statusContent = {
                        warning: <span className="budget-alert text-warning"><i className="bi bi-exclamation-triangle-fill me-1" /> Approaching Budget</span>,
                        over: <span className="budget-alert text-danger"><i className="bi bi-x-circle-fill me-1" /> Over Budget</span>,
                        safe: <span className="budget-alert text-success"><i className="bi bi-check-circle-fill me-1" /> Within Budget</span>,
                    };

                    return (
                        <div key={category} className="card p-3 flex-fill">
                            <h5>{category}</h5>
                            <p className="fs-3 fw-bold summary-value"><CountUp value={spent} prefix="$" /></p>
                            <div className="progress mb-2">
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${percentUsed}%`, backgroundColor: '#4A7C59' }}
                                    aria-valuenow={percentUsed}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                />
                            </div>
                            <small className="text-muted">${spent.toFixed(2)} of ${limit.toFixed(2)}</small>
                            <div className="mt-1">{statusContent[status]}</div>
                        </div>
                    );
                })}
            </div>
            <div className="mb-4">
                <div className="card p-3 h-100">
                    <h5>Spending Over Time</h5>
                    <SpendingOverTimeChart />
                </div>
            </div>

            <ExpenseModal
                expense={null}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleModalSave}
            />
        </div>
    );
};

export default Dashboard;
