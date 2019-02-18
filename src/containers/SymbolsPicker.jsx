import React from 'react';
import '../styles/App.scss';
import { connect } from 'react-redux';
import { Form, FormControl, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  addSymbol,
  removeSymbol,
  filterSymbols,
} from '../actions/symbolsPicker';

const SymbolsPicker = ({ dispatch, symbols, filtered }) => (
  <div>
    <div className="sdcontainer">
      <Form inline>
        <FormControl
          type="text"
          placeholder="symbol"
          onChange={evt =>
            dispatch(filterSymbols(evt.target.value.toUpperCase()))
          }
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
            {symbol.length > 25 ? `${symbol.substring(0, 25)}..` : symbol}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

SymbolsPicker.propTypes = {
  symbols: PropTypes.arrayOf(PropTypes.string).isRequired,
  filtered: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default connect()(SymbolsPicker);
