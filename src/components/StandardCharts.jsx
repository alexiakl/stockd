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

      const { quote } = info[symbol];
      const { close, change, changePercent } = quote;
      foptions.legend.display = false;
      foptions.annotation = data.data.annotations[symbol];
      standardCharts.push(
        <div className="chart two" key={symbol}>
          <div className="chartContainer">
            <div className="chartHeader">
              <p>
                {symbol} {close}$ <br />
                <span className={`chartInfo ${change > 0 ? 'green' : 'red'}`}>
                  {change}$ {changePercent * 100}%
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
  return <div className="flex">{standardCharts}</div>;
};

const mapStateToProps = state => ({
  data: state.chartData,
});

export default connect(mapStateToProps)(StandardCharts);
