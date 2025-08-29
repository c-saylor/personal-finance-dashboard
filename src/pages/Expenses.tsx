import React, { useState } from "react";
import { Card, Button, Form, Row, Col, Table } from "react-bootstrap";
import ExpenseModal from "../components/ExpenseModal";
import { Expense, useFinance } from "../context/FinanceContext";
import CountUp from "../components/CountUp";
import { categoryColors } from "../utils/colors";
import { getCurrencySymbol } from "../utils/currency";

const getContrastColor = (hex: string) => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

type SortConfig = { key: keyof Expense; direction: "asc" | "desc"; };

const ExpensesPage: React.FC = () => {
  const { expenses, addExpense, updateExpense, removeExpense, settings } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const currencySymbol = getCurrencySymbol(settings.currency);

  const handleModalSave = (expenseData: Omit<Expense, "id">) => {
    if (editingExpense) updateExpense(editingExpense.id, { ...editingExpense, ...expenseData });
    else addExpense({ ...expenseData });
    setShowModal(false);
    setEditingExpense(null);
  };

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setDateFrom("");
    setDateTo("");
    setSearchTerm("");
  };

  const handleDelete = (expenseId: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) removeExpense(expenseId);
  };

  const handleEditClick = (exp: Expense) => {
    setEditingExpense(exp);
    setShowModal(true);
  };

  const handleSort = (key: keyof Expense) => {
    if (sortConfig && sortConfig.key === key) setSortConfig({ key, direction: sortConfig.direction === "asc" ? "desc" : "asc" });
    else setSortConfig({ key, direction: "asc" });
  };

  const filteredExpenses = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      if (selectedCategory !== "All" && exp.category !== selectedCategory) return false;
      if (dateFrom && expDate < new Date(dateFrom)) return false;
      if (dateTo && expDate > new Date(dateTo)) return false;
      if (searchTerm && !exp.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return expDate.getMonth() === currentMonth.getMonth() && expDate.getFullYear() === currentMonth.getFullYear();
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      let aValue = a[key], bValue = b[key];
      if (key === "date") { aValue = new Date(aValue as string).getTime(); bValue = new Date(bValue as string).getTime(); }
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

  const thisMonthsExpenses = filteredExpenses;
  const totalSpent = thisMonthsExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryTotals: Record<string, number> = {};
  thisMonthsExpenses.forEach(exp => { categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount; });
  const biggestCategory = Object.keys(categoryTotals).length > 0 ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0] : "N/A";
  const daysElapsed = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const averagePerDay = daysElapsed > 0 ? totalSpent / daysElapsed : 0;

  return (
    <div className="expenses-page container py-4">
      <h1>Expenses</h1>

      {/* Month navigation */}
      <Row className="mb-4">
        <Col md={3}><Button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}><i className="bi bi-chevron-left" /> Previous Month</Button></Col>
        <Col md={6} className="text-center"><h5>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h5></Col>
        <Col md={3} className="text-end"><Button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>Next Month <i className="bi bi-chevron-right" /></Button></Col>
      </Row>

      {/* Summary Cards */}
      <div className="summary-cards mb-5 d-flex gap-3">
        <div className="card p-3 flex-fill"><h5>Total Spent</h5><p className="fs-3 fw-bold summary-value"><CountUp value={totalSpent} prefix={currencySymbol} /></p></div>
        <div className="card p-3 flex-fill"><h5>Biggest Category</h5><p className="fs-3 fw-bold summary-value">{biggestCategory}</p></div>
        <div className="card p-3 flex-fill"><h5>Average / Day</h5><p className="fs-3 fw-bold summary-value"><CountUp value={averagePerDay} prefix={currencySymbol} /></p></div>
      </div>

      {/* Filters & Table */}
      <Row>
        <Col md={3} className="mb-4">
          <Card className="filters-card">
            <Card.Body>
              <Card.Title>Filters</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="All">All</option>
                    {settings.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date Range</Form.Label>
                  <Form.Control type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                  <Form.Control type="date" className="mt-2" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Search</Form.Label>
                  <Form.Control type="text" placeholder="Search description" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </Form.Group>
                <Button variant="secondary" className="mt-2 w-100 clear-filter-btn" onClick={handleClearFilters}>Clear Filters</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          <Card className="expenses-card">
            <Card.Body>
              <Card.Title>Expenses</Card.Title>
              <Table hover responsive className="expenses-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>Date {sortConfig?.key === "date" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("category")} style={{ cursor: "pointer" }}>Category {sortConfig?.key === "category" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("description")} style={{ cursor: "pointer" }}>Description {sortConfig?.key === "description" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
                    <th onClick={() => handleSort("amount")} className="text-end" style={{ cursor: "pointer" }}>Amount {sortConfig?.key === "amount" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {thisMonthsExpenses.map(exp => {
                    const bgColor = categoryColors[exp.category] || "#4A7C59";
                    const textColor = getContrastColor(bgColor);
                    return (
                      <tr key={exp.id}>
                        <td>{exp.date}</td>
                        <td><span className="badge" style={{ backgroundColor: bgColor, color: textColor, borderRadius: "0.5rem", padding: "0.35em 0.75em", fontSize: "0.85rem" }}>{exp.category}</span></td>
                        <td>{exp.description}</td>
                        <td className="text-end">{currencySymbol}{exp.amount.toFixed(2)}</td>
                        <td>
                          <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEditClick(exp)}>Edit</Button>
                          <Button size="sm" variant="outline-danger" onClick={() => handleDelete(exp.id)}>Delete</Button>
                        </td>
                      </tr>
                    );
                  })}
                  {thisMonthsExpenses.length === 0 && <tr><td colSpan={5} className="text-center py-3">No expenses for this month.</td></tr>}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Button variant="primary" className="add-expense-btn rounded-circle shadow-lg position-fixed" onClick={() => setShowModal(true)}>+</Button>

      <ExpenseModal expense={editingExpense} isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleModalSave} />
    </div>
  );
};

export default ExpensesPage;
