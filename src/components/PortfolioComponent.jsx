import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Form,
  Badge,
  Button,
  OverlayTrigger,
  Popover,
  Tabs,
  Tab,
} from 'react-bootstrap';
import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert';
import {
  addSymbolRecord,
  updateSymbolRecord,
  removeSymbolRecord,
  addPortfolioRecord,
  setActivePortfolio,
} from '../actions/portfolio';
import runQuery from '../controllers/portfolioController';
import { resetTimer, calibrateTimer } from '../controllers/liveController';
import { getPortfolio } from '../utils/utils';
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
      readOnly: true,
      index: -1,
      transactionSymbol: '',
      isBuy: true,
      addQuantity: undefined,
      addUnitPrice: undefined,
      addFees: undefined,
      addDate: undefined,
      sellQuantity: undefined,
      sellUnitPrice: undefined,
      sellFees: undefined,
      sellDate: undefined,
    };
  }

  componentDidMount() {
    const { data, activePortfolio, dispatch } = this.props;
    getPortfolio(dispatch);
    Modal.setAppElement('body');

    const symbols = [];
    if (data && data.length > 0) {
      Object.keys(data[activePortfolio].portfolio).forEach(symbol => {
        symbols.push(symbol);
      });
      runQuery(symbols, dispatch);
    } else {
      calibrateTimer(this.props, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      openModalWithSymbol: nextOpenModalWithSymbol,
      data: nextData,
      fireTimer: nextFireTimer,
      timerInterval: nextTimerInterval,
      activePortfolio: nextActivePortfolio,
    } = nextProps;
    const { modalIsOpen } = this.state;
    const {
      dispatch,
      data,
      activePortfolio,
      fireTimer,
      timerInterval,
    } = this.props;

    if (timerInterval !== nextTimerInterval) {
      this.props = nextProps;
      calibrateTimer(this.props);
    }

    if (nextData) {
      if (
        JSON.stringify(nextData[activePortfolio].portfolio) !==
          JSON.stringify(data[activePortfolio].portfolio) ||
        fireTimer !== nextFireTimer ||
        activePortfolio !== nextActivePortfolio
      ) {
        const symbols = [];
        if (nextData && nextData.length > 0) {
          Object.keys(nextData[nextActivePortfolio].portfolio).forEach(
            symbol => {
              symbols.push(symbol);
            },
          );
        }
        runQuery(symbols, dispatch);
      }
    }

    if (nextOpenModalWithSymbol.length > 0) {
      dispatch(addPortfolioRecord(''));
      if (!modalIsOpen) {
        const item = { symbol: nextOpenModalWithSymbol };
        this.openModal(item);
      }
    }
  }

  componentWillUnmount() {
    const { timerId } = this.props;
    resetTimer(timerId);
  }

  today = () => {
    const today = new Date();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();

    return [
      today.getFullYear(),
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd,
    ].join('-');
  };

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  openModal(item, readOnly = false, sell = false, index = -1, ref) {
    const {
      symbol,
      quantity,
      unitPrice,
      fees,
      date,
      squantity,
      sunitPrice,
      sfees,
      sdate,
    } = item;
    if (ref) {
      ref.current.hide();
    }
    let isBuy = true;
    if (sell) {
      isBuy = false;
    }

    this.setState({
      transactionSymbol: symbol,
      modalIsOpen: true,
      readOnly,
      index,
      isBuy,
      addQuantity: quantity,
      addUnitPrice: unitPrice,
      addFees: fees,
      addDate: date,
      sellQuantity: squantity,
      sellUnitPrice: sunitPrice,
      sellFees: sfees,
      sellDate: sdate,
    });
  }

  handleRowClick(rowId) {
    const { expandedRows } = this.state;
    const isRowCurrentlyExpanded = expandedRows.includes(rowId);

    const newExpandedRows = isRowCurrentlyExpanded
      ? expandedRows.filter(id => id !== rowId)
      : expandedRows.concat(rowId);

    this.setState({ expandedRows: newExpandedRows });
  }

  addTransactionRecord(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    let {
      addDate: date,
      addFees: fees,
      sellDate: sdate,
      sellFees: sfees,
    } = this.state;
    const {
      transactionSymbol: symbol,
      isBuy: buy,
      addUnitPrice: unitPrice,
      addQuantity: quantity,
      sellUnitPrice: sunitPrice,
      sellQuantity: squantity,
      index,
    } = this.state;

    if (!date) {
      date = this.today();
    }
    if (!sdate) {
      sdate = this.today();
    }
    if (!fees) {
      fees = 0;
    }
    if (!sfees) {
      sfees = 0;
    }
    if (!unitPrice || !quantity) {
      return;
    }
    if (!buy) {
      if (!sunitPrice || !squantity) {
        return;
      }
    }

    const record = {
      symbol,
      buy,
      fees,
      unitPrice,
      quantity,
      date,
      sfees,
      sunitPrice,
      squantity,
      sdate,
      index,
    };
    this.setState({ modalIsOpen: false });
    if (buy) {
      dispatch(addSymbolRecord(record));
      this.handleRowClick(symbol);
    } else {
      const newQuantity = quantity - squantity;
      if (newQuantity < 0) {
        return;
      }
      record.quantity = newQuantity;
      dispatch(updateSymbolRecord(record));
      dispatch(addSymbolRecord(record));
    }
  }

  calculatePortfolioQuotes() {
    const { data, quotes, activePortfolio } = this.props;

    const totals = [];
    const quantities = [];
    const unitPrices = [];
    const profits = [];
    let total = 0;
    if (data && data.length > 0 && data[activePortfolio]) {
      Object.keys(data[activePortfolio].portfolio).forEach(symbol => {
        profits[symbol] = [];
        const item = data[activePortfolio].portfolio[symbol];
        let symbolbuy = 0;
        let symbolsell = 0;
        let symbolquantity = 0;
        let symbolunitprices = 0;
        if (item.records) {
          item.records.forEach((record, index) => {
            if (quotes.data && quotes.data[symbol]) {
              let transactionbuy =
                record.quantity * record.unitPrice + record.fees;
              let transactionsell =
                record.quantity * quotes.data[symbol].quote.latestPrice -
                record.fees;
              if (!record.buy) {
                transactionbuy =
                  record.squantity * record.unitPrice + record.fees;
                transactionsell =
                  record.squantity * record.sunitPrice - record.sfees;
              }
              symbolbuy += transactionbuy;
              symbolsell += transactionsell;

              profits[symbol][index] = (
                transactionsell - transactionbuy
              ).toFixed(2);
              symbolquantity += record.quantity;
              symbolunitprices += record.unitPrice;
            }
          });
          totals[symbol] = (symbolsell - symbolbuy).toFixed(2);
          quantities[symbol] = symbolquantity;
          unitPrices[symbol] = (symbolunitprices / item.records.length).toFixed(
            2,
          );
          total += parseFloat((symbolsell - symbolbuy).toFixed(2));
        }
      });
    }

    return { total, totals, profits, quantities, unitPrices };
  }

  confirmRemoval(e, symbol, index) {
    e.preventDefault();
    this.closeModal();
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
    if (!totalObject.profits[item.symbol]) {
      return '';
    }
    if (totalObject.profits[item.symbol][index] < 0) {
      totalClassName = 'red';
    }

    let transaction = 'SOLD';
    let variant = 'info';
    let quantity = item.squantity;
    let unitPrice = item.sunitPrice;
    if (item.buy) {
      transaction = 'ACTIVE';
      variant = 'warning';
      ({ quantity, unitPrice } = item);
    }

    const actionsOverlayRef = React.createRef();
    const popover = (
      <Popover id="popover-basic">
        <div className="popover-actions">
          <Badge
            variant="warning"
            className="action"
            onClick={() =>
              this.openModal(item, true, !item.buy, index, actionsOverlayRef)
            }
          >
            INFO
          </Badge>
          {item.buy && (
            <Badge
              variant="info"
              className="action"
              onClick={() =>
                this.openModal(item, false, true, index, actionsOverlayRef)
              }
            >
              SELL
            </Badge>
          )}
        </div>
      </Popover>
    );
    return (
      <tr key={`row-expanded-${item.symbol}-${index}`}>
        <td>
          <Badge variant={variant}>{transaction}</Badge>
        </td>
        <td>{quantity}</td>
        <td>{unitPrice.toFixed(2)}</td>
        <td className={totalClassName}>
          {totalObject.profits[item.symbol][index]}
        </td>
        <td className="center">
          <OverlayTrigger
            trigger="click"
            placement="left"
            overlay={popover}
            rootClose
            ref={actionsOverlayRef}
          >
            <Badge variant="warning" className="action">
              ...
            </Badge>
          </OverlayTrigger>
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
        <td>{totalObject.quantities[item.symbol]}</td>
        <td>{totalObject.unitPrices[item.symbol]}</td>
        <td className={totalClassName}>{totalObject.totals[item.symbol]}</td>
        <td className="center">
          <Badge
            key={item.symbol}
            variant="info"
            className="action"
            onClick={() => this.openModal(item)}
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
    const {
      modalIsOpen,
      transactionSymbol,
      addQuantity,
      addFees,
      addUnitPrice,
      addDate,
      sellQuantity,
      sellUnitPrice,
      sellFees,
      sellDate,
      isBuy,
      readOnly,
      index,
    } = this.state;

    const tabs = [];

    if (data && data.length > 0) {
      data.forEach(element => {
        let allItemRows = [];
        const totalObject = this.calculatePortfolioQuotes();
        Object.keys(element.portfolio).forEach(symbol => {
          const record = element.portfolio[symbol];
          const perItemRows = this.renderItem(record, totalObject);
          allItemRows = allItemRows.concat(perItemRows);
        });
        const key = `tab-${element.id}`;
        let title = element.name;
        if (!title) {
          title = 'Untitled';
        }

        tabs.push(
          <Tab key={key} eventKey={key} title={title}>
            <Table hover variant={theme}>
              <thead>
                <tr>
                  <th />
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Profit</th>
                  <th className="th-small" />
                </tr>
              </thead>
              <tbody>{allItemRows}</tbody>
            </Table>
          </Tab>,
        );
      });
    }

    let transactionType = 'Buy';
    let unitPrice = addUnitPrice;
    let date = addDate;
    let quantity = addQuantity;
    let fees = addFees;
    let unitPriceDesc = '';
    let feesDesc = '';
    let dateDesc = '';
    if (!isBuy) {
      transactionType = 'Sell';
      unitPrice = sellUnitPrice;
      date = sellDate;
      quantity = sellQuantity;
      fees = sellFees;
      unitPriceDesc = ` (on purchase: ${addUnitPrice})`;
      feesDesc = ` (Purchase fees: ${addFees})`;
      dateDesc = ` (Purchased: ${addDate})`;
    }

    return (
      <React.Fragment>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => this.closeModal()}
          style={modalStyles}
          contentLabel="Transaction"
        >
          <h2>
            {transactionSymbol} {transactionType} Transaction
          </h2>
          <Form className={theme}>
            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                defaultValue={quantity}
                disabled={readOnly}
                type="number"
                placeholder="Number of shares"
                onChange={evt => {
                  if (isBuy) {
                    this.setState({ addQuantity: evt.target.value });
                  } else {
                    this.setState({ sellQuantity: evt.target.value });
                  }
                }}
              />
            </Form.Group>

            <Form.Group controlId="formUnitPrice">
              <Form.Label>Unit Price{unitPriceDesc}</Form.Label>
              <Form.Control
                defaultValue={unitPrice}
                disabled={readOnly}
                type="number"
                placeholder="Price per share"
                onChange={evt => {
                  if (isBuy) {
                    this.setState({ addUnitPrice: evt.target.value });
                  } else {
                    this.setState({ sellUnitPrice: evt.target.value });
                  }
                }}
              />
            </Form.Group>

            <Form.Group controlId="formFees">
              <Form.Label>Fees{feesDesc}</Form.Label>
              <Form.Control
                defaultValue={fees}
                disabled={readOnly}
                type="number"
                placeholder="Commission, fees or other costs"
                onChange={evt => {
                  if (isBuy) {
                    this.setState({ addFees: evt.target.value });
                  } else {
                    this.setState({ sellFees: evt.target.value });
                  }
                }}
              />
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Date{dateDesc}</Form.Label>
              <Form.Control
                defaultValue={date}
                disabled={readOnly}
                type="date"
                placeholder="Commission, fees or other costs"
                onChange={evt => {
                  if (isBuy) {
                    this.setState({ addDate: evt.target.value });
                  } else {
                    this.setState({ sellDate: evt.target.value });
                  }
                }}
              />
            </Form.Group>

            {!readOnly ? (
              <Button
                variant="outline-info"
                type="submit"
                onClick={e => this.addTransactionRecord(e)}
              >
                {transactionType}
              </Button>
            ) : (
              <Button
                variant="outline-warning"
                type="submit"
                onClick={e => this.confirmRemoval(e, transactionSymbol, index)}
              >
                Delete
              </Button>
            )}
          </Form>
        </Modal>
        <Tabs onSelect={e => dispatch(setActivePortfolio(e.split('-')[1] - 1))}>
          {tabs}
          <Tab key="new-portfolio" title="..." onClick={() => {}} />
        </Tabs>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  data: state.portfolio.data,
  openModalWithSymbol: state.portfolio.openModalWithSymbol,
  quotes: state.portfolio.quotes,
  activePortfolio: state.portfolio.activePortfolio,
  theme: state.appStatus.theme,
  fireTimer: state.symbolsData.fireTimer,
  timerInterval: state.appStatus.timerInterval,
  timerId: state.appStatus.timerId,
});

export default connect(mapStateToProps)(PortfolioComponent);
