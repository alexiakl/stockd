import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Button, ButtonGroup } from 'react-bootstrap';
import '../styles/App.scss';
import PropTypes from 'prop-types';
import { getRandomColor } from '../utils/getRandomColor';

class RatioPerformance extends Component {
  result = null;

  period = '1y';

  allsymbols = '';

  static propTypes = {
    symbols: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    symbols: ['AAPL', 'FB', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'],
  };

  constructor(props) {
    super(props);

    const { symbols } = this.props;
    this.state = {
      symbols,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
          mode: 'label',
        },
        elements: {
          line: {
            fill: false,
          },
        },
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: { display: false },
              labels: [],
            },
          ],
          yAxes: [
            {
              type: 'linear',
              display: true,
              position: 'left',
              id: 'y-axis-1',
              ticks: {
                beginAtZero: false,
              },
              gridLines: {
                display: true,
              },
              labels: {
                show: true,
              },
            },
          ],
        },
      },
      data: {
        labels: [],
        datasets: [],
      },
    };
  }

  componentDidMount() {
    this.runQuery();
  }

  runQuery() {
    const { symbols } = this.props;
    this.allsymbols = symbols.join(',');
    const url = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${
      this.allsymbols
    }&types=chart&range=${this.period}`;
    axios.get(url).then(res => {
      this.result = res;
      this.runProcessing();
    });
  }

  runProcessing() {
    const { symbols, options, data } = this.state;
    options.scales.xAxes[0].labels = [];
    data.labels = [];
    data.datasets = [];
    symbols.forEach((symbol, index) => {
      const { chart } = this.result.data[symbol];
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
      let skip = 0;
      if (chart.length > 50) {
        skip = parseInt(chart.length / 50, 10);
      }
      let startingPoint = -1;
      chart.forEach((entry, entryindex) => {
        if (
          skip === 0 ||
          entryindex % skip === 0 ||
          entryindex === chart.length - 1
        ) {
          if (startingPoint < 0) {
            startingPoint = entry.close;
          }
          dataset.data.push((entry.close / startingPoint).toFixed(2));
          if (index === 0) {
            options.scales.xAxes[0].labels.push(entry.label);
          }
        }
      });
      data.datasets.push(dataset);
    });
    this.setState({ data, options });
  }

  handlePeriodChange(period) {
    this.period = period;
    this.runQuery();
  }

  render() {
    const { data, options, symbols } = this.state;
    const oldsymbols = this.allsymbols;
    this.allsymbols = symbols.join(',');
    if (this.allsymbols !== oldsymbols) {
      this.runQuery();
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
        <div className="chart">{<Bar data={data} options={options} />}</div>
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
      </div>
    );
  }
}

export default RatioPerformance;
