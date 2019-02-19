import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import rootReducer from './reducers';

import { SYMBOLS_ADDED, SYMBOLS_MAP, SYMBOLS_DEFAULT } from './constants';

const initialState = {
  symbolsPicker: {
    map: JSON.parse(localStorage.getItem(SYMBOLS_MAP)),
    symbols: JSON.parse(localStorage.getItem(SYMBOLS_ADDED)),
    default: JSON.parse(localStorage.getItem(SYMBOLS_DEFAULT)),
    filtered: [],
  },
  periodController: {
    period: '1d',
  },
  marketState: {
    isMarketOpen: false,
    queryDone: false,
  },
  chartData: {},
  liveChartData: {},
};
const store = createStore(rootReducer, initialState);

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root'),
);
