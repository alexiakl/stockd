export const ADD_PORTFOLIO_RECORD = 'ADD_PORTFOLIO_RECORD';
export const ADD_SYMBOL_RECORD = 'ADD_SYMBOL_RECORD';
export const REMOVE_SYMBOL_RECORD = 'REMOVE_SYMBOL_RECORD';
export const SET_QUANTITY = 'SET_QUANTITY';
export const SET_FEES = 'SET_FEES';
export const SET_UNIT_PRICE = 'SET_UNIT_PRICE';
export const SET_BUY = 'SET_BUY';
export const PORTFOLIO_QUOTES = 'PORTFOLIO_QUOTES';

export function addPortfolioRecord(symbol) {
  return { type: ADD_PORTFOLIO_RECORD, symbol };
}

export function addSymbolRecord(symbol) {
  return { type: ADD_SYMBOL_RECORD, symbol };
}

export function removeSymbolRecord(record) {
  return { type: REMOVE_SYMBOL_RECORD, record };
}

export function setQuantity(record) {
  return { type: SET_QUANTITY, record };
}

export function setUnitPrice(record) {
  return { type: SET_UNIT_PRICE, record };
}

export function setFees(record) {
  return { type: SET_FEES, record };
}

export function setBuy(record) {
  return { type: SET_BUY, record };
}

export function setPortfolioQuotes(quotes) {
  return { type: PORTFOLIO_QUOTES, quotes };
}
