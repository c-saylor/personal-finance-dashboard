import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';


const Header: React.FC = () => {
  return (
    <Navbar collapseOnSelect expand="md" variant="light" className="custom-navbar" sticky="top">
      <Container>
        <Navbar.Brand href="/">FinanceDash</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Dashboard</Nav.Link>
            <Nav.Link href="/expenses">Expenses</Nav.Link>
            <Nav.Link href="/budgets">Budgets</Nav.Link>
          </Nav>
          <Nav>
            <i className="bi bi-person-circle profile-icon"/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
