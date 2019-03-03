import { OPEN, CLOSED, PRE_OPEN, UNDEFINED } from '../constants';

const getMarketStateDescription = (value, quote) => {
  let marketStateSentence = '';
  let time = quote.latestTime;
  const splittedTime = time.split(':');
  if (splittedTime.length === 3) {
    let suffix = '';
    if (time.toUpperCase().includes('AM')) {
      suffix = 'AM';
    } else if (time.toUpperCase().includes('PM')) {
      suffix = 'PM';
    }
    time = `${splittedTime[0]}:${splittedTime[1]}${suffix}`;
  }
  switch (value) {
    case PRE_OPEN:
      marketStateSentence = ` opening soon ${time}`;
      break;
    case OPEN:
      marketStateSentence = ` latest: ${time}`;
      break;
    case CLOSED:
      marketStateSentence = ` closed: ${time}`;
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

const getChartDimensions = value => {
  const width = (90 * value) / 100;
  const height = (80 * width) / 100;
  return [width, height];
};

export { getMarketStateDescription, getMarketState, getChartDimensions };
