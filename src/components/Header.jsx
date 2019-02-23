import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import { setTheme } from '../actions/theme';
import logo from '../static/images/logo/Stockd_1024.png';

const Header = ({ theme, dispatch }) => {
  function handleClick(e) {
    e.preventDefault();
    if (theme === 'dark-mode') {
      dispatch(setTheme('light-mode'));
    } else {
      dispatch(setTheme('dark-mode'));
    }
  }

  let themeButton = <Navbar.Text onClick={handleClick}>dark</Navbar.Text>;
  let bg = 'light';
  if (theme === 'dark-mode') {
    themeButton = <Navbar.Text onClick={handleClick}>light</Navbar.Text>;
    bg = 'dark';
  }
  return (
    <Navbar expand="lg" bg={bg} variant={bg}>
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
        {themeButton}
        <LinkContainer to="/login">
          <Navbar.Text>login</Navbar.Text>
        </LinkContainer>
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = state => ({
  theme: state.theme,
});

export default connect(mapStateToProps)(Header);
