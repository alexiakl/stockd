export const SET_SYMBOLS_DATA = 'SET_SYMBOLS_DATA';
export const SET_QUERY_RESULT = 'SET_QUERY_RESULT';

export function setSymbolsData(data) {
  return { type: SET_SYMBOLS_DATA, data };
}

export function setQueryResult(queryResult) {
  return { type: SET_QUERY_RESULT, queryResult };
}
