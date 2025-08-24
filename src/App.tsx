import React from 'react';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import {FinanceProvider} from './context/FinanceContext';
import './styles/main.scss';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExpensesPage from './pages/Expenses';
import BudgetsPage from './pages/Budgets';

const App: React.FC = () => {
  return (
    <FinanceProvider>
      <Router>
        <Header />
        <Container className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />}/>
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
          </Routes>
        </Container>
      </Router>
    </FinanceProvider>
  );
};

export default App;
