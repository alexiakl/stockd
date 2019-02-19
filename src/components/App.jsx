import React from 'react';

import { Switch, Route } from 'react-router-dom';
import Header from '../containers/Header';
import Home from '../containers/Home';
import Live from '../containers/Live';
import Performance from '../containers/Performance';
import Historical from '../containers/Historical';
import Login from '../containers/Login';

const App = () => {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/live" component={Live} />
        <Route exact path="/performance" component={Performance} />
        <Route exact path="/historical" component={Historical} />
      </Switch>
    </div>
  );
};

export default App;
