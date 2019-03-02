import axios from 'axios';
import { API, TOKEN, OPEN, PRE_OPEN } from '../constants';
import { setIsFetchingData } from '../actions/appStatus';
import { setQueryResult, setSymbolsData } from '../actions/symbolsData';
import { options } from '../utils/chartVars';
import { getMarketState } from '../utils/utils';

let timerId = 0;
let timerInterval = 0;

const getTimerId = () => {
  return timerId;
};

const runQuery = props => {
  const { symbols, period, dispatch } = props;
  if (symbols) {
    const allsymbols = symbols.join(',');
    const url = `${API}stock/market/batch?symbols=${allsymbols}&types=quote,chart&range=${period}${TOKEN}`;
    // eslint-disable-next-line no-console
    console.log(`RQ: Live ${url}`);

    dispatch(setIsFetchingData(true));
    const start = Date.now();

    axios
      .get(url)
      .then(res => {
        const end = Date.now();
        const elapsed = end - start;
        console.log(elapsed);
        dispatch(setIsFetchingData(false));
        dispatch(setQueryResult(res));
      })
      .catch(error => {
        dispatch(setIsFetchingData(false));
      });
  }
};

const processResult = props => {
  const { symbols, period, theme, queryResult, dispatch } = props;

  let tempTimerInterval = 0;
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
        if (entryindex === chart.length - 1) {
          value = latestPrice;
          if (marketState === OPEN) {
            latestValue = value;
            tempTimerInterval = 300000; // 5 minutes
          }
        }
        dataset.data.push(value.toFixed(3));
        data.labels[symbol].push(entry.label);
      }
    });

    if (marketState === PRE_OPEN && period === '1d') {
      if (tempTimerInterval === 0) {
        tempTimerInterval = 600000; // 10 minutes
      }
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

  const defaultIntervalTemp = 900000; // 15 mins
  if (timerInterval === 0 || timerInterval !== tempTimerInterval) {
    timerInterval = defaultIntervalTemp;
    if (tempTimerInterval > 0) {
      timerInterval = tempTimerInterval;
    }
    if (timerId) {
      clearInterval(timerId);
    }
    console.log(`Timer set: ${timerInterval}`);
    timerId = setInterval(() => this.runQuery(), timerInterval);
  }

  dispatch(setSymbolsData(data));
};

export { runQuery, processResult, getTimerId };
