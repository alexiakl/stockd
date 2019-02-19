import React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import PeriodController from '../containers/PeriodController';

const mapStateToProps = state => ({
  data: state.chartData,
});

const StandardCharts = ({ data }) => {
  const standardCharts = [];
  if (data && data.data && data.data.symbols) {
    const { symbols, options, datasets } = data.data;
    symbols.forEach(symbol => {
      standardCharts.push(
        <div className="chart two" key={symbol}>
          {<Bar data={datasets[symbol]} options={options} />}
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

export default connect(mapStateToProps)(StandardCharts);
