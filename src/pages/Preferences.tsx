import React, { useState } from "react";
import { Card, Form, Button, Row, Col, ListGroup } from "react-bootstrap";
import { useFinance } from "../context/FinanceContext";

const PreferencesPage: React.FC = () => {
  const { settings, updateSettings, expenses, budgets } = useFinance();

  // Profile Info
  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);

  // Currency/Locale
  const [currency, setCurrency] = useState(settings.currency);
  const [locale, setLocale] = useState(settings.locale);

  // Categories
  const [categories, setCategories] = useState<string[]>(settings.categories);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (cat: string) => {
    const updatedCategories = categories.filter((c) => c !== cat);
    setCategories(updatedCategories);
  };


  const handleExport = () => {
    // Flatten expenses & budgets into a CSV
    const csvRows: string[] = [];

    // Headers
    csvRows.push('Type,Category,Description,Amount,Date,Month');

    // Expenses
    expenses.forEach(exp => {
      csvRows.push(
        ['Expense', exp.category, exp.description, exp.amount, exp.date, ''].join(',')
      );
    });

    // Budgets
    budgets.forEach(b => {
      csvRows.push(
        ['Budget', b.category, '', b.limit, '', b.month].join(',')
      );
    });

    // Convert to CSV string
    const csvString = csvRows.join('\n');

    // Create a blob and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finance_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = () => {
    alert("Settings saved!");
    updateSettings({ currency, locale, categories, name, email });
  };

  return (
    <div className="preferences-page container py-4">
      <h1>Profile & Settings</h1>

      {/* Profile Info */}
      <Card className="mb-4">
        <Card.Body>
          <h4>Profile Information</h4>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Currency / Locale */}
      <Card className="mb-4">
        <Card.Body>
          <h4>Currency & Locale</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Currency</Form.Label>
                <Form.Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="GBP">GBP (£)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Locale</Form.Label>
                <Form.Select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="fr-FR">Français (FR)</option>
                  <option value="ja-JP">日本語 (JP)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Categories */}
      <Card className="mb-4">
        <Card.Body>
          <h4>Default Categories</h4>
          <ListGroup className="mb-3">
            {categories.map((cat, idx) => (
              <ListGroup.Item
                key={idx}
                className="d-flex justify-content-between align-items-center"
              >
                {cat}
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleRemoveCategory(cat)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Row>
            <Col md={9}>
              <Form.Control
                type="text"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Button
                className="w-100"
                variant="outline-primary"
                onClick={handleAddCategory}
              >
                Add
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Export + Save */}
      <div className="d-flex justify-content-between">
        <Button variant="outline-secondary" onClick={handleExport}>
          Export Data
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default PreferencesPage;
