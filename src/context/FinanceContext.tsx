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
  month: string; // yyyy-mm preferred
}

export interface FinanceSettings {
  currency: string;
  locale: string;
  categories: string[];
  name: string;
  email: string;
}

interface FinanceContextType {
  settings: FinanceSettings;
  updateSettings: (updates: Partial<FinanceSettings>) => void;

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

const defaultSettings: FinanceSettings = {
  currency: "USD",
  locale: "en-US",
  categories: ["Groceries", "Utilities", "Rent", "Entertainment", "Transportation", "Healthcare", "Other"],
  name: "John Doe",
  email: "john@example.com",
};

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<FinanceSettings>(() => {
    const stored = localStorage.getItem("finance_settings");
    return stored ? JSON.parse(stored) : defaultSettings;
  });
  

  // Load initial expenses
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const stored = localStorage.getItem('finance_expenses');
    return stored ? JSON.parse(stored) : [];
  });

  // Load initial budgets
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const stored = localStorage.getItem('finance_budgets');
    return stored ? JSON.parse(stored) : [];
  });

  // Persist settings 
  useEffect(() => {
    localStorage.setItem('finance_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist expenses
  useEffect(() => {
    localStorage.setItem('finance_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Persist budgets
  useEffect(() => {
    localStorage.setItem('finance_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Methods
  const updateSettings = (updates: Partial<FinanceSettings>) => {
    setSettings((prev) => {
      const updated = {...prev, ...updates};
      localStorage.setItem("finance_settings", JSON.stringify(updated));
      return updated;
    });
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { id: generateId(), ...expense };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updatedExpense: Omit<Expense, 'id'>) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { id, ...updatedExpense } : expense
      )
    );
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const clearExpenses = () => setExpenses([]);


  const addBudget = (budget: Omit<Budget, "id" | "month"> & { month?: string }) => {
    const now = new Date();
    const defaultMonth = now.toISOString().slice(0, 7); // YYYY-MM
    const newBudget: Budget = {
      id: generateId(),
      month: budget.month || defaultMonth, // fallback if not provided
      category: budget.category,
      limit: budget.limit,
    };
    setBudgets((prev) => [newBudget, ...prev]);
  };
  
  
  const updateBudget = (id: string, updatedBudget: Omit<Budget, 'id'>) => {
    setBudgets((prev) =>
      prev.map((budget) =>
        budget.id === id
          ? { ...budget, ...updatedBudget, month: updatedBudget.month || budget.month }
          : budget
      )
    );
  };
  
  


  const removeBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const clearBudgets = () => setBudgets([]);

  return (
    <FinanceContext.Provider
      value={{
        settings,
        updateSettings,
        expenses,
        budgets,
        addExpense,
        updateExpense,
        removeExpense,
        clearExpenses,
        addBudget,
        updateBudget,
        removeBudget,
        clearBudgets,
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
