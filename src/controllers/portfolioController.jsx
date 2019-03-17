import axios from 'axios';
import { IEXAPI } from '../constants';
import { setIsFetchingData } from '../actions/appStatus';
import { setPortfolioQuotes } from '../actions/portfolio';

const runQuery = (symbols, dispatch) => {
  if (symbols && symbols.length > 0) {
    const allsymbols = symbols.join(',');
    const url = `${IEXAPI}stock/market/batch?symbols=${allsymbols}&types=quote`;
    // eslint-disable-next-line no-console
    console.log(`RQ: Live ${url}`);

    dispatch(setIsFetchingData(true));

    axios
      .get(url)
      .then(res => {
        dispatch(setIsFetchingData(false));
        dispatch(setPortfolioQuotes(res));
      })
      .catch(() => {
        dispatch(setIsFetchingData(false));
      });
  }
};

export default runQuery;
