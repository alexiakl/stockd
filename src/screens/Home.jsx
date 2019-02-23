import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import SymbolsPicker from '../components/SymbolsPicker';
import { SYMBOLS_MAP, API, TOKEN } from '../constants';
import { setMap } from '../actions/symbolsPicker';

const runQuery = dispatch => {
  const symbolsMap = localStorage.getItem(SYMBOLS_MAP);
  if (!symbolsMap || symbolsMap.length === 0) {
    const map = [];
    const url = `${API}ref-data/symbols?filter=symbol,name${TOKEN}`;
    console.log(`RQ: Home ${url}`);
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

const mapStateToProps = state => ({
  marketState: state.marketState,
  period: state.periodController.period,
  symbols: state.symbolsPicker.symbols,
});

export default connect(mapStateToProps)(Home);
