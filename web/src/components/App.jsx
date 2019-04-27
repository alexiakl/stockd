import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './layout/Header';
import Footer from './layout/Footer';
import PageNotFound from '../screens/PageNotFound';
import Portfolio from '../screens/Portfolio';
import Live from '../screens/Live';
import Compare from '../screens/Compare';
import Login from '../screens/Login';
import '../styles/App.scss';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Header />
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/portfolio" />} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/portfolio" component={Portfolio} />
        <Route exact path="/live" component={Live} />
        <Route exact path="/compare" component={Compare} />
        <Route exact path="/404" component={PageNotFound} />
        <Redirect to="/404" />
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
