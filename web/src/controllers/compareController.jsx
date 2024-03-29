import { setCompareData } from '../actions/compareData';
import { options } from '../utils/chartVars';
import { getRandomColor } from '../utils/color';
import { getMarketState } from '../utils/utils';
import { OPEN } from '../constants';

const processResult = props => {
  const { symbols, theme, queryResult, period, dispatch } = props;
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
  options.scales.xAxes[0].labels = [];
  data.labels = [];
  data.datasets = [];

  const labels = [];
  const finalLabels = [];

  symbols.forEach((symbol, index) => {
    if (queryResult.data[symbol]) {
      const { chart } = queryResult.data[symbol];
      chart.forEach(entry => {
        if (!labels[entry.label]) {
          labels[entry.label] = 0;
        }
        labels[entry.label] += 1;
        if (index === symbols.length - 1) {
          if (labels[entry.label] === symbols.length) {
            finalLabels[entry.label] = 1;
          }
        }
      });
    }
  });

  symbols.forEach((symbol, index) => {
    if (queryResult.data[symbol]) {
    const { chart, quote } = queryResult.data[symbol];
    const { latestPrice, latestSource } = quote;
    const marketState = getMarketState(latestSource);
    const symbolColor = getRandomColor(theme, index);
    const dataset = {
      label: symbol,
      type: 'line',
      data: [],
      fill: false,
      borderColor: symbolColor,
      backgroundColor: symbolColor,
      pointBorderColor: symbolColor,
      pointBackgroundColor: symbolColor,
      pointHoverBackgroundColor: symbolColor,
      pointHoverBorderColor: symbolColor,
      yAxisID: 'y-axis-1',
    };
    let previousAverage = 0;
    let skip = 0;
    if (chart && chart.length > 50) {
      skip = parseInt(chart.length / 50, 10);
    }
    let startingPoint = -1;

      if (chart) {
        chart.forEach((entry, entryindex) => {
          if (finalLabels[entry.label] === 1) {
            if (startingPoint < 0 || !startingPoint) {
              startingPoint = entry.close;
            }
            let value = 0;
            if (entry.marketClose > 0) {
              previousAverage = entry.marketClose;
              value = previousAverage;
            } else if (entry.close > 0) {
              previousAverage = entry.close;
              value = previousAverage;
            } else {
              value = previousAverage;
            }
            if (
              skip === 0 ||
              entryindex % skip === 0 ||
              entryindex === chart.length - 1
            ) {
              dataset.data.push(((value * 1000) / startingPoint).toFixed(3));
              if (index === 0) {
                options.scales.xAxes[0].labels.push(entry.label);
              }

              if (
                entryindex === chart.length - 1 &&
                marketState === OPEN &&
                period !== '1d'
              ) {
                if (index === 0) {
                  options.scales.xAxes[0].labels.push('Today');
                }
                dataset.data.push(
                  ((latestPrice * 1000) / startingPoint).toFixed(3),
                );
              }
            }
          }
        });
      }
      data.datasets.push(dataset);
    }

    data.options.scales.yAxes[0].gridLines.color = '';
    if (theme === 'dark-mode') {
      data.options.scales.yAxes[0].gridLines.color = '#555';
    }

    data.options.scales.yAxes[0].ticks.callback = xvalue => {
      return `$${xvalue}`;
    };

    data.options.tooltips.callbacks = {
      label(tooltipItem, cdata) {
        let { label } = cdata.datasets[tooltipItem.datasetIndex];
        label += `: ${tooltipItem.yLabel}$`;
        return label;
      },
    };
  });

  dispatch(setCompareData(data));
};

export { processResult };
