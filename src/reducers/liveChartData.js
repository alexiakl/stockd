import { SET_LIVE_CHART_DATA } from '../actions/liveChartData';

const liveChartData = (state = [], action) => {
  switch (action.type) {
    case SET_LIVE_CHART_DATA: {
      return {
        ...state,
        data: action.data,
      };
    }
    default:
      return state;
  }
};

export default liveChartData;
