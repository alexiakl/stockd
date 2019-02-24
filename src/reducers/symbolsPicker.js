import {
  ADD_SYMBOL,
  REMOVE_SYMBOL,
  FILTER_SYMBOLS,
  SET_MAP,
} from '../actions/symbolsPicker';

import { SYMBOLS_ADDED } from '../constants';

const symbolsPicker = (state = [], action) => {
  switch (action.type) {
    case ADD_SYMBOL: {
      if (!state.symbols) {
        const newSymbols = [];
        newSymbols.push(action.symbol);
        localStorage.setItem(SYMBOLS_ADDED, JSON.stringify(newSymbols));
        return {
          ...state,
          symbols: newSymbols,
        };
      }
      if (state.symbols.indexOf(action.symbol) < 0) {
        const newSymbols = [...state.symbols, action.symbol];
        localStorage.setItem(SYMBOLS_ADDED, JSON.stringify(newSymbols));
        return {
          ...state,
          symbols: newSymbols,
        };
      }
      return state;
    }
    case REMOVE_SYMBOL: {
      const index = state.symbols.indexOf(action.symbol);
      if (index > -1) {
        const newSymbols = [
          ...state.symbols.slice(0, index),
          ...state.symbols.slice(index + 1),
        ];
        localStorage.setItem(SYMBOLS_ADDED, JSON.stringify(newSymbols));
        return {
          ...state,
          symbols: newSymbols,
        };
      }
      return state;
    }
    case FILTER_SYMBOLS: {
      let filtered = [];
      if (!state.map || state.map.length < 100) {
        return filtered;
      }
      if (action.symbol.length > 0) {
        filtered = state.map.filter(symbol => {
          return symbol.toUpperCase().indexOf(action.symbol.toUpperCase()) >= 0;
        });
        if (filtered.length > 5) {
          filtered = filtered.slice(0, 5);
        }
      }

      return { ...state, filtered };
    }
    case SET_MAP: {
      const { map } = action;
      return { ...state, map };
    }
    default:
      return state;
  }
};

export default symbolsPicker;
