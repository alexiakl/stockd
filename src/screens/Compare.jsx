import React, { Component } from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API, TOKEN } from '../constants';
import { setIsFetchingData } from '../actions/appStatus';
import SymbolsPicker from '../components/SymbolsPicker';
import { options } from '../utils/chartVars';
import PeriodController from '../components/PeriodController';
import StandardCharts from '../components/StandardCharts';
import { setSymbolsData } from '../actions/symbolsData';

class Compare extends Component {
  componentWillMount() {
    this.process();
  }

  componentWillReceiveProps(nextProps) {
    const { symbols, period } = this.props;
    const { symbols: nextSymbols, period: nextPeriod } = nextProps;
    if (nextSymbols.length !== symbols.length || period !== nextPeriod) {
      this.props = nextProps;
      this.runQuery();
    }
  }

  runQuery() {
    const { symbols, period, dispatch } = this.props;
    if (symbols) {
      const allsymbols = symbols.join(',');
      const url = `${API}stock/market/batch?symbols=${allsymbols}&types=quote,chart&range=${period}${TOKEN}`;
      // eslint-disable-next-line no-console
      console.log(`RQ: Live ${url}`);

      // this.process({ data: testData });
      dispatch(setIsFetchingData(true));
      axios
        .get(url)
        .then(res => {
          dispatch(setIsFetchingData(false));
          this.process(res);
        })
        .catch(error => {
          dispatch(setIsFetchingData(false));
        });
    }
  }

  process() {
    const { symbols, theme, dispatch } = this.props;
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
      const { chart } = this.result.data[symbol];
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
    });

    console.log(symbols);
    symbols.forEach((symbol, index) => {
      const { chart } = this.result.data[symbol];
      const symbolColor = '#fefefe';
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
      if (chart.length > 50) {
        skip = parseInt(chart.length / 50, 10);
      }
      let startingPoint = -1;

      chart.forEach((entry, entryindex) => {
        if (finalLabels[entry.label] === 1) {
          if (startingPoint < 0) {
            startingPoint = entry.close;
          }
          let value = 0;
          if (entry.close > 0) {
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
          }
        }
      });

      data.datasets[symbol] = dataset;

      data.options.scales.yAxes[0].gridLines.color = '';
      if (theme === 'dark-mode') {
        data.options.scales.yAxes[0].gridLines.color = '#555';
      }

      data.datasets.push(dataset);
    });

    dispatch(setSymbolsData(data));
  }

  render() {
    const { theme, isFetchingData } = this.props;
    return (
      <div className={theme}>
        <SymbolsPicker />
        <PeriodController />
        {isFetchingData && (
          <div className="loader">
            <PulseLoader color="#24a321" />
          </div>
        )}
        <StandardCharts />
      </div>
    );
  }
}

Compare.propTypes = {
  period: PropTypes.string.isRequired,
  symbols: PropTypes.arrayOf(PropTypes.string).isRequired,
  isFetchingData: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  period: state.periodController.period,
  symbols: state.symbolsPicker.symbols,
  isFetchingData: state.appStatus.isFetchingData,
  theme: state.appStatus.theme,
});

export default connect(mapStateToProps)(Compare);
