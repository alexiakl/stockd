import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Form, Badge, Button } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import {
  addSymbolRecord,
  removeSymbolRecord,
  setFees,
  setQuantity,
  setUnitPrice,
  setBuy,
} from '../actions/portfolio';
import runQuery from '../controllers/portfolioController';
import 'react-confirm-alert/src/react-confirm-alert.css';
import sync from '../static/images/sync.svg';

class PortfolioComponent extends Component {
  constructor() {
    super();

    this.state = {
      expandedRows: [],
    };
  }

  componentDidMount() {
    const { data, dispatch } = this.props;

    const symbols = [];
    if (data) {
      Object.keys(data).forEach(symbol => {
        symbols.push(symbol);
      });
      runQuery(symbols, dispatch);
    }
  }

  handleRowClick(rowId) {
    const { expandedRows } = this.state;
    const isRowCurrentlyExpanded = expandedRows.includes(rowId);

    const newExpandedRows = isRowCurrentlyExpanded
      ? expandedRows.filter(id => id !== rowId)
      : expandedRows.concat(rowId);

    this.setState({ expandedRows: newExpandedRows });
  }

  calculatePortfolioQuotes() {
    const { data, quotes, theme } = this.props;

    const totals = [];
    const profits = [];
    let total = 0;
    if (data) {
      Object.keys(data).forEach(symbol => {
        profits[symbol] = [];
        const item = data[symbol];
        let b = 0;
        let s = 0;
        item.records.forEach((record, index) => {
          if (quotes.data && quotes.data[symbol]) {
            b += record.quantity * record.unitPrice + record.fees;
            s +=
              record.quantity * quotes.data[symbol].quote.latestPrice -
              record.fees;
            profits[symbol][index] = (s - b).toFixed(2);
          }
        });
        const result = s - b;
        totals[symbol] = result.toFixed(2);
        total += parseFloat(result.toFixed(2));
      });
    }

    return { total, totals, profits };
  }

  updateQuantity(symbol, index, quantity) {
    const { dispatch } = this.props;
    dispatch(setQuantity({ symbol, index, quantity }));
  }

  updateFees(symbol, index, fees) {
    const { dispatch } = this.props;
    dispatch(setFees({ symbol, index, fees }));
  }

  updateBuy(symbol, index, buy) {
    const { dispatch } = this.props;
    dispatch(setBuy({ symbol, index, buy }));
  }

  updateUnitPrice(symbol, index, unitPrice) {
    const { dispatch } = this.props;
    dispatch(setUnitPrice({ symbol, index, unitPrice }));
  }

  addRecord(symbol) {
    const { dispatch } = this.props;
    this.handleRowClick(symbol);
    dispatch(addSymbolRecord(symbol));
  }

  confirmRemoval(symbol, index) {
    confirmAlert({
      title: 'Are you sure?',
      message: 'You cannot undo this action.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const { dispatch } = this.props;
            dispatch(removeSymbolRecord({ symbol, index }));
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  }

  renderSubItem(item, totalObject, index) {
    let totalClassName = 'green';
    if (totalObject.profits[item.symbol][index] < 0) {
      totalClassName = 'red';
    }
    let buyVariant = 'light';
    let sellVariant = 'light';
    if (item.buy) {
      buyVariant = 'warning';
    } else {
      sellVariant = 'warning';
    }
    return (
      <tr key={`row-expanded-${item.symbol}-${index}`}>
        <td>
          <Badge
            variant={buyVariant}
            onClick={() => this.updateBuy(item.symbol, index, true)}
          >
            bought
          </Badge>{' '}
          <Badge
            variant={sellVariant}
            onClick={() => this.updateBuy(item.symbol, index, false)}
          >
            sold
          </Badge>
        </td>
        <td>{item.quantity}</td>
        <td>{item.unitPrice}</td>
        <td>{item.fees}</td>
        <td className={totalClassName}>
          {totalObject.profits[item.symbol][index]}
        </td>
        <td className="center">
          <Badge
            variant="warning"
            className="action"
            onClick={() => this.confirmRemoval(item.symbol, index)}
          >
            -
          </Badge>
        </td>
      </tr>
    );
  }

  renderItem(item, totalObject) {
    let totalClassName = 'green';
    if (totalObject.totals[item.symbol] < 0) {
      totalClassName = 'red';
    }
    const { expandedRows } = this.state;
    const clickCallback = () => this.handleRowClick(item.symbol);
    const itemRows = [
      <tr key={`row-data-${item.symbol}`}>
        <td>
          <Button size="sm" onClick={clickCallback} variant="secondary">
            {item.symbol} <Badge variant="light">{item.records.length}</Badge>
          </Button>
        </td>
        <td />
        <td />
        <td />
        <td className={totalClassName}>{totalObject.totals[item.symbol]}</td>
        <td className="center">
          <Badge
            key={item.symbol}
            variant="info"
            className="action"
            onClick={() => this.addRecord(item.symbol)}
          >
            +
          </Badge>
        </td>
      </tr>,
    ];

    let allSubItemRows = [];
    item.records.forEach((record, index) => {
      const perItemRows = this.renderSubItem(record, totalObject, index);
      allSubItemRows = allSubItemRows.concat(perItemRows);
    });

    if (expandedRows.includes(item.symbol)) {
      itemRows.push(allSubItemRows);
    }

    return itemRows;
  }

  render() {
    const { data, theme, dispatch } = this.props;
    let allItemRows = [];

    const symbols = [];
    if (data) {
      const totalObject = this.calculatePortfolioQuotes();
      Object.keys(data).forEach(symbol => {
        symbols.push(symbol);
        const record = data[symbol];
        const perItemRows = this.renderItem(record, totalObject);
        allItemRows = allItemRows.concat(perItemRows);
      });
    }

    return (
      <React.Fragment>
        <Table hover variant={theme}>
          <thead>
            <tr>
              <th>
                <Badge
                  className="sync-badge"
                  variant="info"
                  onClick={() => runQuery(symbols, dispatch)}
                >
                  sync
                </Badge>
              </th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Fees</th>
              <th>Profit</th>
              <th className="th-small" />
            </tr>
          </thead>
          <tbody>{allItemRows}</tbody>
        </Table>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  data: state.portfolio.data,
  quotes: state.portfolio.quotes,
  theme: state.appStatus.theme,
});

export default connect(mapStateToProps)(PortfolioComponent);
