import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../static/images/logo/Stockd_1024.png';

export default () => (
  <Navbar expand="lg" bg="dark" variant="dark">
    <LinkContainer to="/">
      <NavItem>
        <img alt="logo" width="40" height="40" src={logo} />
      </NavItem>
    </LinkContainer>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <LinkContainer to="/live">
          <Navbar.Text>live</Navbar.Text>
        </LinkContainer>
        <LinkContainer to="/performance">
          <Navbar.Text>performance</Navbar.Text>
        </LinkContainer>
        <LinkContainer to="/portfolio">
          <Navbar.Text>portfolio</Navbar.Text>
        </LinkContainer>
      </Nav>
      <LinkContainer to="/login">
        <Navbar.Text>login</Navbar.Text>
      </LinkContainer>
    </Navbar.Collapse>
  </Navbar>
);
