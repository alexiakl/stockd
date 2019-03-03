export const ADD_SYMBOL = 'ADD_SYMBOL';
export const REMOVE_SYMBOL = 'REMOVE_SYMBOL';
export const FILTER_SYMBOLS = 'FILTER_SYMBOLS';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const SET_MAP = 'SET_MAP';

export function addSymbol(symbol) {
  return { type: ADD_SYMBOL, symbol };
}

export function removeSymbol(symbol) {
  return { type: REMOVE_SYMBOL, symbol };
}

export function filterSymbols(symbol) {
  return { type: FILTER_SYMBOLS, symbol };
}

export function updateOrder(symbols) {
  return { type: UPDATE_ORDER, symbols };
}

export function setMap(map) {
  return { type: SET_MAP, map };
}
