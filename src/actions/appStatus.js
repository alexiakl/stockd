export const SET_THEME = 'SET_THEME';
export const SET_IS_FETCHING_DATA = 'SET_IS_FETCHING_DATA';
export const SET_LOGGEDIN = 'SET_LOGGEDIN';
export const SET_TIMER_ID = 'SET_TIMER_ID';
export const SET_TIMER_INTERVAL = 'SET_TIMER_INTERVAL';

export function setTheme(theme) {
  return { type: SET_THEME, theme };
}
export function setIsFetchingData(isFetchingData) {
  return { type: SET_IS_FETCHING_DATA, isFetchingData };
}
export function setLoggedin(loggedin) {
  return { type: SET_LOGGEDIN, loggedin };
}
export function setTimerId(timerId) {
  return { type: SET_TIMER_ID, timerId };
}
export function setTimerInterval(timerInterval) {
  return { type: SET_TIMER_INTERVAL, timerInterval };
}
