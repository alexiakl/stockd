import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../styles/App.scss';
import { connect } from 'react-redux';
import Footer from '../components/layout/Footer';
import StandardCharts from '../components/charts/StandardCharts';
import PeriodController from '../components/PeriodController';
import {
  resetTimer,
  runQuery,
  processResult,
  calibrateTimer,
} from '../controllers/chartsController';
import 'chartjs-plugin-annotation';

class Charts extends Component {
  componentDidMount() {
    runQuery(this.props);
    calibrateTimer(this.props, false);
  }

  componentWillReceiveProps(nextProps) {
    const { period, fireTimer, timerInterval } = this.props;
    const {
      period: nextPeriod,
      fireTimer: nextFireTimer,
      timerInterval: nextTimerInterval,
    } = nextProps;

    if (timerInterval !== nextTimerInterval) {
      this.props = nextProps;
      calibrateTimer(this.props);
    }

    if (period !== nextPeriod || fireTimer !== nextFireTimer) {
      this.props = nextProps;
      runQuery(this.props);
    } else {
      this.props = nextProps;
      processResult(this.props);
    }
  }

  componentWillUnmount() {
    const { timerId } = this.props;
    resetTimer(timerId);
  }

  render() {
    const { theme, loggedin } = this.props;
    if (!loggedin) {
      return <Redirect to="/login" />;
    }
    return (
      <div className={theme}>
        <PeriodController />
        <StandardCharts />
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  period: state.periodController.period,
  symbols: state.symbolsPicker.symbols,
  queryResult: state.symbolsData.queryResult,
  fireTimer: state.symbolsData.fireTimer,
  timerInterval: state.appStatus.timerInterval,
  timerId: state.appStatus.timerId,
  theme: state.appStatus.theme,
  loggedin: state.appStatus.loggedin,
});

export default connect(mapStateToProps)(Charts);
