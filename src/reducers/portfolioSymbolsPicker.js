import { cloneDeep } from 'lodash';
import {
  ADD_PORTFOLIO_RECORD,
  REMOVE_PORTFOLIO_RECORD,
  ADD_SYMBOL_RECORD,
} from '../actions/portfolioSymbolsPicker';

const portfolioSymbolsPicker = (state = [], action) => {
  switch (action.type) {
    case ADD_PORTFOLIO_RECORD: {
      const index = state.data
        .map(record => {
          return record.symbol;
        })
        .indexOf(action.symbol);

      if (index < 0) {
        const newPortfolio = cloneDeep(state.data);
        const object = {};
        object.symbol = action.symbol;
        const item = { symbol: action.symbol };
        object.records = [];
        object.records.push(item);
        newPortfolio.push(object);
        return {
          ...state,
          data: newPortfolio,
        };
      }
      return state;
    }
    case ADD_SYMBOL_RECORD: {
      const newPortfolio = cloneDeep(state.data);
      newPortfolio.map(item => {
        console.log(item.symbol);
        console.log(action.symbol);
        if (item.symbol === action.symbol) {
          const record = { symbol: action.symbol };
          console.log('pushed');
          item.records.push(record);
        }
        return item;
      });

      console.log(newPortfolio);
      return {
        ...state,
        data: newPortfolio,
      };
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
