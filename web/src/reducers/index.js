import { combineReducers } from 'redux';
import symbolsPicker from './symbolsPicker';
import portfolio from './portfolio';
import symbolsData from './symbolsData';
import compareData from './compareData';
import periodController from './periodController';
import appStatus from './appStatus';

export default combineReducers({
  symbolsPicker,
  portfolio,
  symbolsData,
  periodController,
  appStatus,
  compareData,
});
