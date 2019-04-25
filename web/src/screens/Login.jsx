import React, { Component } from 'react';
import { Button, FormGroup, FormControl } from 'react-bootstrap';
import '../styles/App.scss';
import { connect } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { EMAIL, NAME, TOKEN } from '../constants';
import { setLoggedin } from '../actions/appStatus';
import { log } from '../utils/utils';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  validateForm() {
    const { login, password } = this.state;
    return login.length > 0 && password.length > 0;
  }

  login() {
    const { login, password } = this.state;
    const { dispatch } = this.props;
    const url = `${process.env.REACT_APP_API}login`;

    log(`STOCKD: Login ${url}`);
    axios({
      method: 'post',
      url,
      data: {
        email: login,
        password,
      },
      config: {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      },
    })
      .then(res => {
        console.log(res);
        if (res.data.success === 1) {
          const { jwtToken, firstname, email } = res.data.data;
          localStorage.setItem(TOKEN, jwtToken);
          localStorage.setItem(NAME, firstname);
          localStorage.setItem(EMAIL, email);
          dispatch(setLoggedin(true));
        } else {
          toast.warn('Wrong email / password combination', {
            position: toast.POSITION.BOTTOM_CENTER,
            hideProgressBar: true,
          });
        }
      })
      .catch(() => {
        toast.warn('Failed to login, please try again', {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        });
      });
  }

  render() {
    const { login, password } = this.state;
    const { theme, loggedin } = this.props;
    if (loggedin) {
      return <Redirect to="/live" />;
    }
    return (
      <div className={`${theme} login`}>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="login">
            <span>Email</span>
            <FormControl
              autoFocus
              type="email"
              autoComplete="username"
              value={login}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password">
            <span>Password</span>
            <FormControl
              value={password}
              autoComplete="current-password"
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            onClick={() => this.login()}
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.appStatus.theme,
  loggedin: state.appStatus.loggedin,
});

export default connect(mapStateToProps)(Login);
