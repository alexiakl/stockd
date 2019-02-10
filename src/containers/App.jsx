import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Live from './Live';
import Performance from './Performance';
import Historical from './Historical';
import Login from './Login';

class App extends Component {
  componentDidMount() {
    this.symbolsMap = localStorage.getItem('symbolsMap');
    if (!this.symbolsMap || this.symbolsMap.length === 0) {
      this.runQuery();
    }
  }

  runQuery = () => {
    const map = [];
    const url = `https://api.iextrading.com/1.0/ref-data/symbols?filter=symbol,name`;
    axios.get(url).then(res => {
      res.data.forEach(symbol => {
        map.push(`${symbol.symbol} ${symbol.name}`);
      });
      localStorage.setItem('symbolsMap', JSON.stringify(map));
    });
  };

  render() {
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
        <Footer />
      </div>
    );
  }
}

export default App;
