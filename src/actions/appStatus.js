export const SET_THEME = 'SET_THEME';
export const SET_IS_FETCHING_DATA = 'SET_IS_FETCHING_DATA';
export const SET_LOGGEDIN = 'SET_LOGGEDIN';

export function setTheme(theme) {
  return { type: SET_THEME, theme };
}
export function setIsFetchingData(isFetchingData) {
  return { type: SET_IS_FETCHING_DATA, isFetchingData };
}
export function setLoggedin(loggedin) {
  return { type: SET_LOGGEDIN, loggedin };
}
