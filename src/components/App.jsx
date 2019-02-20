import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './Header';
import Home from '../screens/Home';
import PageNotFound from '../screens/PageNotFound';
import Live from '../screens/Live';
import Performance from '../screens/Performance';
import Login from '../screens/Login';

const App = () => {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/live" component={Live} />
        <Route exact path="/performance" component={Performance} />
        <Route exact path="/404" component={PageNotFound} />
        <Redirect to="/404" />
      </Switch>
    </div>
  );
};

export default App;
