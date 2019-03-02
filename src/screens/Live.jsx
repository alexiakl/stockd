import React, { Component } from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PulseLoader } from 'react-spinners';
import StandardCharts from '../components/StandardCharts';
import SymbolsPicker from '../components/SymbolsPicker';
import PeriodController from '../components/PeriodController';
import {
  getTimerId,
  runQuery,
  processResult,
} from '../controllers/liveController';
import 'chartjs-plugin-annotation';

// import testData from '../data/pre_open.json';

class Live extends Component {
  componentDidMount() {
    runQuery(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { symbols, period, queryResult } = this.props;
    const {
      symbols: nextSymbols,
      period: nextPeriod,
      queryResult: nextQueryResult,
    } = nextProps;
    if (nextSymbols.length !== symbols.length || period !== nextPeriod) {
      this.props = nextProps;
      runQuery(this.props);
    } else if (
      JSON.stringify(nextQueryResult) !== JSON.stringify(queryResult)
    ) {
      this.props = nextProps;
      console.log(nextQueryResult);
      processResult(this.props);
    }
  }

  componentWillUnmount() {
    if (getTimerId()) {
      clearInterval(getTimerId());
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
            <PulseLoader color="#24a321" />
          </div>
        )}
        <StandardCharts />
      </div>
    );
  }
}

Live.propTypes = {
  period: PropTypes.string.isRequired,
  symbols: PropTypes.arrayOf(PropTypes.string).isRequired,
  isFetchingData: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  period: state.periodController.period,
  symbols: state.symbolsPicker.symbols,
  queryResult: state.symbolsData.queryResult,
  isFetchingData: state.appStatus.isFetchingData,
  theme: state.appStatus.theme,
});

export default connect(mapStateToProps)(Live);
