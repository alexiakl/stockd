export const ADD_PORTFOLIO_RECORD = 'ADD_PORTFOLIO_RECORD';
export const ADD_SYMBOL_RECORD = 'ADD_SYMBOL_RECORD';
export const UPDATE_SYMBOL_RECORD = 'UPDATE_SYMBOL_RECORD';
export const REMOVE_SYMBOL_RECORD = 'REMOVE_SYMBOL_RECORD';
export const PORTFOLIO_QUOTES = 'PORTFOLIO_QUOTES';
export const SET_PORTFOLIO = 'SET_PORTFOLIO';
export const SET_ACTIVE_PORTFOLIO = 'SET_ACTIVE_PORTFOLIO';

export function setPortfolio(portfolio) {
  return { type: SET_PORTFOLIO, portfolio };
}

export function setActivePortfolio(activePortfolio) {
  return { type: SET_ACTIVE_PORTFOLIO, activePortfolio };
}

export function addPortfolioRecord(symbol) {
  return { type: ADD_PORTFOLIO_RECORD, symbol };
}

export function addSymbolRecord(record) {
  return { type: ADD_SYMBOL_RECORD, record };
}

export function updateSymbolRecord(record) {
  return { type: UPDATE_SYMBOL_RECORD, record };
}

export function removeSymbolRecord(record) {
  return { type: REMOVE_SYMBOL_RECORD, record };
}

export function setPortfolioQuotes(quotes) {
  return { type: PORTFOLIO_QUOTES, quotes };
}
