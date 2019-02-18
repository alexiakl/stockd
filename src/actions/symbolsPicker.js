export const ADD_SYMBOL = 'ADD_SYMBOL';
export const REMOVE_SYMBOL = 'REMOVE_SYMBOL';
export const FILTER_SYMBOLS = 'FILTER_SYMBOLS';

export function addSymbol(symbol) {
  return { type: ADD_SYMBOL, symbol };
}

export function removeSymbol(symbol) {
  return { type: REMOVE_SYMBOL, symbol };
}

export function filterSymbols(filtered) {
  return { type: FILTER_SYMBOLS, filtered };
}
