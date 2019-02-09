import React, { Component } from 'react';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import axios from 'axios';

export default class Login extends Component {
  static login(loginObj) {
    localStorage.removeItem('jwtToken');

    axios
      .post(`${process.env.API}auth`, {
        phone_number: loginObj.state.phoneNumber,
        password: loginObj.state.password
      })
      .then(function handleResponse(response) {
        const {
          jwtToken,
          firstname,
          lastname,
          picture,
          phoneNumber,
          role
        } = response.data.data;

        if (jwtToken) {
          localStorage.setItem('jwtToken', jwtToken);
          localStorage.setItem('firstname', firstname);
          localStorage.setItem('lastname', lastname);
          localStorage.setItem('phone_number', phoneNumber);
          localStorage.setItem('picture', picture);
          localStorage.setItem('role', role);
          loginObj.props.userHasAuthenticated(true);
        } else {
          loginObj.props.userHasAuthenticated(false);
        }
        loginObj.setState({ isLoading: false });
      })
      .catch(function handleError() {
        loginObj.props.userHasAuthenticated(false);
        loginObj.setState({ isLoading: false });
      });
  }

  constructor(props) {
    super(props);

    this.state = {
      phoneNumber: '',
      password: ''
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    this.login(this);
  };

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="phoneNumber" bsSize="large">
            <FormLabel>Phone Number</FormLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.phoneNumber}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <FormLabel>Password</FormLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
        </form>
      </div>
    );
  }
}
