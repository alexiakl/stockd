import React, { Component } from 'react';
import '../styles/App.scss';
import { Form, FormControl, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import LiveChart from '../components/LiveChart';
import StandardCharts from '../components/StandardCharts';
import { SYMBOLS_ADDED, SYMBOLS_MAP, SYMBOLS_DEFAULT } from '../constants';

class Live extends Component {
  map = null;

  state = {
    isMarketOpen: undefined,
    filtered: [],
    symbols: JSON.parse(localStorage.getItem(SYMBOLS_ADDED)),
  };

  componentWillMount() {
    this.map = JSON.parse(localStorage.getItem(SYMBOLS_MAP));
    const { symbols } = this.state;
    if (!symbols || symbols.length === 0) {
      this.setState({ symbols: SYMBOLS_DEFAULT.split(',') });
    }
    this.runQuery();
  }

  filterSymbols(evt) {
    let { filtered } = this.state;
    if (evt.target.value.length > 0) {
      filtered = this.map.filter(symbol => {
        return (
          symbol.toUpperCase().indexOf(evt.target.value.toUpperCase()) >= 0
        );
      });
      if (filtered.length > 5) {
        filtered = filtered.slice(0, 5);
      }
    } else {
      filtered = [];
    }
    this.setState({ filtered });
  }

  addSymbol(evt) {
    const { symbols } = this.state;
    const symbol = evt.target.innerHTML.split(' ')[0];
    if (symbols.indexOf(symbol) < 0) {
      symbols.push(symbol);
      localStorage.setItem(SYMBOLS_ADDED, JSON.stringify(symbols));
      this.setState({ symbols });
    }
  }

  removeSymbol(evt) {
    const { symbols } = this.state;
    if (symbols.indexOf(evt.target.innerHTML) > -1) {
      symbols.splice(symbols.indexOf(evt.target.innerHTML), 1);
      localStorage.setItem(SYMBOLS_ADDED, JSON.stringify(symbols));
      this.setState({ symbols });
    }
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
    const { filtered, isMarketOpen, symbols } = this.state;
    return (
      <div>
        <div className="sdcontainer">
          <Form inline>
            <FormControl
              type="text"
              placeholder="symbol"
              className="mr-sm-2"
              onChange={evt => this.filterSymbols(evt)}
            />
            {symbols.map(symbol => (
              <Button
                key={symbol}
                className="stockButton"
                variant="outline-secondary"
                size="sm"
                onClick={evt => this.removeSymbol(evt)}
              >
                {symbol}
              </Button>
            ))}
          </Form>

          <div className="results">
            {filtered.map(symbol => (
              <Button
                key={symbol}
                className="stockButton"
                variant="outline-secondary"
                size="sm"
                onClick={evt => this.addSymbol(evt)}
              >
                {symbol}
              </Button>
            ))}
          </div>
        </div>
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
