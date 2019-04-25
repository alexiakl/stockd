import { UPDATE_PERIOD } from '../actions/periodController';

const periodController = (state = [], action) => {
  switch (action.type) {
    case UPDATE_PERIOD: {
      return {
        ...state,
        period: action.period,
      };
    }
    default:
      return state;
  }
};

export default periodController;
