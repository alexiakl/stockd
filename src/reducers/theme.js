import { cloneDeep } from 'lodash';
import { SET_THEME } from '../actions/theme';

const theme = (state = [], action) => {
  switch (action.type) {
    case SET_THEME: {
      let newstate = cloneDeep(state);
      newstate = action.theme;
      return newstate;
    }
    default:
      return state;
  }
};

export default theme;
