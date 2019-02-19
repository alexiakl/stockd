import {
  ADD_SYMBOL,
  REMOVE_SYMBOL,
  FILTER_SYMBOLS,
  SET_MAP,
} from '../actions/symbolsPicker';

const symbolsPicker = (state = [], action) => {
  switch (action.type) {
    case ADD_SYMBOL: {
      if (state.symbols.indexOf(action.symbol) < 0) {
        return {
          ...state,
          symbols: [...state.symbols, action.symbol],
        };
      }
      return state;
    }
    case REMOVE_SYMBOL: {
      const index = state.symbols.indexOf(action.symbol);
      if (index > -1) {
        return {
          ...state,
          symbols: [
            ...state.symbols.slice(0, index),
            ...state.symbols.slice(index + 1),
          ],
        };
      }
      return state;
    }
    case FILTER_SYMBOLS: {
      let filtered = [];
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
