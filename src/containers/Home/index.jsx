import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  renderLander() {
    return (
      <div className="lander">
        <h1>Lemonts</h1>
        <p>education through exploration</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
        </div>
      </div>
    );
  }

  renderLoggedin() {
    return (
      <div className="lander">
        <h1>Lemonts - {localStorage.getItem('firstname')} </h1>
        <p>education through exploration</p>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated
          ? this.renderLoggedin()
          : this.renderLander()}
      </div>
    );
  }
}
