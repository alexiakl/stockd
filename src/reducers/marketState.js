import { SET_MARKET_OPEN } from '../actions/marketState';

const marketState = (state = [], action) => {
  switch (action.type) {
    case SET_MARKET_OPEN: {
      return {
        ...state,
        isMarketOpen: action.isMarketOpen,
      };
    }
    default:
      return state;
  }
};

export default marketState;
