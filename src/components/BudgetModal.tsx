import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface Budget {
  id: string;
  category: string;
  limit: number;
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
  categories
}) => {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState<number>(0);

  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setLimit(budget.limit);
    } else {
      setCategory(categories[0]);
      setLimit(0);
    }
  }, [budget, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || limit <= 0) return;
    onSave({ category, limit });
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
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
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
