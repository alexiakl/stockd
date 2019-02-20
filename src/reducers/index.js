import { combineReducers } from 'redux';
import symbolsPicker from './symbolsPicker';
import marketState from './marketState';
import periodController from './periodController';
import chartData from './chartData';
import liveChartData from './liveChartData';

export default combineReducers({
  symbolsPicker,
  marketState,
  periodController,
  chartData,
  liveChartData,
});
