import React, { useState } from 'react';
import { useFinance, Expense } from '../context/FinanceContext';
import { Container } from 'react-bootstrap';
import ExpenseModal from '../components/ExpenseModal';

const ExpensesPage: React.FC = () => {
  const { expenses, removeExpense, addExpense, updateExpense } = useFinance();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Handle save after editing or adding
  const handleSave = (data: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
    setShowEditModal(false);
    setEditingExpense(null);
  };

  return (
    <Container className="expenses">
      <h1>All Expenses</h1>

      {expenses.length === 0 ? (
        <p className="no-expenses">No expenses found. Add some!</p>
      ) : (
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount ($)</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(({ id, description, amount, category, date }) => (
              <tr key={id}>
                <td>{description}</td>
                <td>${amount.toFixed(2)}</td>
                <td>{category}</td>
                <td>{new Date(date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => {
                      setEditingExpense({ id, description, amount, category, date });
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this expense?')) {
                        removeExpense(id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Expense Button */}
      <button
        className="add-expense-btn"
        onClick={() => {
          setEditingExpense(null);
          setShowEditModal(true);
        }}
      >
        + Add Expense
      </button>

      {/* Expense Modal */}
      <ExpenseModal
        expense={editingExpense}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
      />
    </Container>
  );
};

export default ExpensesPage;
