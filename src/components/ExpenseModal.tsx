import React, {useEffect, useState} from 'react';
import { Expense } from '../context/FinanceContext';
import {Button, Modal, Form} from 'react-bootstrap';

interface EditExpenseModalProps {
    expense: Expense | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedExpense: Omit<Expense, 'id'>) => void;
  }
  
  const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ expense, isOpen, onClose, onSave }) => {
    const [description, setDescription] = useState(expense?.description || '');
    const [amount, setAmount] = useState(expense?.amount.toString() || '');
    const [category, setCategory] = useState(expense?.category || 'Groceries');
    const [date, setDate] = useState(expense?.date || new Date().toISOString().slice(0, 10));
  
    useEffect(() => {
      if (isOpen && expense) {
        setDescription(expense.description);
        setAmount(expense.amount.toString());
        setCategory(expense.category);
        setDate(expense.date);
      } else if (!isOpen) {
        setDescription('');
        setAmount('');
        setCategory('Groceries');
        setDate(new Date().toISOString().slice(0, 10));
      }
    }, [expense, isOpen]);
    
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!description.trim() || !amount || isNaN(Number(amount))) {
        alert('Please enter valid description and amount');
        return;
      }
  
      onSave({
        description: description.trim(),
        amount: Number(amount),
        category,
        date,
      });
    };
  
    return (
      <Modal show={isOpen} onHide={onClose} centered className="expense-modal">
        <Modal.Header closeButton>
          <Modal.Title>{expense ? 'Edit Expense' : 'Add Expense'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
  
            <Form.Group className="mb-3" controlId="desc">
              <Form.Label>Description<span className="required">*</span></Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </Form.Group>
  
            <Form.Group className="mb-3" controlId="amount">
              <Form.Label>Amount ($)<span className="required">*</span></Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </Form.Group>
  
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category<span className="required">*</span></Form.Label>
              <Form.Select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="form-control"
              >
                {['Groceries', 'Utilities', 'Rent', 'Entertainment', 'Transportation', 'Healthcare', 'Other'].map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
  
            <Form.Group className="mb-3" controlId="date">
              <Form.Label>Date<span className="required">*</span></Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </Form.Group>
  
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              style={{ fontWeight: '600' }}
            >
              {expense ? "Save Changes" : "Add Expense"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  export default EditExpenseModal;