import { SET_COMPARE_DATA } from '../actions/compareData';

const compareData = (state = [], action) => {
  switch (action.type) {
    case SET_COMPARE_DATA: {
      return {
        ...state,
        data: action.data,
      };
    }
    default:
      return state;
  }
};

export default compareData;
