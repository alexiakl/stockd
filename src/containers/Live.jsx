import React, { Component } from 'react';
import '../styles/App.scss';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import LiveChart from '../components/LiveChart';
import StandardCharts from '../components/StandardCharts';
import SymbolsPicker from '../components/SymbolsPicker';
import { MY_SYMBOLS, SYMBOLS_MAP, DEFAULT_SYMBOLS } from '../constants';

class Live extends Component {
  map = null;

  state = {
    isMarketOpen: undefined,
    symbols: JSON.parse(localStorage.getItem(MY_SYMBOLS)),
  };

  componentWillMount() {
    this.map = JSON.parse(localStorage.getItem(SYMBOLS_MAP));
    const { symbols } = this.state;
    if (!symbols || symbols.length === 0) {
      this.setState({ symbols: DEFAULT_SYMBOLS.split(',') });
    }
    this.runQuery();
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
    const { isMarketOpen, symbols } = this.state;
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
