import React, { Component } from 'react';
import '../styles/App.scss';
import RatioPerformance from '../components/RatioPerformance';
import SymbolsPicker from '../components/SymbolsPicker';
import { MY_SYMBOLS, SYMBOLS_MAP, DEFAULT_SYMBOLS } from '../constants';

class Performance extends Component {
  map = null;

  state = {
    symbols: JSON.parse(localStorage.getItem(MY_SYMBOLS)),
  };

  componentWillMount() {
    const { symbols } = this.state;
    if (!symbols || symbols.length === 0) {
      this.setState({ symbols: DEFAULT_SYMBOLS.split(',') });
    }
    this.map = JSON.parse(localStorage.getItem(SYMBOLS_MAP));
  }

  render() {
    const { symbols } = this.state;
    return (
      <div>
        <SymbolsPicker />
        <RatioPerformance symbols={symbols} />
      </div>
    );
  }
}

export default Performance;
