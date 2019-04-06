import axios from 'axios';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash';
import { setIsFetchingData, setLoggedin } from '../actions/appStatus';
import {
  setPortfolioQuotes,
  setPortfolio,
  setPortfolioData,
} from '../actions/portfolio';
import { PORTFOLIO, API, TOKEN, IEXAPI } from '../constants';
import { log } from '../utils/utils';

const runQuery = (symbols, dispatch) => {
  if (symbols && symbols.length > 0) {
    const allsymbols = encodeURIComponent(symbols.join(','));
    const url = `${IEXAPI}stock/market/batch?symbols=${allsymbols}&types=quote`;
    log(`IEX: Portfolio ${url}`);

    dispatch(setIsFetchingData(true));

    axios
      .get(url)
      .then(res => {
        dispatch(setIsFetchingData(false));
        dispatch(setPortfolioQuotes(res.data));
      })
      .catch(() => {
        dispatch(setIsFetchingData(false));
      });
  }
};

const getPortfolio = dispatch => {
  const url = `${API}user/portfolio`;
  const token = localStorage.getItem(TOKEN);
  if (!token) {
    return;
  }
  const AuthStr = `Bearer ${token}`;

  log(`STOCKD: Get Portfolio ${url}`);
  axios
    .get(url, {
      headers: {
        Authorization: AuthStr,
      },
    })
    .then(res => {
      if (res.data.success === 1) {
        dispatch(setPortfolio(res.data.data));
        localStorage.setItem(PORTFOLIO, JSON.stringify(res.data.data));
      } else {
        toast.warn('Could not get portfolio', {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        });
        if (res.data.data && res.data.data.logout) {
          localStorage.removeItem(TOKEN);
          dispatch(setLoggedin(false));
        }
      }
    })
    .catch(() => {
      toast.warn('Warning: could not get portfolio', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
      });
    });
};

const addPortfolio = (name, dispatch) => {
  const url = `${API}user/portfolio`;
  const token = localStorage.getItem(TOKEN);
  if (!token) {
    return;
  }
  log(`STOCKD: Add portfolio ${url}`);
  const AuthStr = `Bearer ${token}`;
  axios
    .post(
      url,
      { name },
      {
        headers: {
          Authorization: AuthStr,
        },
      },
    )
    .then(res => {
      if (res.data.success === 1) {
        getPortfolio(dispatch);
      } else {
        toast.warn('Could not add portfolio', {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        });
        if (res.data.data && res.data.data.logout) {
          localStorage.removeItem(TOKEN);
          dispatch(setLoggedin(false));
        }
      }
    })
    .catch(() => {
      toast.warn('Could not add portfolio', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
      });
    });
};

const deletePortfolio = (data, activePortfolio, dispatch) => {
  const url = `${API}user/portfolio/delete`;
  const token = localStorage.getItem(TOKEN);
  if (!token) {
    return;
  }

  log(`STOCKD: Delete Portfolio ${url}`);
  const { id } = data[activePortfolio];
  const AuthStr = `Bearer ${token}`;
  axios
    .put(
      url,
      {
        id,
      },
      {
        headers: {
          Authorization: AuthStr,
        },
      },
    )
    .then(res => {
      if (res.data.success === 1) {
        const newData = [
          ...data.slice(0, activePortfolio),
          ...data.slice(activePortfolio + 1),
        ];
        dispatch(setPortfolioData(newData));
      } else {
        toast.warn('Could not delete portfolio', {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        });
        if (res.data.data && res.data.data.logout) {
          localStorage.removeItem(TOKEN);
          dispatch(setLoggedin(false));
        }
      }
    })
    .catch(() => {
      toast.warn('Could not delete portfolio', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
      });
    });
};

const updatePortfolioName = (data, activePortfolio, name, dispatch) => {
  const url = `${API}user/portfolio/name`;
  const token = localStorage.getItem(TOKEN);
  if (!token) {
    return;
  }

  log(`STOCKD: Update Portfolio Name ${url}`);
  const { id } = data[activePortfolio];
  const AuthStr = `Bearer ${token}`;
  axios
    .put(
      url,
      {
        name,
        id,
      },
      {
        headers: {
          Authorization: AuthStr,
        },
      },
    )
    .then(res => {
      if (res.data.success === 1) {
        const newData = cloneDeep(data);
        newData[activePortfolio].name = name;
        dispatch(setPortfolioData(newData));
      } else {
        toast.warn('Could not save portfolio', {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        });
        if (res.data.data && res.data.data.logout) {
          localStorage.removeItem(TOKEN);
          dispatch(setLoggedin(false));
        }
      }
    })
    .catch(() => {
      toast.warn('Could not save portfolio', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
      });
    });
};

const savePortfolio = (portfolio, activePortfolio) => {
  localStorage.setItem(PORTFOLIO, JSON.stringify(portfolio));

  const url = `${API}user/portfolio`;
  const token = localStorage.getItem(TOKEN);
  if (!token) {
    return;
  }

  log(`STOCKD: Save Portfolio ${url}`);
  const AuthStr = `Bearer ${token}`;
  axios
    .put(
      url,
      {
        portfolio: JSON.stringify(portfolio[activePortfolio].portfolio),
        id: portfolio[activePortfolio].id,
      },
      {
        headers: {
          Authorization: AuthStr,
        },
      },
    )
    .then(res => {
      if (res.data.success !== 1) {
        toast.warn('Could not save portfolio', {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        });
      }
    })
    .catch(() => {
      toast.warn('Could not save portfolio', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
      });
    });
};

const calculatePortfolioQuotes = (data, quotes, activePortfolio) => {
  const activetotals = [];
  const activetotalspercentage = [];
  const activequantities = [];
  const activeunitPrices = [];
  const activeprofits = [];
  const activeprofitspercentage = [];
  let activetotal = 0;
  let activetotalpercentage = 0;
  const soldtotals = [];
  const soldtotalspercentage = [];
  const soldquantities = [];
  const soldunitPrices = [];
  const soldprofits = [];
  const soldprofitspercentage = [];
  let soldtotal = 0;
  let soldtotalpercentage = 0;
  if (data && data.length > 0 && data[activePortfolio]) {
    Object.keys(data[activePortfolio].portfolio).forEach(symbol => {
      activeprofits[symbol] = [];
      activeprofitspercentage[symbol] = [];
      soldprofits[symbol] = [];
      soldprofitspercentage[symbol] = [];
      const item = data[activePortfolio].portfolio[symbol];
      let activesymbolbuy = 0;
      let activesymbolsell = 0;
      let activesymbolquantity = 0;
      let soldsymbolbuy = 0;
      let soldsymbolsell = 0;
      let soldsymbolquantity = 0;
      if (item.records) {
        item.records.forEach((record, index) => {
          if (quotes && quotes[symbol]) {
            if (!record.buy) {
              const transactionbuy = record.squantity * record.unitPrice;
              const transactionsell =
                record.squantity * record.sunitPrice - record.fees;
              soldprofits[symbol][index] = (
                transactionsell - transactionbuy
              ).toFixed(2);
              soldprofitspercentage[symbol][index] = (
                (100 * (transactionsell - transactionbuy)) /
                transactionbuy
              ).toFixed(2);
              soldsymbolquantity += record.squantity;
              soldsymbolbuy += transactionbuy;
              soldsymbolsell += transactionsell;
            } else {
              const feesPerShare = Math.abs(
                record.originalUnitPrice - record.unitPrice,
              );
              const transactionbuy = record.quantity * record.unitPrice;
              const transactionsell =
                record.quantity *
                (quotes[symbol].quote.latestPrice - feesPerShare);
              activesymbolquantity += record.quantity;
              activeprofits[symbol][index] = (
                transactionsell - transactionbuy
              ).toFixed(2);
              activeprofitspercentage[symbol][index] = (
                (100 * (transactionsell - transactionbuy)) /
                transactionbuy
              ).toFixed(2);
              activesymbolbuy += transactionbuy;
              activesymbolsell += transactionsell;
            }
          }
        });
        activetotals[symbol] = (activesymbolsell - activesymbolbuy).toFixed(2);
        activetotalspercentage[symbol] = (
          (100 * (activesymbolsell - activesymbolbuy)) /
          activesymbolbuy
        ).toFixed(2);
        activequantities[symbol] = activesymbolquantity;
        activeunitPrices[symbol] = (
          activesymbolbuy / activesymbolquantity
        ).toFixed(2);
        activetotal += parseFloat(
          (activesymbolsell - activesymbolbuy).toFixed(2),
        );
        activetotalpercentage += parseFloat(
          (
            (100 * (activesymbolsell - activesymbolbuy)) /
            activesymbolbuy
          ).toFixed(2),
        );

        soldtotals[symbol] = (soldsymbolsell - soldsymbolbuy).toFixed(2);
        soldtotalspercentage[symbol] = (
          (100 * (soldsymbolsell - soldsymbolbuy)) /
          soldsymbolbuy
        ).toFixed(2);
        soldquantities[symbol] = soldsymbolquantity;
        soldunitPrices[symbol] = (soldsymbolsell / soldsymbolquantity).toFixed(
          2,
        );
        soldtotal += parseFloat((soldsymbolsell - soldsymbolbuy).toFixed(2));
        soldtotalpercentage += parseFloat(
          ((100 * (soldsymbolsell - soldsymbolbuy)) / soldsymbolbuy).toFixed(2),
        );
      }
    });
  }

  return {
    active: {
      total: activetotal,
      totalPercentage: activetotalpercentage,
      totals: activetotals,
      totalsPercentage: activetotalspercentage,
      profits: activeprofits,
      profitsPercentage: activeprofitspercentage,
      quantities: activequantities,
      unitPrices: activeunitPrices,
    },
    sold: {
      total: soldtotal,
      totalPercentage: soldtotalpercentage,
      totals: soldtotals,
      totalsPercentage: soldtotalspercentage,
      profits: soldprofits,
      profitsPercentage: soldprofitspercentage,
      quantities: soldquantities,
      unitPrices: soldunitPrices,
    },
  };
};

export {
  runQuery,
  savePortfolio,
  updatePortfolioName,
  deletePortfolio,
  addPortfolio,
  getPortfolio,
  calculatePortfolioQuotes,
};
