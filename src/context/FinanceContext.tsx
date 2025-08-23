import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string; // ISO string
}

interface FinanceContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updatedExpense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  clearExpenses: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Helper to generate unique IDs for expenses
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial expenses from localStorage or empty array
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const stored = localStorage.getItem('finance_expenses');
    return stored ? JSON.parse(stored) : [];
  });

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('finance_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Add expense
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { id: generateId(), ...expense };
    setExpenses(prev => [newExpense, ...prev]);
  };

  // Update expense
  const updateExpense = (id: string, updatedExpense: Omit<Expense, 'id'>) => {
    setExpenses((prev) => 
      prev.map((expense) => 
        expense.id === id ? { id, ...updatedExpense } : expense
      )
    );
  };

  // Remove expense
  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  // Clear all expenses (optional)
  const clearExpenses = () => {
    setExpenses([]);
  };

  return (
    <FinanceContext.Provider value={{ expenses, addExpense, removeExpense, updateExpense, clearExpenses }}>
      {children}
    </FinanceContext.Provider>
  );
};

// Hook to use the finance context
export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
