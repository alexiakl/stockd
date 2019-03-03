import React from 'react';
import { connect } from 'react-redux';
import { Form, FormControl, Button } from 'react-bootstrap';
import { filterSymbols, addSymbol } from '../../actions/symbolsPicker';
import DroppableContainer from './DroppableContainer';

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
        {symbols && (
          <DroppableContainer dispatch={dispatch} symbols={symbols} />
        )}
      </Form>

      <div className="results">
        {filtered &&
          filtered.map(symbol => (
            <Button
              key={symbol}
              className="stock-button"
              variant="outline-secondary"
              size="sm"
              onClick={evt =>
                dispatch(addSymbol(evt.target.innerHTML.split(' ')[0]))
              }
            >
              {symbol.length > 30 ? `${symbol.substring(0, 30)}..` : symbol}
            </Button>
          ))}
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  symbols: state.symbolsPicker.symbols,
  filtered: state.symbolsPicker.filtered,
});

export default connect(mapStateToProps)(SymbolsPicker);
