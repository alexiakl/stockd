import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../styles/App.scss';
import { connect } from 'react-redux';
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
      !queryResult ||
      (Object.entries(queryResult).length === 0 &&
        queryResult.constructor === Object)
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
    const { theme, loggedin } = this.props;
    if (!loggedin) {
      return <Redirect to="/login" />;
    }
    return (
      <div className={theme}>
        <SymbolsPicker />
        <PeriodController />
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
  theme: state.appStatus.theme,
  loggedin: state.appStatus.loggedin,
});

export default connect(mapStateToProps)(Live);
