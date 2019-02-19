import React from 'react';
import '../styles/App.scss';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import LiveChart from '../components/LiveChart';
import StandardCharts from '../components/StandardCharts';
import SymbolsPicker from './SymbolsPicker';
import { setChartData } from '../actions/chartData';

const mapStateToProps = state => ({
  isMarketOpen: state.marketState.isMarketOpen,
  period: state.periodController.period,
  symbols: state.symbolsPicker.symbols,
});

const process = (res, symbols, dispatch) => {
  const data = {
    symbols: [],
    labels: [],
    datasets: [],
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
              callback(value) {
                return `${value}%`;
              },
            },
            gridLines: {
              zeroLineColor: '#888',
              zeroLineWidth: 2,
              display: true,
            },
            labels: {
              show: true,
            },
          },
        ],
      },
    },
  };

  const templabels = [];
  symbols.forEach((symbol, index) => {
    data.symbols.push(symbol);
    const { chart } = res.data[symbol];

    chart.forEach(entry => {
      if (!templabels[entry.label]) {
        templabels[entry.label] = 0;
      }
      templabels[entry.label] += 1;
      if (index === symbols.length - 1) {
        if (templabels[entry.label] === symbols.length) {
          data.labels[entry.label] = 1;
        }
      }
    });
  });

  symbols.forEach((symbol, index) => {
    const { chart, quote } = res.data[symbol];
    const { previousClose } = quote;
    const symbolColor = '#456456';
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
    let previousValue = 0;
    let skip = 0;
    if (chart.length > 50) {
      skip = parseInt(chart.length / 50, 10);
    }
    chart.forEach((entry, entryindex) => {
      if (data.labels[entry.label] === 1) {
        let value = 0;
        if (entry.close > 0) {
          previousValue = entry.close;
          value = previousValue;
        } else if (entry.marketClose > 0) {
          previousValue = entry.marketClose;
          value = previousValue;
        } else {
          value = previousValue;
        }

        if (
          skip === 0 ||
          entryindex % skip === 0 ||
          entryindex === chart.length - 1
        ) {
          const valueToPush = (
            (100 * (value - previousClose)) /
            previousClose
          ).toFixed(3);
          dataset.data.push(valueToPush);
          if (index === 0) {
            data.options.scales.xAxes[0].labels.push(entry.label);
          }
        }
      }
    });
    data.datasets[symbol] = dataset;
  });

  dispatch(setChartData(data));
};

const runQuery = (symbols, period, dispatch) => {
  const allsymbols = symbols.join(',');
  const url = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${allsymbols}&types=quote,chart&range=${period}`;
  console.log(`RQ: Live ${url}`);
  axios.get(url).then(res => {
    process(res, symbols, dispatch);
  });
};

const Live = ({ isMarketOpen, symbols, period, dispatch }) => {
  runQuery(symbols, period, dispatch);
  return (
    <div>
      <SymbolsPicker />
      {isMarketOpen && <LiveChart />}
      {!isMarketOpen && (
        <div>
          <div className="container">
            <Alert dismissible variant="info">
              <Alert.Heading>The market is currently closed!</Alert.Heading>
              <hr />
              <p className="mb-0">
                In the meantime, take a look at the following charts!
              </p>
            </Alert>
          </div>
        </div>
      )}
      <StandardCharts />
    </div>
  );
};

export default connect(mapStateToProps)(Live);
