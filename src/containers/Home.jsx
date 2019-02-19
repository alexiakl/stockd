import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import SymbolsPicker from './SymbolsPicker';
import { SYMBOLS_MAP } from '../constants';
import { setMap } from '../actions/symbolsPicker';

const mapStateToProps = state => ({
  isMarketOpen: state.marketState.isMarketOpen,
  period: state.periodController.period,
  symbols: state.symbolsPicker.symbols,
});

const runQuery = dispatch => {
  const symbolsMap = localStorage.getItem(SYMBOLS_MAP);
  if (!symbolsMap || symbolsMap.length === 0) {
    const map = [];
    const url = `https://api.iextrading.com/1.0/ref-data/symbols?filter=symbol,name`;
    console.log(`RQ: App ${url}`);
    axios.get(url).then(res => {
      res.data.forEach(symbol => {
        map.push(`${symbol.symbol} ${symbol.name}`);
      });
      localStorage.setItem(SYMBOLS_MAP, JSON.stringify(map));
      dispatch(setMap(map));
    });
  }
};

const Home = ({ dispatch }) => {
  runQuery(dispatch);
  return (
    <div>
      <SymbolsPicker />
    </div>
  );
};
export default connect(mapStateToProps)(Home);
