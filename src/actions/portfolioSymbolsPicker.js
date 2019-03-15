export const ADD_PORTFOLIO_RECORD = 'ADD_PORTFOLIO_RECORD';
export const REMOVE_PORTFOLIO_RECORD = 'REMOVE_PORTFOLIO_RECORD';
export const ADD_SYMBOL_RECORD = 'ADD_SYMBOL_RECORD';

export function addPortfolioRecord(symbol) {
  return { type: ADD_PORTFOLIO_RECORD, symbol };
}

export function addSymbolRecord(symbol) {
  return { type: ADD_SYMBOL_RECORD, symbol };
}

export function removePortfolioRecord(symbol) {
  return { type: REMOVE_PORTFOLIO_RECORD, symbol };
}
