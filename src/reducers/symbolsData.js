import { SET_SYMBOLS_DATA } from '../actions/symbolsData';

const symbolsData = (state = [], action) => {
  switch (action.type) {
    case SET_SYMBOLS_DATA: {
      return {
        ...state,
        data: action.data,
      };
    }
    default:
      return state;
  }
};

export default symbolsData;
