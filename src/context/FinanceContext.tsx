import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string; //yyyy-mm preferrered
}

interface FinanceContextType {
  expenses: Expense[];
  budgets: Budget[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updatedExpense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  clearExpenses: () => void;

  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, updatedBudget: Omit<Budget, 'id'>) => void;
  removeBudget: (id: string) => void;
  clearBudgets: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial expenses from localStorage or empty array
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const stored = localStorage.getItem('finance_expenses');
    return stored ? JSON.parse(stored) : [];
  });

  // Initialize budgets
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const stored = localStorage.getItem('finance_budgets');
    return stored ? JSON.parse(stored) : [];
  });

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('finance_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Persist budgets
  useEffect(() => {
    localStorage.setItem('finance_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Methods
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { id: generateId(), ...expense };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updatedExpense: Omit<Expense, 'id'>) => {
    setExpenses((prev) => 
      prev.map((expense) => 
        expense.id === id ? { id, ...updatedExpense } : expense
      )
    );
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const clearExpenses = () => {
    setExpenses([]);
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = { id: generateId(), ...budget };
    setBudgets(prev => [newBudget, ...prev]);
  };

  const updateBudget = (id: string, updatedBudget: Omit<Budget, 'id'>) => {
    setBudgets(prev =>
      prev.map(budget => (budget.id === id ? { id, ...updatedBudget } : budget))
    );
  };

  const removeBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const clearBudgets = () => setBudgets([]);

  return (
    <FinanceContext.Provider 
      value={{ 
        expenses, 
        budgets,
        addExpense, 
        removeExpense, 
        updateExpense, 
        clearExpenses,
        addBudget,
        removeBudget,
        updateBudget,
        clearBudgets
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
