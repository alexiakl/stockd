import React from 'react';
import { Nav, Navbar, NavItem, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import axios from 'axios';
import { setTheme, setLoggedin } from '../../actions/appStatus';
import logo from '../../static/images/logo/Stockd_1024.png';
import {
  SYMBOLS_MAP,
  SYMBOLS_EXPIRY,
  IEXAPI,
  IEXTOKEN,
  TOKEN,
} from '../../constants';
import { logoutEverywhere } from '../../utils/utils';
import { setMap, addSymbol } from '../../actions/symbolsPicker';

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
    now.getTime() > expiry
  ) {
    const map = [];
    const url = `${IEXAPI}ref-data/symbols?filter=symbol,name${IEXTOKEN}`;
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

  function logout(e) {
    e.preventDefault();
    localStorage.removeItem(TOKEN);
    dispatch(setLoggedin(false));
  }

  function logoutAll(e) {
    e.preventDefault();
    logoutEverywhere(dispatch);
  }

  let themeButton = (
    <Dropdown.Item onClick={handleClick}>Night Mode</Dropdown.Item>
  );

  let bg = 'light';
  if (theme === 'dark-mode') {
    themeButton = <Dropdown.Item onClick={handleClick}>Day Mode</Dropdown.Item>;
    bg = 'dark';
  }

  let addClass = '';
  if (window.location.pathname === '/') {
    addClass = 'active';
  }

  const settings = (
    <React.Fragment>
      <Dropdown.Toggle size="sm" variant="outline-info" id="dropdown-settings">
        Settings
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {themeButton}
        <Dropdown.Divider />
        <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
        <Dropdown.Item onClick={logoutAll}>Logout Everywhere</Dropdown.Item>
      </Dropdown.Menu>
    </React.Fragment>
  );

  let dropdown = <Dropdown alignRight>{settings}</Dropdown>;
  if (window.innerWidth < 992) {
    dropdown = <Dropdown>{settings}</Dropdown>;
  }

  return (
    <Navbar expand="lg" bg={bg} variant={bg} className={theme}>
      <Helmet>
        <style>
          {theme === 'dark-mode' ? 'body { background-color: #303030; }' : ''}
        </style>
      </Helmet>
      <NavItem>
        <img alt="logo" width="40" height="40" src={logo} />
      </NavItem>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/live">
            <Nav.Link className={`menu-item ${addClass}`}>live</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/compare">
            <Nav.Link className="menu-item">compare</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/portfolio">
            <Nav.Link className="menu-item">portfolio</Nav.Link>
          </LinkContainer>
        </Nav>
        {dropdown}
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = state => ({
  theme: state.appStatus.theme,
});

export default connect(mapStateToProps)(Header);
