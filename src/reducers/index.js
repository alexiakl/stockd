import { combineReducers } from 'redux';
import symbolsPicker from './symbolsPicker';
import marketState from './marketState';

export default combineReducers({
  symbolsPicker,
  marketState,
});
