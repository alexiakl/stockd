import React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import PeriodController from './PeriodController';

const StandardCharts = ({ data }) => {
  const standardCharts = [];
  if (data && data.data && data.data.symbols) {
    const { symbols, options, datasets } = data.data;
    symbols.forEach(symbol => {
      const fdatasets = {
        datasets: [],
      };
      fdatasets.datasets.push(datasets[symbol]);
      standardCharts.push(
        <div className="chart two" key={symbol}>
          {<Bar data={fdatasets} options={options} />}
        </div>,
      );
    });
  }
  return (
    <div>
      <PeriodController />
      <div className="flex">{standardCharts}</div>
    </div>
  );
};

const mapStateToProps = state => ({
  data: state.chartData,
});

export default connect(mapStateToProps)(StandardCharts);
