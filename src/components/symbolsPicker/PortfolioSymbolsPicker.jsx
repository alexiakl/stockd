import React from 'react';
import { connect } from 'react-redux';
import { Form, FormControl, Button } from 'react-bootstrap';
import {
  addPortfolioRecord,
  removePortfolioRecord,
} from '../../actions/portfolioSymbolsPicker';
import { filterSymbols } from '../../actions/symbolsPicker';

const PortfolioSymbolsPicker = ({ filtered, dispatch }) => (
  <div className="sdcontainer">
    <Form inline>
      <FormControl
        type="text"
        placeholder="symbol"
        className="mr-sm-2"
        onChange={evt => dispatch(filterSymbols(evt.target.value))}
      />
      <div className="results">
        {filtered.map(symbol => (
          <Button
            key={symbol}
            className="stock-button"
            variant="outline-secondary"
            size="sm"
            onClick={evt =>
              dispatch(addPortfolioRecord(evt.target.innerHTML.split(' ')[0]))
            }
          >
            {symbol.length > 30 ? `${symbol.substring(0, 30)}..` : symbol}
          </Button>
        ))}
      </div>
    </Form>
  </div>
);

const mapStateToProps = state => ({
  filtered: state.symbolsPicker.filtered,
});

export default connect(mapStateToProps)(PortfolioSymbolsPicker);
