import { cloneDeep } from 'lodash';
import { savePortfolio } from '../controllers/portfolioController';
import {
  ADD_PORTFOLIO_RECORD,
  ADD_SYMBOL_RECORD,
  UPDATE_SYMBOL_RECORD,
  REMOVE_SYMBOL_RECORD,
  PORTFOLIO_QUOTES,
  SET_PORTFOLIO,
  SET_PORTFOLIO_DATA,
  SET_ACTIVE_PORTFOLIO,
} from '../actions/portfolio';
import { PORTFOLIO } from '../constants';

const portfolio = (state = [], action) => {
  switch (action.type) {
    case PORTFOLIO_QUOTES: {
      const newQuotes = cloneDeep(state.quotes);
      Object.keys(action.quotes).forEach(symbol => {
        newQuotes[symbol] = action.quotes[symbol];
      });
      return {
        ...state,
        quotes: newQuotes,
      };
    }

    case ADD_PORTFOLIO_RECORD: {
      return {
        ...state,
        openModalWithSymbol: action.symbol,
      };
    }

    case SET_PORTFOLIO: {
      const map = action.portfolio.map(element => {
        element.portfolio = JSON.parse(element.portfolio);
        return element;
      });
      return {
        ...state,
        data: map,
      };
    }

    case SET_PORTFOLIO_DATA: {
      localStorage.setItem(PORTFOLIO, JSON.stringify(action.data));
      return {
        ...state,
        data: action.data,
      };
    }

    case SET_ACTIVE_PORTFOLIO: {
      return {
        ...state,
        activePortfolio: action.activePortfolio,
      };
    }

    case ADD_SYMBOL_RECORD: {
      const newPortfolio = cloneDeep(state.data);
      const { activePortfolio } = state;
      let {
        unitPrice,
        originalUnitPrice,
        quantity,
        squantity,
        sunitPrice,
        fees,
      } = action.record;
      const { symbol, buy, date, sdate } = action.record;
      unitPrice = parseFloat(unitPrice);
      originalUnitPrice = parseFloat(originalUnitPrice);
      quantity = parseFloat(quantity);
      sunitPrice = parseFloat(sunitPrice);
      squantity = parseFloat(squantity);
      fees = parseFloat(fees);

      let object = newPortfolio[activePortfolio].portfolio[symbol];
      if (!object) {
        object = {};
        object.symbol = symbol;
        object.records = [];
        newPortfolio[activePortfolio].portfolio[symbol] = object;
      }
      const total = (unitPrice * quantity).toFixed(2);
      const stotal = (sunitPrice * squantity).toFixed(2);
      const transaction = {
        action: 'add',
        symbol,
        buy,
        quantity,
        squantity,
        unitPrice,
        sunitPrice,
        originalUnitPrice,
        total,
        stotal,
        date,
        sdate,
        fees,
      };
      object.records.push(transaction);

      savePortfolio(newPortfolio, activePortfolio);
      return {
        ...state,
        data: newPortfolio,
      };
    }

    case REMOVE_SYMBOL_RECORD: {
      const newPortfolio = cloneDeep(state.data);
      const { activePortfolio } = state;
      const object =
        newPortfolio[activePortfolio].portfolio[action.record.symbol];
      object.records = [
        ...object.records.slice(0, action.record.index),
        ...object.records.slice(action.record.index + 1),
      ];
      if (object.records.length === 0) {
        delete newPortfolio[activePortfolio].portfolio[action.record.symbol];
      }
      savePortfolio(newPortfolio, activePortfolio);
      return {
        ...state,
        data: newPortfolio,
      };
    }

    case UPDATE_SYMBOL_RECORD: {
      const newPortfolio = cloneDeep(state.data);
      const { activePortfolio } = state;
      const object =
        newPortfolio[activePortfolio].portfolio[action.record.symbol];
      object.records[action.record.index].quantity = action.record.quantity;
      if (object.records[action.record.index].quantity === 0) {
        object.records = [
          ...object.records.slice(0, action.record.index),
          ...object.records.slice(action.record.index + 1),
        ];
      }
      localStorage.setItem(PORTFOLIO, JSON.stringify(newPortfolio));
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
