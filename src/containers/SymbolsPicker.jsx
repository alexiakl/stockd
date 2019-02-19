import React from 'react';
import { connect } from 'react-redux';
import { Form, FormControl, Button } from 'react-bootstrap';
import {
  filterSymbols,
  addSymbol,
  removeSymbol,
} from '../actions/symbolsPicker';

const mapStateToProps = state => ({
  symbols: state.symbolsPicker.symbols,
  filtered: state.symbolsPicker.filtered,
});

const SymbolsPicker = ({ symbols, filtered, dispatch }) => (
  <div>
    <div className="sdcontainer">
      <Form inline>
        <FormControl
          type="text"
          placeholder="symbol"
          className="mr-sm-2"
          onChange={evt => dispatch(filterSymbols(evt.target.value))}
        />
        {symbols.map(symbol => (
          <Button
            key={symbol}
            className="stockButton"
            variant="outline-secondary"
            size="sm"
            onClick={evt => dispatch(removeSymbol(evt.target.innerHTML))}
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
            onClick={evt =>
              dispatch(addSymbol(evt.target.innerHTML.split(' ')[0]))
            }
          >
            {symbol}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

export default connect(mapStateToProps)(SymbolsPicker);
