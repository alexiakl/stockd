export const SET_THEME = 'SET_THEME';
export const SET_IS_FETCHING_DATA = 'SET_IS_FETCHING_DATA';

export function setTheme(theme) {
  return { type: SET_THEME, theme };
}
export function setIsFetchingData(isFetchingData) {
  return { type: SET_IS_FETCHING_DATA, isFetchingData };
}
