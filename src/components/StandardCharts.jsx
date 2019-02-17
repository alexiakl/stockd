import React, { Component } from 'react';
import axios from 'axios';
import { Button, ButtonGroup } from 'react-bootstrap';
import '../styles/App.scss';
import PropTypes from 'prop-types';
import StandardChart from './StandardChart';

class StandardCharts extends Component {
  result = null;

  period = '1y';

  newData = true;

  allsymbols = '';

  standardCharts = [];

  finalLabels = [];

  static propTypes = {
    symbols: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    symbols: ['AAPL', 'FB', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'],
  };

  state = {
    result: {},
    finalLabels: [],
  };

  componentDidMount() {
    this.runProcessing();
  }

  componentDidUpdate() {
    const { symbols } = this.props;
    const oldsymbols = this.allsymbols;
    this.allsymbols = symbols.join(',');
    if (this.allsymbols !== oldsymbols) {
      this.runQuery();
    }
  }

  component;

  runQuery() {
    const { symbols } = this.props;
    this.allsymbols = symbols.join(',');
    const url = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${
      this.allsymbols
    }&types=chart&range=${this.period}`;
    console.log(`RQ: StandardCharts ${url}`);
    axios.get(url).then(res => {
      this.result = res;
      this.runProcessing();
    });
  }

  runProcessing() {
    const { symbols } = this.props;

    const oldsymbols = this.allsymbols;
    this.allsymbols = symbols.join(',');
    if (this.allsymbols !== oldsymbols) {
      this.runQuery();
      return;
    }

    this.newData = true;

    this.finalLabels = [];
    symbols.forEach((symbol, index) => {
      const { chart } = this.result.data[symbol];
      chart.forEach(entry => {
        if (!this.finalLabels[entry.label]) {
          this.finalLabels[entry.label] = 0;
        }
        this.finalLabels[entry.label] += 1;
        if (index === symbols.length - 1) {
          if (this.finalLabels[entry.label] === symbols.length) {
            this.finalLabels[entry.label] = 1;
          }
        }
      });
    });

    this.setState({ result: this.result, finalLabels: this.finalLabels });
  }

  handlePeriodChange(period) {
    this.period = period;
    this.runQuery();
  }

  render() {
    const { result, finalLabels } = this.state;
    const { symbols } = this.props;

    if (this.newData === true) {
      this.newData = false;
      if (result.data) {
        this.standardCharts = [];
        symbols.forEach(symbol => {
          this.standardCharts.push(
            <StandardChart
              key={symbol}
              symbol={symbol}
              labels={finalLabels}
              chart={result.data[symbol].chart}
            />,
          );
        });
      }
    }

    let [onem, threem, sixm, ytd, oney, twoy, fivey] = [
      'outline-secondary',
      'outline-secondary',
      'outline-secondary',
      'outline-secondary',
      'outline-secondary',
      'outline-secondary',
      'outline-secondary',
    ];
    switch (this.period) {
      case '1m':
        onem = 'secondary';
        break;
      case '3m':
        threem = 'secondary';
        break;
      case '6m':
        sixm = 'secondary';
        break;
      case 'ytd':
        ytd = 'secondary';
        break;
      case '1y':
        oney = 'secondary';
        break;
      case '2y':
        twoy = 'secondary';
        break;
      case '5y':
        fivey = 'secondary';
        break;
      default:
        // code block
        break;
    }

    return (
      <div className="container">
        <div className="periodButtons">
          <ButtonGroup aria-label="Period">
            <Button
              variant={onem}
              size="sm"
              onClick={() => this.handlePeriodChange('1m')}
            >
              1 month
            </Button>
            <Button
              variant={threem}
              size="sm"
              onClick={() => this.handlePeriodChange('3m')}
            >
              3 months
            </Button>
            <Button
              variant={sixm}
              size="sm"
              onClick={() => this.handlePeriodChange('6m')}
            >
              6 months
            </Button>
            <Button
              variant={ytd}
              size="sm"
              onClick={() => this.handlePeriodChange('ytd')}
            >
              YTD
            </Button>
            <Button
              variant={oney}
              size="sm"
              onClick={() => this.handlePeriodChange('1y')}
            >
              1 year
            </Button>
            <Button
              variant={twoy}
              size="sm"
              onClick={() => this.handlePeriodChange('2y')}
            >
              2 years
            </Button>
            <Button
              variant={fivey}
              size="sm"
              onClick={() => this.handlePeriodChange('5y')}
            >
              5 years
            </Button>
          </ButtonGroup>
        </div>
        <div className="flex">{this.standardCharts}</div>
      </div>
    );
  }
}

export default StandardCharts;
