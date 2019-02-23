import React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button } from 'react-bootstrap';
import { updatePeriod } from '../actions/periodController';

const PeriodController = ({ period, dispatch }) => {
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
    </div>
  );
};

const mapStateToProps = state => ({
  period: state.periodController.period,
});

export default connect(mapStateToProps)(PeriodController);
