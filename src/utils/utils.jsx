import { OPEN, CLOSED, PRE_OPEN, UNDEFINED } from '../constants';

const getMarketStateDescription = (value, quote) => {
  let marketStateSentence = '';
  switch (value) {
    case PRE_OPEN:
      marketStateSentence = ` opening soon, chart: ${quote.latestTime}`;
      break;
    case OPEN:
      marketStateSentence = ` latest: ${quote.latestTime}`;
      break;
    case CLOSED:
      marketStateSentence = ` closed: ${quote.latestTime}`;
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
