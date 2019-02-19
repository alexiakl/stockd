import { combineReducers } from 'redux';
import symbolsPicker from './symbolsPicker';
import marketState from './marketState';
import periodController from './periodController';
import chartData from './chartData';

export default combineReducers({
  symbolsPicker,
  marketState,
  periodController,
  chartData,
});
