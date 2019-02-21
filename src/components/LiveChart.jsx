import React from 'react';
import { Bar } from 'react-chartjs-2';
import { connect } from 'react-redux';
import '../styles/App.scss';

const LiveChart = ({ data }) => {
  const datasets = {
    datasets: [],
  };
  let options = {};
  if (data && data.data && data.data.symbols) {
    options = data.data.options;
    datasets.datasets = data.data.datasets;
  }

  return (
    <div className="chartContainer">
      <Bar data={datasets} options={options} />
    </div>
  );
};

const mapStateToProps = state => ({
  data: state.liveChartData,
});

export default connect(mapStateToProps)(LiveChart);
