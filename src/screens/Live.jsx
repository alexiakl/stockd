import React, { Component } from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import StandardCharts from '../components/StandardCharts';
import SymbolsPicker from '../components/SymbolsPicker';
import { getRandomColor } from '../utils/color';
import { options } from '../utils/chartVars';
import PeriodController from '../components/PeriodController';
import { API, TOKEN, OPEN, PRE_OPEN } from '../constants';
import { setSymbolsData } from '../actions/symbolsData';
import { getMarketState } from '../utils/utils';
import 'chartjs-plugin-annotation';

// import testData from '../data/pre_open.json';

let timerId = 0;
let timerInterval = 0;
class Live extends Component {
  componentDidMount() {
    this.runQuery();
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.runQuery();
  }

  componentWillUnmount() {
    if (timerId) {
      clearInterval(timerId);
    }
  }

  runQuery() {
    const { symbols, period } = this.props;
    const allsymbols = symbols.join(',');
    const url = `${API}stock/market/batch?symbols=${allsymbols}&types=quote,chart&range=${period}${TOKEN}`;
    // eslint-disable-next-line no-console
    console.log(`RQ: Live ${url}`);
    // this.process({ data: testData });
    axios.get(url).then(res => {
      this.process(res);
    });
  }

  process(res) {
    const { symbols, period, dispatch } = this.props;
    const data = {
      symbols: [],
      labels: [],
      datasets: [],
      info: [],
      annotations: [],
      options,
    };

    symbols.forEach((symbol, index) => {
      data.symbols.push(symbol);
      const { chart, quote } = res.data[symbol];
      const { previousClose, latestPrice, latestSource } = quote;
      const symbolColor = getRandomColor(symbols.length, index);
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
      const marketState = getMarketState(latestSource);
      let previousValue = 0;
      let latestValue = 0;
      let skip = 0;
      if (chart.length > 50) {
        skip = parseInt(chart.length / 50, 10);
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
            }
          }
          dataset.data.push(value.toFixed(3));
          if (!data.labels[symbol]) {
            data.labels[symbol] = [];
          }
          data.labels[symbol].push(entry.label);
        }
      });

      if (marketState === PRE_OPEN && period === '1d') {
        const dupLabels = data.labels[symbol];
        dupLabels.forEach(() => {
          data.labels[symbol].push('.');
        });
      }

      data.datasets[symbol] = dataset;

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

    const timerIntervalTemp = 300000; // 5 mins
    if (timerIntervalTemp !== timerInterval) {
      timerInterval = timerIntervalTemp;
      if (timerId) {
        clearInterval(timerId);
      }
      timerId = setInterval(() => this.runQuery(), timerInterval);
    }

    dispatch(setSymbolsData(data));
  }

  render() {
    return (
      <div>
        <SymbolsPicker />
        <PeriodController />
        <StandardCharts />
      </div>
    );
  }
}

Live.propTypes = {
  period: PropTypes.string.isRequired,
  symbols: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  period: state.periodController.period,
  symbols: state.symbolsPicker.symbols,
});

export default connect(mapStateToProps)(Live);
