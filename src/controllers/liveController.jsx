import axios from 'axios';
import { IEXAPI, IEXTOKEN, OPEN, PRE_OPEN } from '../constants';
import { setIsFetchingData, setTimerId } from '../actions/appStatus';
import {
  setQueryResult,
  setSymbolsData,
  fireTimer,
} from '../actions/symbolsData';
import { options } from '../utils/chartVars';
import { getMarketState, log } from '../utils/utils';

const resetTimer = timerId => {
  if (timerId) {
    clearInterval(timerId);
  }
};

const calibrateTimer = (props, fire = true) => {
  const { timerId, timerInterval, dispatch } = props;
  if (timerId) {
    clearInterval(timerId);
  }
  const newTimerId = setInterval(() => dispatch(fireTimer()), timerInterval);
  if (fire) {
    dispatch(fireTimer());
  }
  log(`Timer: ${timerInterval}`);
  dispatch(setTimerId(newTimerId));
};

const runQuery = props => {
  const { symbols, period, dispatch } = props;
  if (symbols && symbols.length > 0) {
    const allsymbols = symbols.join(',');
    const url = `${IEXAPI}stock/market/batch?symbols=${allsymbols}&types=quote,chart&range=${period}${IEXTOKEN}`;
    log(`IEX: Live ${url}`);

    dispatch(setIsFetchingData(true));

    axios
      .get(url)
      .then(res => {
        dispatch(setIsFetchingData(false));
        dispatch(setQueryResult(res));
      })
      .catch(() => {
        dispatch(setIsFetchingData(false));
      });
  }
};

const processResult = props => {
  const { symbols, period, theme, queryResult, dispatch } = props;
  if (
    Object.entries(queryResult).length === 0 &&
    queryResult.constructor === Object
  ) {
    return;
  }
  const data = {
    symbols: [],
    labels: [],
    datasets: [],
    info: [],
    annotations: [],
    options,
  };

  symbols.forEach(symbol => {
    data.symbols.push(symbol);
    const { chart, quote } = queryResult.data[symbol];
    const { previousClose, latestPrice, latestSource } = quote;
    const dataset = {
      label: symbol,
      type: 'line',
      data: [],
      fill: false,
      yAxisID: 'y-axis-1',
    };
    const marketState = getMarketState(latestSource);
    let previousValue = 0;
    let latestValue = 0;
    let skip = 0;
    if (chart.length > 50) {
      skip = parseInt(chart.length / 50, 10);
    }
    if (!data.labels[symbol]) {
      data.labels[symbol] = [];
    }
    chart.forEach((entry, entryindex) => {
      let value = 0;
      if (entry.close > 0) {
        previousValue = entry.close;
        value = previousValue;
      } else if (entry.marketClose > 0) {
        previousValue = entry.marketClose;
        value = previousValue;
      } else {
        value = previousValue;
      }
      if (
        skip === 0 ||
        entryindex % skip === 0 ||
        entryindex === chart.length - 1
      ) {
        if (value) {
          dataset.data.push(value.toFixed(3));
          data.labels[symbol].push(entry.label);
        }
        if (entryindex === chart.length - 1) {
          value = latestPrice;
          if (marketState === OPEN) {
            latestValue = value;
            dataset.data.push(value.toFixed(3));
            if (period === '1d') {
              data.labels[symbol].push(entry.label);
            } else {
              data.labels[symbol].push('Today');
            }
          }
        }
      }
    });

    if (marketState === PRE_OPEN && period === '1d') {
      const dupLabels = data.labels[symbol];
      if (dupLabels && dupLabels.length > 0) {
        dupLabels.forEach(() => {
          data.labels[symbol].push('.');
        });
      }
    }

    data.datasets[symbol] = dataset;

    data.options.scales.yAxes[0].gridLines.color = '';
    if (theme === 'dark-mode') {
      data.options.scales.yAxes[0].gridLines.color = '#555';
    }
    data.options.scales.yAxes[0].ticks.callback = value => {
      return `$${value}`;
    };

    data.info[symbol] = {
      marketState,
      quote,
      latestValue,
    };

    if (period === '1d') {
      data.annotations[symbol] = {
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-1',
            value: previousClose,
            borderColor: '#888',
            borderWidth: 2,
            label: {
              enabled: true,
              content: previousClose,
              fontSize: 8,
              backgroundColor: 'rgba(0,0,0,0.6)',
            },
          },
        ],
      };
    }
  });

  data.options.tooltips.callbacks = {
    label(tooltipItem, cdata) {
      let { label } = cdata.datasets[tooltipItem.datasetIndex];
      label += `: ${tooltipItem.yLabel}$`;
      return label;
    },
  };

  dispatch(setSymbolsData(data));
};

export { runQuery, processResult, resetTimer, calibrateTimer };
