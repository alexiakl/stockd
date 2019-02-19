import React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button } from 'react-bootstrap';
import { updatePeriod } from '../actions/periodController';

const mapStateToProps = state => ({
  period: state.periodController.period,
});

const PeriodController = ({ period, dispatch }) => {
  let [onem, threem, sixm, ytd, oney, twoy, fivey] = [
    'outline-secondary',
    'outline-secondary',
    'outline-secondary',
    'outline-secondary',
    'outline-secondary',
    'outline-secondary',
    'outline-secondary',
  ];
  switch (period) {
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
    <div className="periodButtons">
      <ButtonGroup aria-label="Period">
        <Button
          variant={onem}
          size="sm"
          onClick={() => dispatch(updatePeriod('1m'))}
        >
          1 month
        </Button>
        <Button
          variant={threem}
          size="sm"
          onClick={() => dispatch(updatePeriod('3m'))}
        >
          3 months
        </Button>
        <Button
          variant={sixm}
          size="sm"
          onClick={() => dispatch(updatePeriod('6m'))}
        >
          6 months
        </Button>
        <Button
          variant={ytd}
          size="sm"
          onClick={() => dispatch(updatePeriod('ytd'))}
        >
          YTD
        </Button>
        <Button
          variant={oney}
          size="sm"
          onClick={() => dispatch(updatePeriod('1y'))}
        >
          1 year
        </Button>
        <Button
          variant={twoy}
          size="sm"
          onClick={() => dispatch(updatePeriod('2y'))}
        >
          2 years
        </Button>
        <Button
          variant={fivey}
          size="sm"
          onClick={() => dispatch(updatePeriod('5y'))}
        >
          5 years
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default connect(mapStateToProps)(PeriodController);
