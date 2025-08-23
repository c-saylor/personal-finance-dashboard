import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Button, Form, Modal } from 'react-bootstrap';

const categories = [
    'Groceries',
    'Utilities',
    'Rent',
    'Entertainment',
    'Transportation',
    'Healthcare',
    'Other',
];

interface ExpenseFormProps {
    show: boolean;
    onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ show, onClose }) => {
    const { addExpense } = useFinance();

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10)); // default today

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!description.trim() || !amount || isNaN(Number(amount))) {
            alert('Please enter valid description and amount');
            return;
        }

        addExpense({
            description: description.trim(),
            amount: Number(amount),
            category,
            date,
        });

        // Reset form
        setDescription('');
        setAmount('');
        setCategory(categories[0]);
        setDate(new Date().toISOString().slice(0, 10));
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3" controlId="desc">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g. Grocery shopping"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="amount">
                        <Form.Label>Amount ($)</Form.Label>
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
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="date">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button
                        variant="success"
                        type="submit"
                        className="w-100"
                        style={{ fontWeight: '600' }}
                    >
                        Add Expense
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ExpenseForm;
