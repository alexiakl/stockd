import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../static/images/logo/Stockd_1024.png';

export default () => (
  <Navbar bg="light" expand="lg">
    <LinkContainer to="/">
      <NavItem>
        <img alt="logo" width="40" height="40" src={logo} />
      </NavItem>
    </LinkContainer>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <LinkContainer to="/live">
          <NavItem>live</NavItem>
        </LinkContainer>
        <LinkContainer to="/historical">
          <NavItem>historical</NavItem>
        </LinkContainer>
        <LinkContainer to="/performance">
          <NavItem>performance</NavItem>
        </LinkContainer>
      </Nav>
      <LinkContainer to="/login">
        <NavItem>Login</NavItem>
      </LinkContainer>
    </Navbar.Collapse>
  </Navbar>
);
