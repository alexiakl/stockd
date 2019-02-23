import { combineReducers } from 'redux';
import symbolsPicker from './symbolsPicker';
import symbolsData from './symbolsData';
import periodController from './periodController';

export default combineReducers({
  symbolsPicker,
  symbolsData,
  periodController,
});
