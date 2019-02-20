import React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { cloneDeep } from 'lodash';

const StandardCharts = ({ data }) => {
  const standardCharts = [];
  if (data && data.data && data.data.symbols) {
    const { symbols, options, datasets, info } = data.data;
    symbols.forEach(symbol => {
      const fdatasets = {
        datasets: [],
      };
      fdatasets.datasets.push(datasets[symbol]);
      const foptions = cloneDeep(options);

      if (info[symbol]) {
        const { previousClose, lastValue } = info[symbol];
        const percentage = (
          (100 * (lastValue - previousClose)) /
          previousClose
        ).toFixed(3);
        foptions.title.text = `${symbol} ${previousClose}$, ${lastValue}$, ${percentage}%`;
      } else {
        foptions.title.text = symbol;
      }
      foptions.annotation = data.data.annotations[symbol];
      standardCharts.push(
        <div className="chart two" key={symbol}>
          {<Bar data={fdatasets} options={foptions} />}
        </div>,
      );
    });
  }
  return (
    <div>
      <div className="flex">{standardCharts}</div>
    </div>
  );
};

const mapStateToProps = state => ({
  data: state.chartData,
});

export default connect(mapStateToProps)(StandardCharts);
