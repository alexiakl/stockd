import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import '../styles/App.scss';
import PropTypes from 'prop-types';
import { getRandomColor } from '../utils/getRandomColor';

class StandardCharts extends Component {
  static propTypes = {
    symbol: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    labels: PropTypes.array,
    // eslint-disable-next-line react/forbid-prop-types
    chart: PropTypes.array,
  };

  static defaultProps = {
    symbol: '',
    labels: [],
    chart: [],
  };

  constructor(props) {
    super(props);

    this.state = {
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
    this.runProcessing();
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.runProcessing();
  }

  runProcessing() {
    const { chart, labels, symbol } = this.props;
    const { options, data } = this.state;
    options.scales.xAxes[0].labels = [];
    data.labels = [];
    data.datasets = [];

    const symbolColor = getRandomColor(1, 0);
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
    if (chart.length > 50) {
      skip = parseInt(chart.length / 50, 10);
    }

    chart.forEach((entry, entryindex) => {
      if (labels[entry.label] === 1) {
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
          dataset.data.push(value.toFixed(3));
          options.scales.xAxes[0].labels.push(entry.label);
        }
      }
    });
    data.datasets.push(dataset);

    this.setState({ data, options });
  }

  render() {
    const { data, options } = this.state;
    return (
      <div className="chart two">{<Bar data={data} options={options} />}</div>
    );
  }
}

export default StandardCharts;
