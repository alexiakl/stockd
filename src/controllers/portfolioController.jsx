import axios from 'axios';
import { toast } from 'react-toastify';
import { setIsFetchingData, setLoggedin } from '../actions/appStatus';
import { setPortfolioQuotes, setPortfolio } from '../actions/portfolio';
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
        dispatch(setPortfolioQuotes(res));
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

const deletePortfolio = (id, dispatch) => {
  const url = `${API}user/portfolio/delete`;
  const token = localStorage.getItem(TOKEN);
  if (!token) {
    return;
  }

  log(`STOCKD: Delete Portfolio ${url}`);
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

const updatePortfolioName = (id, name, dispatch) => {
  const url = `${API}user/portfolio/name`;
  const token = localStorage.getItem(TOKEN);
  if (!token) {
    return;
  }

  log(`STOCKD: Update Portfolio Name ${url}`);
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

export {
  runQuery,
  savePortfolio,
  updatePortfolioName,
  deletePortfolio,
  addPortfolio,
  getPortfolio,
};
