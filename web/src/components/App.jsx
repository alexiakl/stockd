import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './layout/Header';
import Footer from './layout/Footer';
import PageNotFound from '../screens/PageNotFound';
import Portfolio from '../screens/Portfolio';
import Login from '../screens/Login';
import '../styles/App.scss';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Header />
      <Switch>
        <Route exact path="/" component={Portfolio} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/404" component={PageNotFound} />
        <Redirect to="/404" />
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
