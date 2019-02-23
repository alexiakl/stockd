import { combineReducers } from 'redux';
import symbolsPicker from './symbolsPicker';
import symbolsData from './symbolsData';
import periodController from './periodController';
import theme from './theme';

export default combineReducers({
  symbolsPicker,
  symbolsData,
  periodController,
  theme,
});
