import { cloneDeep } from 'lodash';
import { savePortfolio } from '../utils/utils';
import {
  ADD_PORTFOLIO_RECORD,
  ADD_SYMBOL_RECORD,
  REMOVE_SYMBOL_RECORD,
  PORTFOLIO_QUOTES,
} from '../actions/portfolio';

const portfolio = (state = [], action) => {
  switch (action.type) {
    case PORTFOLIO_QUOTES: {
      return {
        ...state,
        quotes: action.quotes,
      };
    }

    case ADD_PORTFOLIO_RECORD: {
      return {
        ...state,
        openModalWithSymbol: action.symbol,
      };
    }

    case ADD_SYMBOL_RECORD: {
      const newPortfolio = cloneDeep(state.data);
      let { unitPrice, fees, quantity } = action.record;
      const { symbol, buy, date } = action.record;
      unitPrice = parseFloat(unitPrice);
      fees = parseFloat(fees);
      quantity = parseFloat(quantity);

      let object = newPortfolio[symbol];
      if (!object) {
        object = {};
        object.symbol = symbol;
        object.records = [];
        newPortfolio[symbol] = object;
      }
      const total = (unitPrice * quantity + fees).toFixed(2);
      const transaction = {
        action: 'add',
        symbol,
        buy,
        quantity,
        unitPrice,
        fees,
        total,
        date,
      };
      object.records.push(transaction);

      savePortfolio(newPortfolio, transaction);
      return {
        ...state,
        data: newPortfolio,
      };
    }

    case REMOVE_SYMBOL_RECORD: {
      const newPortfolio = cloneDeep(state.data);
      const object = newPortfolio[action.record.symbol];
      object.records = [
        ...object.records.slice(0, action.record.index),
        ...object.records.slice(action.record.index + 1),
      ];
      if (object.records.length === 0) {
        delete newPortfolio[action.record.symbol];
      }
      const transaction = {
        action: 'delete',
        symbol: action.record.symbol,
      };
      savePortfolio(newPortfolio, transaction);
      return {
        ...state,
        data: newPortfolio,
      };
    }

    default:
      return state;
  }
};

export default portfolio;