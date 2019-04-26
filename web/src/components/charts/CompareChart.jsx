import React from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { Alert } from 'react-bootstrap';
import { cloneDeep } from 'lodash';
import { getChartDimensions } from '../../utils/utils';

const CompareChart = ({ data, period }) => {
  const { datasets, options } = data;
  const fdatasets = {
    datasets,
  };
  const foptions = cloneDeep(options);

  let dimensions = [];
  if (window.innerWidth < 900) {
    dimensions = getChartDimensions(window.innerWidth);
  }

  let periodText = `${period} ago`;
  if (period === '1d') {
    periodText = 'when the market opened today';
  }
  return (
    <div className="container">
      <Alert dismissible variant="dark">
        If you bought 1000$ worth of stock {periodText}, how much would it be
        worth now?
      </Alert>
      <div className="chart">
        {dimensions.length > 0 ? (
          <Line
            data={fdatasets}
            options={foptions}
            width={dimensions[0]}
            height={dimensions[1]}
          />
        ) : (
          <Line data={fdatasets} options={foptions} />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  data: state.compareData.data,
  period: state.periodController.period,
});

export default connect(mapStateToProps)(CompareChart);