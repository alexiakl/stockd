import React, { Component } from 'react';
import '../styles/App.scss';
import { Form, FormControl, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { MY_SYMBOLS, SYMBOLS_MAP, DEFAULT_SYMBOLS } from '../constants';

class Live extends Component {
  map = null;

  state = {
    filtered: [],
    symbols: JSON.parse(localStorage.getItem(MY_SYMBOLS)),
  };

  componentWillMount() {
    this.map = JSON.parse(localStorage.getItem(SYMBOLS_MAP));
    const { symbols } = this.state;
    if (!symbols || symbols.length === 0) {
      this.setState({ symbols: DEFAULT_SYMBOLS.split(',') });
    }
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
      localStorage.setItem(MY_SYMBOLS, JSON.stringify(symbols));
      this.setState({ symbols });
    }
  }

  removeSymbol(evt) {
    const { symbols } = this.state;
    if (symbols.indexOf(evt.target.innerHTML) > -1) {
      symbols.splice(symbols.indexOf(evt.target.innerHTML), 1);
      localStorage.setItem(MY_SYMBOLS, JSON.stringify(symbols));
      this.setState({ symbols });
    }
  }

  render() {
    const { filtered, symbols } = this.state;
    return (
      <div>
        <div className="sdcontainer">
          <Form inline>
            <FormControl
              type="text"
              placeholder="symbol"
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
                {symbol.length > 25 ? `${symbol.substring(0, 25)}..` : symbol}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(Live);
