import { cloneDeep } from 'lodash';
import { SET_THEME } from '../actions/theme';
import { THEME } from '../constants';

const theme = (state = [], action) => {
  switch (action.type) {
    case SET_THEME: {
      let newstate = cloneDeep(state);
      localStorage.setItem(THEME, action.theme);
      newstate = action.theme;
      return newstate;
    }
    default:
      return state;
  }
};

export default theme;
