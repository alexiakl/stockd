import axios from 'axios';
import { toast } from 'react-toastify';
import {
  OPEN,
  CLOSED,
  PRE_OPEN,
  UNDEFINED,
  PORTFOLIO,
  API,
  TOKEN,
} from '../constants';
import { setLoggedin } from '../actions/appStatus';
import { setPortfolio } from '../actions/portfolio';

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

const savePortfolio = (portfolio, online = true) => {
  const portfolioString = JSON.stringify(portfolio);
  localStorage.setItem(PORTFOLIO, portfolioString);

  const url = `${API}user/portfolio`;
  const token = localStorage.getItem(TOKEN);
  if (!token || !online) {
    return;
  }
  const AuthStr = `Bearer ${token}`;

  axios
    .put(
      url,
      {
        portfolio: portfolioString,
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

const getPortfolio = dispatch => {
  const url = `${API}user/portfolio`;
  const token = localStorage.getItem(TOKEN);
  if (!token) {
    return;
  }
  const AuthStr = `Bearer ${token}`;

  axios
    .get(url, {
      headers: {
        Authorization: AuthStr,
      },
    })
    .then(res => {
      if (res.data.success === 1) {
        dispatch(setPortfolio(JSON.parse(res.data.data.portfolio)));
        localStorage.setItem(PORTFOLIO, res.data.data.portfolio);
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

const logoutEverywhere = dispatch => {
  const url = `${API}user/logout`;
  const token = localStorage.getItem(TOKEN);
  if (!token) {
    return;
  }
  const AuthStr = `Bearer ${token}`;

  axios
    .post(
      url,
      {},
      {
        headers: {
          Authorization: AuthStr,
        },
      },
    )
    .then(res => {
      if (res.data.success === 1) {
        localStorage.removeItem(TOKEN);
        dispatch(setLoggedin(false));
      } else {
        toast.warn('Warning: could not log you out everywhere', {
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
      toast.warn('Warning: could not log you out everywhere', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
      });
    });
};

export {
  getMarketStateDescription,
  getMarketState,
  getChartDimensions,
  savePortfolio,
  getPortfolio,
  logoutEverywhere,
};
