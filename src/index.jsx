import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import rootReducer from './reducers';
import { SYMBOLS_ADDED, SYMBOLS_MAP, THEME } from './constants';

const initialState = {
  symbolsPicker: {
    map: JSON.parse(localStorage.getItem(SYMBOLS_MAP)),
    symbols: JSON.parse(localStorage.getItem(SYMBOLS_ADDED)),
    filtered: [],
  },
  periodController: {
    period: '1d',
  },
  symbolsData: {
    data: [],
    queryResult: {},
  },
  appStatus: {
    theme: localStorage.getItem(THEME),
    isFetchingData: false,
  },
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
