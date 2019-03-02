import React from 'react';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { Alert } from 'react-bootstrap';
import { cloneDeep } from 'lodash';

const CompareChart = ({ data, period }) => {
  const { datasets, options } = data;
  const fdatasets = {
    datasets,
  };
  const foptions = cloneDeep(options);

  return (
    <div className="container">
      <Alert dismissible variant="dark">
        If you bought 1000$ worth of stock {period} ago, how much would it be
        worth now?
      </Alert>
      <div className="chart">{<Bar data={fdatasets} options={foptions} />}</div>
    </div>
  );
};

const mapStateToProps = state => ({
  data: state.compareData.data,
  period: state.periodController.period,
});

export default connect(mapStateToProps)(CompareChart);
