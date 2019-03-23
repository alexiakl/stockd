import React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button, Dropdown, SplitButton } from 'react-bootstrap';
import { updatePeriod } from '../actions/periodController';
import { fireTimer } from '../actions/symbolsData';
import { setTimerInterval } from '../actions/appStatus';
import { FIVE_MINS, TEN_MINS, FIFTEEN_MINS, ONE_HOUR } from '../constants';

const PeriodController = ({
  period,
  isFetchingData,
  timerInterval,
  dispatch,
}) => {
  let [oned, fived, onem, threem, sixm, ytd, oney, twoy, fivey] = [
    'outline-secondary',
    'outline-secondary',
    'outline-secondary',
    'outline-secondary',
    'outline-secondary',
    'outline-secondary',
    'outline-secondary',
    'outline-secondary',
    'outline-secondary',
  ];
  switch (period) {
    case '1d':
      oned = 'secondary';
      break;
    case '5d':
      fived = 'secondary';
      break;
    case '1m':
      onem = 'secondary';
      break;
    case '3m':
      threem = 'secondary';
      break;
    case '6m':
      sixm = 'secondary';
      break;
    case 'ytd':
      ytd = 'secondary';
      break;
    case '1y':
      oney = 'secondary';
      break;
    case '2y':
      twoy = 'secondary';
      break;
    case '5y':
      fivey = 'secondary';
      break;
    default:
      // code block
      break;
  }

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
    <div className="period-buttons">
      <ButtonGroup aria-label="Period">
        <Button
          className="period-button"
          variant={oned}
          size="sm"
          onClick={() => dispatch(updatePeriod('1d'))}
        >
          1d
        </Button>
        <Button
          className="period-button"
          variant={fived}
          size="sm"
          onClick={() => dispatch(updatePeriod('5d'))}
        >
          5d
        </Button>
        <Button
          className="period-button"
          variant={onem}
          size="sm"
          onClick={() => dispatch(updatePeriod('1m'))}
        >
          1m
        </Button>
        <Button
          className="period-button"
          variant={threem}
          size="sm"
          onClick={() => dispatch(updatePeriod('3m'))}
        >
          3m
        </Button>
        <Button
          className="period-button"
          variant={sixm}
          size="sm"
          onClick={() => dispatch(updatePeriod('6m'))}
        >
          6m
        </Button>
        <Button
          className="period-button"
          variant={ytd}
          size="sm"
          onClick={() => dispatch(updatePeriod('ytd'))}
        >
          YTD
        </Button>
        <Button
          className="period-button"
          variant={oney}
          size="sm"
          onClick={() => dispatch(updatePeriod('1y'))}
        >
          1y
        </Button>
        <Button
          className="period-button"
          variant={twoy}
          size="sm"
          onClick={() => dispatch(updatePeriod('2y'))}
        >
          2y
        </Button>
        <Button
          className="period-button"
          variant={fivey}
          size="sm"
          onClick={() => dispatch(updatePeriod('5y'))}
        >
          5y
        </Button>
      </ButtonGroup>
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
        <Dropdown.Item onClick={() => dispatch(setTimerInterval(FIFTEEN_MINS))}>
          Every 15 Mins
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => dispatch(setTimerInterval(ONE_HOUR))}>
          Every 1 Hour
        </Dropdown.Item>
      </SplitButton>
    </div>
  );
};

const mapStateToProps = state => ({
  period: state.periodController.period,
  isFetchingData: state.appStatus.isFetchingData,
  timerInterval: state.appStatus.timerInterval,
});

export default connect(mapStateToProps)(PeriodController);
