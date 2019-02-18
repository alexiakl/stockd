import {
  ADD_SYMBOL,
  REMOVE_SYMBOL,
  FILTER_SYMBOLS,
} from '../actions/symbolsPicker';

const symbolsPicker = (state = [], action) => {
  switch (action.type) {
    case ADD_SYMBOL: {
      if (state.symbols.indexOf(action.symbol) < 0) {
        return [
          ...state,
          {
            symbols: [...state.symbols, action.symbol],
          },
        ];
      }
      return [...state];
    }
    case REMOVE_SYMBOL: {
      const index = state.symbols.indexOf(action.symbol);
      if (index > -1) {
        return [
          ...state,
          {
            symbols: [
              ...state.symbols.slice(0, index),
              ...state.symbols.slice(index + 1),
            ],
          },
        ];
      }
      return [...state];
    }
    case FILTER_SYMBOLS:
      return [
        ...state,
        {
          filtered: [action.filtered],
        },
      ];
    default:
      return state;
  }
};

export default symbolsPicker;
