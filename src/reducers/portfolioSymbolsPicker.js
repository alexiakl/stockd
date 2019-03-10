import { cloneDeep } from 'lodash';
import {
  ADD_PORTFOLIO_RECORD,
  REMOVE_PORTFOLIO_RECORD,
} from '../actions/portfolioSymbolsPicker';

const portfolioSymbolsPicker = (state = [], action) => {
  switch (action.type) {
    case ADD_PORTFOLIO_RECORD: {
      const index = state.data
        .map(record => {
          return record.symbol;
        })
        .indexOf(action.symbol);

      const newPortfolio = cloneDeep(state.data);
      if (index < 0) {
        const object = {};
        object.symbol = action.symbol;
        newPortfolio.push(object);
        return {
          ...state,
          data: newPortfolio,
        };
      }
      return state;
    }
    case REMOVE_PORTFOLIO_RECORD: {
      const index = state.data
        .map(record => {
          return record.symbol;
        })
        .indexOf(action.symbol);
      if (index > -1) {
        const newPortfolio = [
          ...state.data.slice(0, index),
          ...state.data.slice(index + 1),
        ];
        return {
          ...state,
          data: newPortfolio,
        };
      }
      return state;
    }
    default:
      return state;
  }
};

export default portfolioSymbolsPicker;
