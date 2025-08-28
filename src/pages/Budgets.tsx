import React, { useState } from "react";
import { Card, Button, Table, Badge, Row, Col } from "react-bootstrap";
import { useFinance, Budget } from "../context/FinanceContext";
import BudgetModal from "../components/BudgetModal";
import { categoryColors } from "../utils/colors";

const BudgetsPage: React.FC = () => {
  const { budgets, expenses, addBudget, updateBudget, removeBudget } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`;
  const budgetsThisMonth = budgets.filter(b => b.month === monthKey);

  const getSpentForCategory = (category: string) => {
    return expenses
      .filter(e => e.category === category &&
        new Date(e.date).getFullYear() === currentMonth.getFullYear() &&
        new Date(e.date).getMonth() === currentMonth.getMonth())
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingBudget(null);
    setShowModal(true);
  };

  const handleCopyFromPreviousMonth = () => {
    const [year, month] = monthKey.split("-").map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevMonthKey = `${prevYear}-${prevMonth}`;

    const previousBudgets = budgets.filter(b => b.month === prevMonthKey);
    previousBudgets.forEach(b => {
      addBudget({ ...b, month: monthKey });
    });
  };

  return (
    <div className="budgets-page container py-4">
      <h1>Budgets</h1>

      <Row className="mb-4">
        <Col md={3}>
          <Button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
            <i className="bi bi-chevron-left" /> Previous Month
          </Button>
        </Col>
        <Col md={6} className="text-center">
          <h5>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h5>
        </Col>
        <Col md={3} className="text-end">
          <Button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
            Next Month <i className="bi bi-chevron-right" />
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          {budgetsThisMonth.length === 0 ? (
            <div className="text-center py-5">
              <p>No budgets set for this month yet.</p>
              <Button onClick={handleCopyFromPreviousMonth}>
                Copy Budgets from Previous Month
              </Button>
            </div>
          ) : (
            <Table hover responsive className="budgets-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Budget</th>
                  <th>Spent</th>
                  <th>Remaining</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgetsThisMonth.map(budget => {
                  const spent = getSpentForCategory(budget.category);
                  const remaining = budget.limit - spent;
                  const progressPercent = Math.min((spent / budget.limit) * 100, 100);
                  let progressColor = "#4A7C59";
                  if (progressPercent >= 70 && progressPercent < 100) progressColor = "#ffc107";
                  if (progressPercent >= 100) progressColor = "#dc3545";
                  const bgColor = categoryColors[budget.category] || "#4A7C59";
                  const textColor = "#fff";

                  return (
                    <tr key={budget.id}>
                      <td>
                        <span className="badge" style={{ backgroundColor: bgColor, color: textColor }}>
                          {budget.category}
                        </span>
                      </td>
                      <td>${budget.limit.toFixed(2)}</td>
                      <td>${spent.toFixed(2)}</td>
                      <td>${remaining.toFixed(2)}</td>
                      <td>
                        <div style={{ backgroundColor: "#e0e0e0", borderRadius: 8, height: 12 }}>
                          <div style={{
                            width: `${progressPercent}%`,
                            backgroundColor: progressColor,
                            height: '100%',
                            borderRadius: 8
                          }}></div>
                        </div>
                      </td>
                      <td>
                        <Button size="sm" variant="outline-primary" onClick={() => handleEdit(budget)}>Edit</Button>{' '}
                        <Button size="sm" variant="outline-danger" onClick={() => removeBudget(budget.id)}>Delete</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Button
        variant="primary"
        className="add-budget-btn rounded-circle shadow-lg position-fixed"
        onClick={handleAdd}
      >
        +
      </Button>

      <BudgetModal
        show={showModal}
        budget={editingBudget}
        onClose={() => setShowModal(false)}
        categories={['Groceries', 'Utilities', 'Rent', 'Entertainment', 'Transportation', 'Healthcare', 'Other']}
        onSave={(budgetData) => {
          if (editingBudget) {
            updateBudget(editingBudget.id, { ...budgetData, month: editingBudget.month });
          } else {
            addBudget({ ...budgetData, month: monthKey });
          }
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default BudgetsPage;
