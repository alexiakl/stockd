import React from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { cloneDeep } from 'lodash';
import { getPerformanceColor, getPerformanceColorHex } from '../../utils/color';
import {
  getMarketStateDescription,
  getChartDimensions,
} from '../../utils/utils';
import { CLOSED } from '../../constants';

const StandardCharts = ({ data, period }) => {
  const standardCharts = [];
  if (data && data.symbols) {
    const { symbols, options, datasets, labels, info, annotations } = data;
    symbols.forEach(symbol => {
      const fdatasets = {
        datasets: [],
      };

      fdatasets.datasets.push(datasets[symbol]);
      const foptions = cloneDeep(options);

      const { quote, latestValue, marketState } = info[symbol];
      const { close, changePercent } = quote;
      let { change } = quote;
      const changePercentString = (changePercent * 100).toFixed(3);
      foptions.legend.display = false;
      foptions.annotation = annotations[symbol];
      foptions.scales.xAxes[0].labels = labels[symbol];

      let symbolColor = getPerformanceColorHex(change);
      let longData = false;
      let longChange = 0;
      let longChangePercent = 0;
      if (period !== '1d') {
        const chartData = datasets[symbol].data;
        longChange = (chartData[chartData.length - 1] - chartData[0]).toFixed(
          2,
        );
        longChangePercent = ((longChange * 100) / chartData[0]).toFixed(2);
        symbolColor = getPerformanceColorHex(longChange);
        longData = true;
      }
      if (change === undefined || change === null) {
        change = '';
      }
      const isMarketClosed = marketState === CLOSED;
      const isManyDaysOpen = !isMarketClosed && longData;
      const isOneDayOpen = !isMarketClosed && !longData;
      const isOneDayClosed = isMarketClosed && !longData;
      const isManyDaysClosed = isMarketClosed && longData;

      let textColor = getPerformanceColor(change);
      if (isManyDaysClosed) {
        textColor = getPerformanceColor(longChange);
      }

      datasets[symbol].borderColor = symbolColor;
      datasets[symbol].backgroundColor = symbolColor;
      datasets[symbol].pointBorderColor = symbolColor;
      datasets[symbol].pointBackgroundColor = symbolColor;
      datasets[symbol].pointHoverBackgroundColor = symbolColor;
      datasets[symbol].pointHoverBorderColor = symbolColor;

      let dimensions = [];
      if (window.innerWidth < 900) {
        dimensions = getChartDimensions(window.innerWidth);
      }

      standardCharts.push(
        <div className="chart cols" key={symbol}>
          <div className="chart-container">
            <div className="chart-header">
              <p>
                {symbol} {latestValue > 0 ? latestValue : close}$ <br />
                <span className={`chart-info ${textColor}`}>
                  {isManyDaysOpen && `live: ${change}$ ${changePercentString}%`}
                  {isOneDayOpen && `${change}$ ${changePercentString}%`}
                  {isOneDayClosed && `${change}$ ${changePercentString}%`}
                  {isManyDaysClosed &&
                    `${period}: ${longChange}$ ${longChangePercent}%`}
                </span>
                <span className="chart-info horizontal-separator">
                  {getMarketStateDescription(marketState, quote)}
                </span>
                {isManyDaysOpen && (
                  <span
                    className={`chart-info horizontal-break ${getPerformanceColor(
                      longChange,
                    )}`}
                  >
                    {period}: {longChange}$ {longChangePercent}%
                  </span>
                )}
              </p>
            </div>
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
        </div>,
      );
    });
  }
  return <div className="flex wrap standard-charts">{standardCharts}</div>;
};

const mapStateToProps = state => ({
  data: state.symbolsData.data,
  period: state.periodController.period,
});

export default connect(mapStateToProps)(StandardCharts);
