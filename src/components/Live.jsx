import React, { Component } from 'react';
import '../styles/App.scss';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import LiveChart from '../containers/LiveChart';
import StandardCharts from '../containers/StandardCharts';
import SymbolsPicker from '../containers/SymbolsPicker';

class Live extends Component {
  componentWillMount() {
    console.log(this.state);
    console.log(this.props);
    // this.map = JSON.parse(localStorage.getItem(SYMBOLS_MAP));
    // const { symbols } = this.state;
    // if (!symbols || symbols.length === 0) {
    //   this.setState({ symbols: DEFAULT_SYMBOLS.split(',') });
    // }
    // this.runQuery();
  }

  runQuery() {
    const url = `https://api.iextrading.com/1.0/stock/market/batch?symbols=GOOGL&types=chart&range=dynamic`;
    console.log(`RQ: Live ${url}`);
    axios.get(url).then(res => {
      this.result = res;
      this.runProcessing();
    });
  }

  runProcessing() {
    const { chart } = this.result.data.GOOGL;
    const { range } = chart;
    const isMarketOpen = range === 'today';
    this.setState({ isMarketOpen });
  }

  render() {
    const { isMarketOpen, symbols } = this.props;
    console.log(isMarketOpen);
    return (
      <div>
        <SymbolsPicker />
        {isMarketOpen && <LiveChart symbols={symbols} />}
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
        <StandardCharts symbols={symbols} />
      </div>
    );
  }
}

export default Live;
