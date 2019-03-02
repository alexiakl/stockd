import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './Header';
import PageNotFound from '../screens/PageNotFound';
import Portfolio from '../screens/Portfolio';
import Live from '../screens/Live';
import Compare from '../screens/Compare';
import Login from '../screens/Login';
import '../styles/App.scss';

const App = () => {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Live} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/live" component={Live} />
        <Route exact path="/compare" component={Compare} />
        <Route exact path="/portfolio" component={Portfolio} />
        <Route exact path="/404" component={PageNotFound} />
        <Redirect to="/404" />
      </Switch>
    </div>
  );
};

export default App;
