import React from 'react';
import { Nav, Navbar, NavItem, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import axios from 'axios';
import { setTheme } from '../actions/theme';
import logo from '../static/images/logo/Stockd_1024.png';
import { SYMBOLS_MAP, SYMBOLS_EXPIRY, API, TOKEN } from '../constants';
import { setMap, addSymbol } from '../actions/symbolsPicker';

const runQuery = dispatch => {
  const symbolsMap = localStorage.getItem(SYMBOLS_MAP);
  const expiry = localStorage.getItem(SYMBOLS_EXPIRY);
  if (!expiry) {
    dispatch(addSymbol('MSFT'));
  }
  const now = new Date();
  if (
    !symbolsMap ||
    symbolsMap.length === 0 ||
    !expiry ||
    now.getTime() < expiry
  ) {
    const map = [];
    const url = `${API}ref-data/symbols?filter=symbol,name${TOKEN}`;
    console.log(`RQ: Home ${url}`);
    axios.get(url).then(res => {
      res.data.forEach(symbol => {
        map.push(`${symbol.symbol} ${symbol.name}`);
      });
      localStorage.setItem(SYMBOLS_MAP, JSON.stringify(map));

      let time = now.getTime();
      time += 12 * 3600 * 1000;
      localStorage.setItem(SYMBOLS_EXPIRY, time);

      dispatch(setMap(map));
    });
  }
};

const Header = ({ theme, dispatch }) => {
  runQuery(dispatch);

  function handleClick(e) {
    e.preventDefault();
    if (theme === 'dark-mode') {
      dispatch(setTheme('light-mode'));
    } else {
      dispatch(setTheme('dark-mode'));
    }
  }

  let themeButton = (
    <Button onClick={handleClick} className="menu-item" variant="secondary">
      dark
    </Button>
  );

  let bg = 'light';
  if (theme === 'dark-mode') {
    themeButton = (
      <Button onClick={handleClick} className="menu-item" variant="secondary">
        light
      </Button>
    );
    bg = 'dark';
  }

  return (
    <Navbar expand="lg" bg={bg} variant={bg}>
      <Helmet>
        <style>
          {theme === 'dark-mode' ? 'body { background-color: #303030; }' : ''}
        </style>
      </Helmet>
      <LinkContainer to="/">
        <NavItem>
          <img alt="logo" width="40" height="40" src={logo} />
        </NavItem>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/live">
            <Nav.Link className="menu-item">live</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/performance">
            <Nav.Link className="menu-item">performance</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/portfolio">
            <Nav.Link className="menu-item">portfolio</Nav.Link>
          </LinkContainer>
        </Nav>
        {themeButton}
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = state => ({
  theme: state.theme,
});

export default connect(mapStateToProps)(Header);
