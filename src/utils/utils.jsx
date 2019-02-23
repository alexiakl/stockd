import { OPEN, CLOSED, PRE_OPEN, UNDEFINED } from '../constants';

const getMarketStateDescription = value => {
  let marketStateSentence = '';
  switch (value) {
    case PRE_OPEN:
      marketStateSentence = ' - will open soon';
      break;
    case OPEN:
      marketStateSentence = ' - active';
      break;
    case CLOSED:
      marketStateSentence = ' - closed';
      break;

    default:
      break;
  }
  return marketStateSentence;
};

const getMarketState = value => {
  let marketState = UNDEFINED;
  if (value.includes('real time')) {
    marketState = OPEN;
  } else if (value === 'Close') {
    marketState = CLOSED;
  } else {
    marketState = PRE_OPEN;
  }
  return marketState;
};

export { getMarketStateDescription, getMarketState };
