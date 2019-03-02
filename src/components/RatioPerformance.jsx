import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Button, ButtonGroup, Alert } from 'react-bootstrap';
import '../styles/App.scss';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { getRandomColor } from '../utils/color';

import 'react-datepicker/dist/react-datepicker.css';

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
      startDate: new Date(),
    };

    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount() {
    this.runQuery();
  }

  handleDateChange(date) {
    this.runProcessing(date);
  }

  runQuery() {
    const { symbols } = this.props;
    this.allsymbols = symbols.join(',');
    const url = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${
      this.allsymbols
    }&types=chart&range=${this.period}`;
    console.log(`RQ: RatioPerformance ${url}`);
    axios.get(url).then(res => {
      this.result = res;
      this.runProcessing();
    });
  }

  runProcessing(date) {
    const { symbols, options, data } = this.state;
    options.scales.xAxes[0].labels = [];
    data.labels = [];
    data.datasets = [];

    const labels = [];
    const finalLabels = [];
    symbols.forEach((symbol, index) => {
      const { chart } = this.result.data[symbol];
      chart.forEach(entry => {
        let skip = false;
        if (date && this.period === '5y') {
          const entryDateArr = entry.date.split('-');
          const entryDate = new Date(
            entryDateArr[0],
            entryDateArr[1] - 1,
            entryDateArr[2],
          );

          if (entryDate < date) {
            skip = true;
          }
        }
        if (!skip) {
          if (!labels[entry.label]) {
            labels[entry.label] = 0;
          }
          labels[entry.label] += 1;
          if (index === symbols.length - 1) {
            if (labels[entry.label] === symbols.length) {
              finalLabels[entry.label] = 1;
            }
          }
        }
      });
    });

    let multiplier = 0;
    if (date && this.period === '5y') {
      const today = new Date();
      const days = (today - date) / (1000 * 60 * 60 * 24);
      multiplier = days / (5 * 365);
    }
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
      let previousAverage = 0;
      let skip = 0;
      let count = chart.length;
      if (multiplier > 0) {
        count *= multiplier;
      }
      if (count > 50) {
        skip = parseInt(count / 50, 10);
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
      data.datasets.push(dataset);
    });
    this.setState({ data, options, startDate: date });
  }

  handlePeriodChange(period) {
    this.period = period;
    this.runQuery();
  }

  render() {
    const { data, options, symbols, startDate } = this.state;
    const oldsymbols = this.allsymbols;
    this.allsymbols = symbols.join(',');
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(-1800); // around 5 years in the past

    return (
      <div className="container">
        <Alert dismissible variant="dark">
          If you bought 1000$ worth of stock {this.period} ago, how much would
          it be worth now?
        </Alert>
        <div className="chart">{<Bar data={data} options={options} />}</div>
      </div>
    );
  }
}

export default RatioPerformance;
