import React from 'react';
import {
  Nav,
  Navbar,
  NavDropdown,
  FormControl,
  Form,
  Button,
  NavItem,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default () => (
  <Navbar bg="light" expand="lg">
    <LinkContainer to="/">
      <NavItem>StockD</NavItem>
    </LinkContainer>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <LinkContainer to="/live">
          <NavItem>Live</NavItem>
        </LinkContainer>
        <LinkContainer to="/historical">
          <NavItem>Historical</NavItem>
        </LinkContainer>
        <LinkContainer to="/performance">
          <NavItem>Performance</NavItem>
        </LinkContainer>
      </Nav>
      <LinkContainer to="/login">
        <NavItem>Login</NavItem>
      </LinkContainer>
    </Navbar.Collapse>
  </Navbar>
);
