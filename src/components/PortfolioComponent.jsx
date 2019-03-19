import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Form, Badge, Button } from 'react-bootstrap';
import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert';
import { addSymbolRecord, removeSymbolRecord } from '../actions/portfolio';
import runQuery from '../controllers/portfolioController';
import 'react-confirm-alert/src/react-confirm-alert.css';

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

class PortfolioComponent extends Component {
  constructor() {
    super();

    this.state = {
      expandedRows: [],
      modalIsOpen: false,
      addSymbol: '',
      addBuy: true,
      addQuantity: 0,
      addUnitPrice: 0,
      addFees: 0,
      addDate: new Date(),
    };
  }

  componentDidMount() {
    Modal.setAppElement('body');
    const { data, dispatch } = this.props;

    const symbols = [];
    if (data) {
      Object.keys(data).forEach(symbol => {
        symbols.push(symbol);
      });
      runQuery(symbols, dispatch);
    }
  }

  today = () => {
    const today = new Date();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();

    return [
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd,
      today.getFullYear(),
    ].join('/');
  };

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  openModal(symbol) {
    this.setState({ addSymbol: symbol, modalIsOpen: true });
  }

  handleRowClick(rowId) {
    const { expandedRows } = this.state;
    const isRowCurrentlyExpanded = expandedRows.includes(rowId);

    const newExpandedRows = isRowCurrentlyExpanded
      ? expandedRows.filter(id => id !== rowId)
      : expandedRows.concat(rowId);

    this.setState({ expandedRows: newExpandedRows });
  }

  addTransactionRecord() {
    const { dispatch } = this.props;
    let { addDate: date, addFees: fees } = this.state;
    const {
      addSymbol: symbol,
      addBuy: buy,
      addUnitPrice: unitPrice,
      addQuantity: quantity,
    } = this.state;
    this.handleRowClick(symbol);

    if (!date) {
      date = this.today();
    }
    if (!fees) {
      fees = 0;
    }
    if (!unitPrice || !quantity) {
      return;
    }

    const record = {
      symbol,
      buy,
      fees,
      unitPrice,
      quantity,
      date,
    };
    this.setState({ modalIsOpen: false });
    dispatch(addSymbolRecord(record));
  }

  calculatePortfolioQuotes() {
    const { data, quotes } = this.props;

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

    let transaction = 'sell';
    if (item.buy) {
      transaction = 'buy';
    }
    return (
      <tr key={`row-expanded-${item.symbol}-${index}`}>
        <td>
          <Badge variant="warning">{transaction}</Badge>
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
            onClick={() => this.openModal(item.symbol)}
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
    const { modalIsOpen, addSymbol } = this.state;

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
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => this.closeModal()}
          style={modalStyles}
          contentLabel="Add transaction"
        >
          <h2>{addSymbol} Add Transaction</h2>
          <Form className={theme}>
            <Form.Group controlId="transactionType">
              <Form.Label>Type</Form.Label>
              <Form.Check
                defaultChecked
                name="transactionType"
                id="transactionTypeBuy"
                type="radio"
                label="Buy"
                onClick={() => this.setState({ addBuy: true })}
              />
              <Form.Check
                name="transactionType"
                id="transactionTypeSell"
                type="radio"
                label="Sell"
                onClick={() => this.setState({ addBuy: false })}
              />
            </Form.Group>

            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Number of shares"
                onChange={evt =>
                  this.setState({ addQuantity: evt.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formUnitPrice">
              <Form.Label>Unit Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Price per share"
                onChange={evt =>
                  this.setState({ addUnitPrice: evt.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formFees">
              <Form.Label>Fees</Form.Label>
              <Form.Control
                type="number"
                placeholder="Commission, fees or other costs"
                onChange={evt => this.setState({ addFees: evt.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Commission, fees or other costs"
                onChange={evt => this.setState({ addDate: evt.target.value })}
              />
            </Form.Group>

            <Button
              variant="outline-info"
              type="submit"
              onClick={() => this.addTransactionRecord()}
            >
              Add
            </Button>
          </Form>
        </Modal>
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
