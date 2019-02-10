import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Live from './Live';
import Performance from './Performance';
import Historical from './Historical';
import Login from './Login';

export default () => (
  <div>
    <Header />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/live" component={Live} />
      <Route exact path="/performance" component={Performance} />
      <Route exact path="/historical" component={Historical} />
    </Switch>
    <Footer />
  </div>
);
