import React, { Component } from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import SymbolsPicker from '../components/symbolsPicker/SymbolsPicker';
import PeriodController from '../components/PeriodController';
import { processResult } from '../controllers/compareController';
import { runQuery } from '../controllers/liveController';
import CompareChart from '../components/charts/CompareChart';

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
    const { symbols, period, queryResult, theme } = this.props;
    const {
      symbols: nextSymbols,
      period: nextPeriod,
      queryResult: nextQueryResult,
      theme: nextTheme,
    } = nextProps;

    if (nextSymbols.length !== symbols.length || period !== nextPeriod) {
      this.props = nextProps;
      runQuery(this.props);
    } else if (
      JSON.stringify(nextQueryResult) !== JSON.stringify(queryResult) ||
      theme !== nextTheme
    ) {
      this.props = nextProps;
      processResult(this.props);
    }
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
  theme: state.appStatus.theme,
});

export default connect(mapStateToProps)(Compare);
