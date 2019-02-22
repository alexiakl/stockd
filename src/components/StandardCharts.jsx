import React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { cloneDeep } from 'lodash';
import { getPerformanceColor } from '../utils/color';

const StandardCharts = ({ data }) => {
  const standardCharts = [];
  if (data && data.data && data.data.symbols) {
    const { symbols, options, datasets, labels, info } = data.data;
    symbols.forEach(symbol => {
      const fdatasets = {
        datasets: [],
      };
      fdatasets.datasets.push(datasets[symbol]);
      const foptions = cloneDeep(options);

      const { quote, latestValue } = info[symbol];
      const { close, change, changePercent } = quote;
      foptions.legend.display = false;
      foptions.annotation = data.data.annotations[symbol];
      foptions.scales.xAxes[0].labels = labels[symbol];
      standardCharts.push(
        <div className="chart cols" key={symbol}>
          <div className="chartContainer">
            <div className="chartHeader">
              <p>
                {symbol} {latestValue > 0 ? latestValue : close}$ <br />
                <span className={`chartInfo ${getPerformanceColor(change)}`}>
                  {change}$ {(changePercent * 100).toFixed(3)}%
                </span>
              </p>
            </div>
            {<Bar data={fdatasets} options={foptions} />}
            <div />
          </div>
        </div>,
      );
    });
  }
  return <div className="flex responsiveCharts">{standardCharts}</div>;
};

const mapStateToProps = state => ({
  data: state.chartData,
});

export default connect(mapStateToProps)(StandardCharts);
