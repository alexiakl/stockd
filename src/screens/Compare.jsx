import React, { Component } from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SymbolsPicker from '../components/symbolsPicker/SymbolsPicker';
import PeriodController from '../components/PeriodController';
import { processResult } from '../controllers/compareController';
import { runQuery } from '../controllers/liveController';
import CompareChart from '../components/charts/CompareChart';
import { TOKEN } from '../constants';

class Compare extends Component {
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
      fireTimer: nextFireTimer,
      theme: nextTheme,
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

  render() {
    const { theme } = this.props;

    const token = localStorage.getItem(TOKEN);
    if (!token) {
      return <Redirect to="/login" />;
    }
    return (
      <div className={theme}>
        <SymbolsPicker />
        <PeriodController />
        <CompareChart />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  period: state.periodController.period,
  symbols: state.symbolsPicker.symbols,
  isFetchingData: state.appStatus.isFetchingData,
  queryResult: state.symbolsData.queryResult,
  fireTimer: state.symbolsData.fireTimer,
  theme: state.appStatus.theme,
});

export default connect(mapStateToProps)(Compare);
