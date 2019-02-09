import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import '../styles/App.scss';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
class Mixed extends Component {
  state = {
    symbols: ['aapl', 'fb', 'tsla', 'googl', 'amzn', 'msft'],
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
              beginAtZero: true,
            },
            gridLines: {
              display: false,
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

  componentDidMount() {
    const { symbols, options, data } = this.state;
    const allsymbols = symbols.join(',');
    const url = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${allsymbols}&types=chart&range=5y`;
    axios.get(url).then(res => {
      symbols.forEach((symbol, index) => {
        const { chart } = res.data[symbol.toUpperCase()];
        const symbolColor = getRandomColor();
        const dataset = {
          label: symbol.toUpperCase(),
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
        if (chart.length > 100) {
          skip = parseInt(chart.length / 100, 10);
        }
        let startingPoint = -1;
        chart.forEach((entry, entryindex) => {
          if (entryindex % skip === 0) {
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
    });
  }

  render() {
    const { data, options } = this.state;
    return (
      <div className="mychart">{<Bar data={data} options={options} />}</div>
    );
  }
}

export default Mixed;
