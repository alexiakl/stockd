import { SET_THEME } from '../actions/theme';

const theme = (state = [], action) => {
  switch (action.type) {
    case SET_THEME: {
      return {
        ...state,
        theme: action.theme,
      };
    }
    default:
      return state;
  }
};

export default theme;
