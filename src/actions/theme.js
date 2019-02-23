export const SET_THEME = 'SET_THEME';

export function setDarkMode(theme) {
  return { type: SET_THEME, theme };
}
