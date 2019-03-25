import { cloneDeep } from 'lodash';
import { savePortfolio } from '../utils/utils';
import {
  ADD_PORTFOLIO_RECORD,
  ADD_SYMBOL_RECORD,
  UPDATE_SYMBOL_RECORD,
  REMOVE_SYMBOL_RECORD,
  PORTFOLIO_QUOTES,
  SET_PORTFOLIO,
  SET_ACTIVE_PORTFOLIO,
} from '../actions/portfolio';
import { PORTFOLIO } from '../constants';

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
        fees,
        quantity,
        squantity,
        sfees,
        sunitPrice,
      } = action.record;
      const { symbol, buy, date, sdate } = action.record;
      unitPrice = parseFloat(unitPrice);
      fees = parseFloat(fees);
      quantity = parseFloat(quantity);
      sunitPrice = parseFloat(sunitPrice);
      sfees = parseFloat(sfees);
      squantity = parseFloat(squantity);

      let object = newPortfolio[activePortfolio].portfolio[symbol];
      if (!object) {
        object = {};
        object.symbol = symbol;
        object.records = [];
        newPortfolio[activePortfolio].portfolio[symbol] = object;
      }
      const total = (unitPrice * quantity + fees).toFixed(2);
      const stotal = (sunitPrice * squantity + sfees).toFixed(2);
      const transaction = {
        action: 'add',
        symbol,
        buy,
        quantity,
        squantity,
        unitPrice,
        sunitPrice,
        fees,
        sfees,
        total,
        stotal,
        date,
        sdate,
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
        delete newPortfolio[activePortfolio][action.record.symbol];
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
