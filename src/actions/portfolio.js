export const ADD_PORTFOLIO_RECORD = 'ADD_PORTFOLIO_RECORD';
export const ADD_SYMBOL_RECORD = 'ADD_SYMBOL_RECORD';
export const REMOVE_SYMBOL_RECORD = 'REMOVE_SYMBOL_RECORD';
export const PORTFOLIO_QUOTES = 'PORTFOLIO_QUOTES';

export function addPortfolioRecord(symbol) {
  return { type: ADD_PORTFOLIO_RECORD, symbol };
}

export function addSymbolRecord(record) {
  return { type: ADD_SYMBOL_RECORD, record };
}

export function removeSymbolRecord(record) {
  return { type: REMOVE_SYMBOL_RECORD, record };
}

export function setPortfolioQuotes(quotes) {
  return { type: PORTFOLIO_QUOTES, quotes };
}
