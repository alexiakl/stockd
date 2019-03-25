import React from 'react';
import { connect } from 'react-redux';
import {
  Form,
  FormControl,
  Button,
  SplitButton,
  Dropdown,
} from 'react-bootstrap';
import { addPortfolioRecord } from '../../actions/portfolio';
import { fireTimer } from '../../actions/symbolsData';
import { setTimerInterval } from '../../actions/appStatus';
import { filterSymbols } from '../../actions/symbolsPicker';
import { FIVE_MINS, TEN_MINS, FIFTEEN_MINS, ONE_HOUR } from '../../constants';

const portfolioSymbolsPicker = ({
  filtered,
  dispatch,
  isFetchingData,
  timerInterval,
}) => {
  let refreshTitle = 'Refresh';
  switch (timerInterval) {
    case FIFTEEN_MINS:
      refreshTitle = '15 Mins';
      break;
    case TEN_MINS:
      refreshTitle = '10 Mins';
      break;
    case FIVE_MINS:
      refreshTitle = '5 Mins';
      break;

    default:
      break;
  }

  return (
    <div className="sdcontainer">
      <Form inline>
        <FormControl
          type="text"
          placeholder="symbol"
          className="mr-sm-2"
          onChange={evt => dispatch(filterSymbols(evt.target.value))}
        />
        <SplitButton
          className="refresh-button"
          size="sm"
          title={isFetchingData ? 'Loading' : refreshTitle}
          variant="info"
          onClick={() => dispatch(fireTimer())}
        >
          <Dropdown.Item onClick={() => dispatch(setTimerInterval(FIVE_MINS))}>
            Every 5 Mins
          </Dropdown.Item>
          <Dropdown.Item onClick={() => dispatch(setTimerInterval(TEN_MINS))}>
            Every 10 Mins
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => dispatch(setTimerInterval(FIFTEEN_MINS))}
          >
            Every 15 Mins
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => dispatch(setTimerInterval(ONE_HOUR))}>
            Every 1 Hour
          </Dropdown.Item>
        </SplitButton>
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
};
const mapStateToProps = state => ({
  filtered: state.symbolsPicker.filtered,
  isFetchingData: state.appStatus.isFetchingData,
  timerInterval: state.appStatus.timerInterval,
});

export default connect(mapStateToProps)(portfolioSymbolsPicker);
