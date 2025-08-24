import React, { useState } from "react";
import { Container, ProgressBar } from "react-bootstrap";
import { useFinance } from "../context/FinanceContext";
import BudgetModal from "../components/BudgetModal";

interface Budget {
  id: string;
  category: string;
  limit: number;
}

const BudgetsPage: React.FC = () => {
  const { expenses, budgets, addBudget, updateBudget, removeBudget } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const handleSave = (budget: Omit<Budget, "id">) => {
    if (editingBudget) {
      updateBudget(editingBudget.id, budget);
    } else {
      addBudget(budget);
    }
    setShowModal(false);
    setEditingBudget(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this budget?")) {
      removeBudget(id);
    }
  };

  const getSpent = (category: string) =>
    expenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);

  return (
    <Container className="budgets container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Budgets</h1>
        <button
          className="btn btn-primary add-budget-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <p className="no-budgets">No budgets set yet. Add one!</p>
      ) : (
        <div className="budget-list">
          {budgets.map(({ id, category, limit }) => {
            const spent = getSpent(category);
            const percentage = Math.min((spent / limit) * 100, 100);

            return (
              <div
                key={id}
                className="budget-item mb-4 p-3 rounded shadow-sm"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #A88F77" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 style={{ color: "#5A3E36" }}>{category}</h5>
                  <div>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {
                        setEditingBudget({ id, category, limit });
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mb-1">
                  Spent: ${spent.toFixed(2)} / ${limit.toFixed(2)}
                </p>
                <ProgressBar
                  now={percentage}
                  label={`${Math.round(percentage)}%`}
                  variant={percentage >= 100 ? "danger" : "success"}
                />
              </div>
            );
          })}
        </div>
      )}

      <BudgetModal
        budget={editingBudget}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        categories={['Groceries', 'Utilities', 'Rent', 'Entertainment', 'Transportation', 'Healthcare', 'Other']}
      />
    </Container>
  );
};

export default BudgetsPage;
