import { cloneDeep } from 'lodash';
import {
  ADD_PORTFOLIO_RECORD,
  ADD_SYMBOL_RECORD,
  REMOVE_SYMBOL_RECORD,
  SET_FEES,
  SET_QUANTITY,
  SET_UNIT_PRICE,
  SET_BUY,
} from '../actions/portfolioSymbolsPicker';

const portfolioSymbolsPicker = (state = [], action) => {
  switch (action.type) {
    case ADD_PORTFOLIO_RECORD: {
      const record = state.data[action.symbol];
      if (!record) {
        const newPortfolio = cloneDeep(state.data);
        const object = {};
        object.symbol = action.symbol;
        object.records = [];
        object.records.push({
          symbol: action.symbol,
          buy: true,
          quantity: 0,
          unitPrice: 0,
          fees: 0,
          total: 0,
        });
        newPortfolio[action.symbol] = object;
        return {
          ...state,
          data: newPortfolio,
        };
      }
      return state;
    }

    case ADD_SYMBOL_RECORD: {
      const newPortfolio = cloneDeep(state.data);
      const object = newPortfolio[action.symbol];
      object.records.push({
        symbol: action.symbol,
        buy: true,
        quantity: 0,
        unitPrice: 0,
        fees: 0,
        total: 0,
      });

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

      return {
        ...state,
        data: newPortfolio,
      };
    }

    case SET_BUY: {
      const newPortfolio = cloneDeep(state.data);
      const object = newPortfolio[action.record.symbol];
      object.records[action.record.index].buy = action.record.buy;

      return {
        ...state,
        data: newPortfolio,
      };
    }

    case SET_QUANTITY: {
      const newPortfolio = cloneDeep(state.data);
      const object = newPortfolio[action.record.symbol];
      object.records[action.record.index].quantity = action.record.quantity;

      return {
        ...state,
        data: newPortfolio,
      };
    }

    case SET_FEES: {
      const newPortfolio = cloneDeep(state.data);
      const object = newPortfolio[action.record.symbol];
      object.records[action.record.index].fees = action.record.fees;

      return {
        ...state,
        data: newPortfolio,
      };
    }

    case SET_UNIT_PRICE: {
      const newPortfolio = cloneDeep(state.data);
      const object = newPortfolio[action.record.symbol];
      object.records[action.record.index].unitPrice = action.record.unitPrice;

      return {
        ...state,
        data: newPortfolio,
      };
    }

    default:
      return state;
  }
};

export default portfolioSymbolsPicker;
