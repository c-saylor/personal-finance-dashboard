import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string; // YYYY-MM format
}

interface BudgetModalProps {
  budget: Budget | null;
  show: boolean;
  onClose: () => void;
  onSave: (budget: Omit<Budget, "id">) => void;
  categories: string[];
}

const BudgetModal: React.FC<BudgetModalProps> = ({
  budget,
  show,
  onClose,
  onSave,
  categories,
}) => {
  const now = new Date();
  const defaultMonth = now.toISOString().slice(0, 7); // YYYY-MM

  const [category, setCategory] = useState<string>(budget?.category || categories[0]);
  const [limit, setLimit] = useState<number>(budget?.limit || 0);
  const [month, setMonth] = useState<string>(budget?.month || defaultMonth);

  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setLimit(budget.limit);
      setMonth(budget.month || defaultMonth);
    } else {
      setCategory(categories[0]);
      setLimit(0);
      setMonth(defaultMonth);
    }
  }, [budget, categories, defaultMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || limit <= 0 || !month) return;
    onSave({ category, limit, month });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered className="budget-modal">
      <Modal.Header closeButton>
        <Modal.Title>{budget ? "Edit Budget" : "Add Budget"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="formCategory" className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formLimit" className="mb-3">
            <Form.Label>Limit ($)</Form.Label>
            <Form.Control
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseFloat(e.target.value))}
              required
            />
          </Form.Group>

          <Form.Group controlId="formMonth" className="mb-3">
            <Form.Label>Month</Form.Label>
            <Form.Control
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {budget ? "Save Changes" : "Add Budget"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BudgetModal;
