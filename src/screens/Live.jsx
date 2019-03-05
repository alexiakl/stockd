import React, { Component } from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import StandardCharts from '../components/charts/StandardCharts';
import SymbolsPicker from '../components/symbolsPicker/SymbolsPicker';
import PeriodController from '../components/PeriodController';
import {
  resetTimer,
  runQuery,
  processResult,
} from '../controllers/liveController';
import 'chartjs-plugin-annotation';

// import testData from '../data/pre_open.json';

class Live extends Component {
  componentDidMount() {
    const { queryResult } = this.props;
    if (
      Object.entries(queryResult).length === 0 &&
      queryResult.constructor === Object
    ) {
      runQuery(this.props);
    } else {
      processResult(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { symbols, period, queryResult, theme, fireTimer } = this.props;
    const {
      symbols: nextSymbols,
      period: nextPeriod,
      queryResult: nextQueryResult,
      theme: nextTheme,
      fireTimer: nextFireTimer,
    } = nextProps;

    if (
      nextSymbols.length > symbols.length ||
      period !== nextPeriod ||
      fireTimer !== nextFireTimer
    ) {
      this.props = nextProps;
      runQuery(this.props);
    } else if (
      JSON.stringify(nextQueryResult) !== JSON.stringify(queryResult) ||
      theme !== nextTheme ||
      nextSymbols.join(',') !== symbols.join(',')
    ) {
      this.props = nextProps;
      processResult(this.props);
    }
  }

  componentWillUnmount() {
    resetTimer();
  }

  render() {
    const { theme, isFetchingData } = this.props;
    return (
      <div className={theme}>
        <SymbolsPicker />
        <PeriodController />
        {isFetchingData && (
          <div className="loader">
            <PulseLoader color="#5c646d" />
          </div>
        )}
        <StandardCharts />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  period: state.periodController.period,
  symbols: state.symbolsPicker.symbols,
  queryResult: state.symbolsData.queryResult,
  fireTimer: state.symbolsData.fireTimer,
  isFetchingData: state.appStatus.isFetchingData,
  theme: state.appStatus.theme,
});

export default connect(mapStateToProps)(Live);
