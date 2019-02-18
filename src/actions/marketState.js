export const SET_MARKET_OPEN = 'SET_MARKET_OPEN';

export function setMarketOpen(isMarketOpen) {
  return { type: SET_MARKET_OPEN, isMarketOpen };
}
