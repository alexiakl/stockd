import React, { Component } from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import PropTypes from 'prop-types';
import SymbolsPicker from '../components/SymbolsPicker';
import PeriodController from '../components/PeriodController';
import { processResult } from '../controllers/compareController';
import { runQuery } from '../controllers/liveController';
import CompareChart from '../components/CompareChart';

class Compare extends Component {
  componentWillMount() {
    processResult(this.props);
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
            <PulseLoader color="#24a321" />
          </div>
        )}
        <CompareChart />
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
  queryResult: state.symbolsData.queryResult,
  theme: state.appStatus.theme,
});

export default connect(mapStateToProps)(Compare);
