/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Table,
  Form,
  Badge,
  Button,
  OverlayTrigger,
  Popover,
  Tabs,
  Tab,
  InputGroup,
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
import { updateOrder } from '../actions/symbolsPicker';
import {
  runQuery,
  getPortfolio,
  updatePortfolioName,
  deletePortfolio,
  addPortfolio,
  calculatePortfolioQuotes,
} from '../controllers/portfolioController';
import { resetTimer, calibrateTimer } from '../controllers/chartsController';
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
      newPortfolioName: '',
      modalIsOpen: false,
      readOnly: true,
      index: -1,
      transactionSymbol: '',
      isBuy: true,
      addQuantity: undefined,
      addUnitPrice: undefined,
      addOriginalUnitPrice: undefined,
      addDate: undefined,
      sellQuantity: undefined,
      sellUnitPrice: undefined,
      fees: undefined,
      sellDate: undefined,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    getPortfolio(dispatch);
    Modal.setAppElement('body');
    calibrateTimer(this.props, false);
  }

  componentWillReceiveProps(nextProps) {
    const {
      openModalWithSymbol: nextOpenModalWithSymbol,
      data: nextData,
      fireTimer: nextFireTimer,
      timerInterval: nextTimerInterval,
      activePortfolio: nextActivePortfolio,
      quotes: nextQuotes,
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

    let shouldRunQuery = false;
    const symbols = [];
    if (nextData && nextData.length > 0 && nextData[nextActivePortfolio]) {
      Object.keys(nextData[nextActivePortfolio].portfolio).forEach(symbol => {
        symbols.push(symbol);
        dispatch(updateOrder(symbols));
        if (!nextQuotes[symbol]) {
          shouldRunQuery = true;
        }
      });
    }

    if (nextData && symbols.length > 0) {
      if (
        !data ||
        !data[activePortfolio] ||
        JSON.stringify(nextData[activePortfolio].portfolio) !==
          JSON.stringify(data[activePortfolio].portfolio) ||
        fireTimer !== nextFireTimer ||
        shouldRunQuery
      ) {
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

  validate = date => {
    let dateArr = date.split('-');
    if (dateArr.length !== 3) {
      dateArr = date.split('/');
      if (dateArr.length !== 3) {
        return false;
      }
    }

    return true;
  };

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  openModal(item, readOnly = false, sell = false, index = -1, ref) {
    const {
      symbol,
      quantity,
      unitPrice,
      originalUnitPrice,
      date,
      squantity,
      sunitPrice,
      fees,
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
      addOriginalUnitPrice: originalUnitPrice,
      addDate: date,
      sellQuantity: squantity,
      sellUnitPrice: sunitPrice,
      fees,
      sellDate: sdate,
    });
  }

  handleRowClick(prefix, rowId, expand = false) {
    const { expandedRows } = this.state;
    const key = `${prefix}${rowId}`;
    const isRowCurrentlyExpanded = expandedRows.includes(key);
    if (expand && isRowCurrentlyExpanded) {
      return;
    }

    const newExpandedRows = isRowCurrentlyExpanded
      ? expandedRows.filter(id => id !== key)
      : expandedRows.concat(key);

    this.setState({ expandedRows: newExpandedRows });
  }

  tabSelected(e) {
    const { data, dispatch } = this.props;
    this.setState({ newPortfolioName: '' });
    if (e !== 'new-portfolio') {
      const activePortfolio = e.split('-')[1];

      const symbols = [];
      if (data && data.length > 0 && data[activePortfolio]) {
        Object.keys(data[activePortfolio].portfolio).forEach(symbol => {
          symbols.push(symbol);
        });
      }
      dispatch(updateOrder(symbols));
      dispatch(setActivePortfolio(activePortfolio));
    }
  }

  addPortfolio(e) {
    e.preventDefault();
    const { newPortfolioName } = this.state;
    const { dispatch } = this.props;

    addPortfolio(newPortfolioName, dispatch);
  }

  applyPortfolio(e) {
    e.preventDefault();
    const { newPortfolioName } = this.state;
    const { dispatch, data, activePortfolio } = this.props;

    updatePortfolioName(data, activePortfolio, newPortfolioName, dispatch);
  }

  deletePortfolio(e) {
    e.preventDefault();
    const { dispatch, data, activePortfolio } = this.props;

    confirmAlert({
      title: 'Are you sure?',
      message: 'You cannot undo this action.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deletePortfolio(data, activePortfolio, dispatch);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  }

  addTransactionRecord(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    let {
      addDate: date,
      addOriginalUnitPrice: originalUnitPrice,
      sellDate: sdate,
      fees,
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
    if (!this.validate(date)) {
      toast.warn('Wrong date format', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
      });
      return;
    }
    if (!this.validate(sdate)) {
      toast.warn('Wrong date format', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
      });
      return;
    }
    if (!originalUnitPrice) {
      originalUnitPrice = 0;
    }
    if (!fees) {
      fees = 0;
    }
    if (!unitPrice || !quantity) {
      toast.warn('Please provide unit price and quantity', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
      });
      return;
    }
    if (!buy) {
      if (!sunitPrice || !squantity) {
        toast.warn('Please provide unit price and quantity', {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        });
        return;
      }
    }

    const record = {
      symbol,
      buy,
      originalUnitPrice,
      unitPrice,
      quantity,
      date,
      fees,
      sunitPrice,
      squantity,
      sdate,
      index,
    };
    this.setState({ modalIsOpen: false });
    if (buy) {
      dispatch(addSymbolRecord(record));
      this.handleRowClick('buy', symbol, true);
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

  confirmRemoval(e, symbol, index, ref) {
    e.preventDefault();
    ref.current.hide();
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

  renderSubItem(item, totalObject, index, isBuy) {
    let totalClassName = 'green';
    let profit = totalObject.active.profits[item.symbol];
    if (!isBuy) {
      profit = totalObject.sold.profits[item.symbol];
    }
    if (!profit) {
      return '';
    }
    let itemProfit = totalObject.active.profits[item.symbol][index];
    let itemProfitPercentage =
      totalObject.active.profitsPercentage[item.symbol][index];
    if (!isBuy) {
      itemProfit = totalObject.sold.profits[item.symbol][index];
      itemProfitPercentage =
        totalObject.sold.profitsPercentage[item.symbol][index];
    }
    if (itemProfit < 0) {
      totalClassName = 'red';
    }

    let transaction = 'SOLD';
    let variant = 'info';
    let quantity = item.squantity;
    let unitPrice = item.sunitPrice - item.fees / item.squantity;
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
          <Badge
            variant="danger"
            className="action"
            onClick={e =>
              this.confirmRemoval(e, item.symbol, index, actionsOverlayRef)
            }
          >
            DELETE
          </Badge>
        </div>
      </Popover>
    );
    return (
      <tr key={`row-expanded-${item.symbol}-${index}`}>
        <td
          onClick={() => {
            this.openModal(item, true, !item.buy, index, actionsOverlayRef);
          }}
        >
          <Badge variant={variant}>{transaction}</Badge>
        </td>
        <td
          onClick={() => {
            this.openModal(item, true, !item.buy, index, actionsOverlayRef);
          }}
        >
          {quantity}
        </td>
        <td
          onClick={() => {
            this.openModal(item, true, !item.buy, index, actionsOverlayRef);
          }}
        >
          {unitPrice.toFixed(2)}
        </td>
        <td
          onClick={() => {
            this.openModal(item, true, !item.buy, index, actionsOverlayRef);
          }}
          className={totalClassName}
        >
          {itemProfit}
          <span className="profit-percentage">{itemProfitPercentage}%</span>
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

  renderItem(item, totalObject, isBuy) {
    const { quotes } = this.props;

    let countBuy = 0;
    let countSell = 0;
    item.records.forEach(record => {
      if (record.buy === isBuy) {
        countBuy += 1;
      } else {
        countSell += 1;
      }
    });

    let latestPrice = quotes[item.symbol]
      ? quotes[item.symbol].quote.latestPrice
      : '';
    let symbolTotal = totalObject.active.totals[item.symbol];
    let symbolTotalPercentage =
      totalObject.active.totalsPercentage[item.symbol];
    let symbolQuantities = totalObject.active.quantities[item.symbol];
    let symbolUnitPrices = totalObject.active.unitPrices[item.symbol];
    let prefix = 'sell';
    let count = countBuy;
    if (!isBuy) {
      prefix = 'buy';
      count = countSell;
      latestPrice = '';
      symbolTotal = totalObject.sold.totals[item.symbol];
      symbolTotalPercentage = totalObject.sold.totalsPercentage[item.symbol];
      symbolQuantities = totalObject.sold.quantities[item.symbol];
      symbolUnitPrices = totalObject.sold.unitPrices[item.symbol];
    }

    let totalClassName = 'green';
    if (symbolTotal < 0) {
      totalClassName = 'red';
    }
    const { expandedRows } = this.state;
    const clickCallback = () => this.handleRowClick(prefix, item.symbol);
    const itemRows = [
      <tr key={`row-data-${item.symbol}`} onClick={clickCallback}>
        <td>
          <Button size="sm" onClick={clickCallback} variant="secondary">
            {item.symbol} <Badge variant="light">{count}</Badge>
          </Button>
        </td>
        <td>{symbolQuantities}</td>
        <td>
          {symbolUnitPrices}
          <br />
          <span className={totalClassName}>{latestPrice}</span>
        </td>
        <td className={totalClassName}>
          {symbolTotal}
          <span className="profit-percentage">{symbolTotalPercentage}%</span>
        </td>
        <td className="center">
          {isBuy && (
            <Badge
              key={item.symbol}
              variant="info"
              className="action"
              onClick={() => this.openModal(item)}
            >
              +
            </Badge>
          )}
        </td>
      </tr>,
    ];

    let allSubItemRows = [];
    item.records.forEach((record, index) => {
      if (record.buy === isBuy) {
        const perItemRows = this.renderSubItem(
          record,
          totalObject,
          index,
          isBuy,
        );
        allSubItemRows = allSubItemRows.concat(perItemRows);
      }
    });

    if (expandedRows.includes(`${prefix}${item.symbol}`)) {
      itemRows.push(allSubItemRows);
    }

    return itemRows;
  }

  render() {
    const { data, theme, activePortfolio, quotes } = this.props;
    const {
      modalIsOpen,
      transactionSymbol,
      addQuantity,
      addOriginalUnitPrice,
      addUnitPrice,
      addDate,
      sellQuantity,
      sellUnitPrice,
      fees,
      sellDate,
      isBuy,
      readOnly,
    } = this.state;

    const tabs = [];

    if (data && data.length > 0) {
      const totalObject = calculatePortfolioQuotes(
        data,
        quotes,
        activePortfolio,
      );
      data.forEach((element, index) => {
        let allActiveItemRows = [];
        Object.keys(element.portfolio).forEach(symbol => {
          const record = element.portfolio[symbol];
          let hasBuy = false;
          record.records.forEach(item => {
            if (item.buy) {
              hasBuy = true;
            }
          });
          if (hasBuy) {
            const perItemRows = this.renderItem(record, totalObject, true);
            allActiveItemRows = allActiveItemRows.concat(perItemRows);
          }
        });
        let allSoldItemRows = [];
        Object.keys(element.portfolio).forEach(symbol => {
          const record = element.portfolio[symbol];
          let hasSold = false;
          record.records.forEach(item => {
            if (!item.buy) {
              hasSold = true;
            }
          });
          if (hasSold) {
            const perItemRows = this.renderItem(record, totalObject, false);
            allSoldItemRows = allSoldItemRows.concat(perItemRows);
          }
        });
        const key = `tab-${index}`;
        let title = element.name;
        if (!title) {
          title = 'Untitled';
        }

        tabs.push(
          <Tab key={key} eventKey={key} title={title}>
            <div className="div-title">ACTIVE</div>
            <div className="div-sub-title">
              {allActiveItemRows.length > 0
                ? 'Stocks you currently own'
                : 'You did not add any stocks to your portfolio yet'}
            </div>
            {allActiveItemRows.length > 0 && (
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
                <tbody>{allActiveItemRows}</tbody>
              </Table>
            )}
            <div className="div-title">SOLD</div>
            <div className="div-sub-title">
              {allSoldItemRows.length > 0
                ? 'Stocks you already sold'
                : 'You did not sell any stocks yet'}
            </div>
            {allSoldItemRows.length > 0 && (
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
                <tbody>{allSoldItemRows}</tbody>
              </Table>
            )}
            <div className="div-title">SETTINGS</div>
            <Form className="settings-container">
              <InputGroup size="sm" className="mb-3 small-settings">
                <InputGroup.Prepend>
                  <InputGroup.Text id="portfolio-name">Name</InputGroup.Text>
                </InputGroup.Prepend>

                <Form.Control
                  defaultValue={title}
                  aria-label="Name"
                  aria-describedby="portfolio-name"
                  onChange={evt =>
                    this.setState({ newPortfolioName: evt.target.value })
                  }
                />

                <Button
                  size="sm"
                  variant="outline-info"
                  type="submit"
                  onClick={e => this.applyPortfolio(e)}
                >
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="outline-info"
                  type="submit"
                  onClick={e => this.deletePortfolio(e)}
                >
                  Delete
                </Button>
              </InputGroup>
            </Form>
          </Tab>,
        );
      });
    }

    let transactionType = 'Buy';
    let unitPrice = addUnitPrice;
    let date = addDate;
    let quantity = addQuantity;
    let originalUnitPrice = addOriginalUnitPrice;
    let unitPriceDesc = '';
    let unitPriceTitle = 'Unit Price After Fees';
    let opriceOrFeesTitle = 'Unit Price Without Fees';
    let opriceOrFeesPlaceholder = 'Price per share without fees';
    let dateDesc = '';
    const feesPerUnit = parseFloat(unitPrice) - parseFloat(originalUnitPrice);
    let transactionTotalDesc = `Transaction Total: ${parseFloat(unitPrice) *
      parseFloat(quantity)}`;
    let profitDesc = `Estimated Profit = ( Current Price - ${unitPrice} - ${feesPerUnit} ) * ${quantity}`;
    let feesDesc = `Fees Per Unit = ${feesPerUnit}`;
    if (!readOnly) {
      feesDesc = '';
      profitDesc = '';
      transactionTotalDesc = '';
    }
    if (!isBuy) {
      transactionType = 'Sell';
      unitPrice = sellUnitPrice;
      date = sellDate;
      quantity = sellQuantity;
      originalUnitPrice = fees;
      unitPriceDesc = ` (on purchase: ${addUnitPrice})`;
      unitPriceTitle = 'Unit Price';
      opriceOrFeesTitle = 'Fees';
      opriceOrFeesPlaceholder = 'Transaction Fees';
      dateDesc = ` (Purchased: ${addDate})`;
      feesDesc = '';
      profitDesc = `Profit = ( Unit Price - ${addUnitPrice} ) * Quantity - Fees`;
      if (readOnly) {
        transactionTotalDesc = `Transaction Total: ${parseFloat(unitPrice) *
          parseFloat(quantity) -
          parseFloat(fees)}`;
        profitDesc = `Profit = ( ${unitPrice} - ${addUnitPrice} ) * ${quantity} - ${fees}`;
      }
    }
    if (!date) {
      date = this.today();
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
              <Form.Label>
                {unitPriceTitle}
                {unitPriceDesc}
              </Form.Label>
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
              <Form.Label>{opriceOrFeesTitle}</Form.Label>
              <Form.Control
                defaultValue={originalUnitPrice}
                disabled={readOnly}
                type="number"
                placeholder={opriceOrFeesPlaceholder}
                onChange={evt => {
                  if (isBuy) {
                    this.setState({ addOriginalUnitPrice: evt.target.value });
                  } else {
                    this.setState({ fees: evt.target.value });
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
                placeholder="yyyy-mm-dd"
                onChange={evt => {
                  if (isBuy) {
                    this.setState({ addDate: evt.target.value });
                  } else {
                    this.setState({ sellDate: evt.target.value });
                  }
                }}
              />
            </Form.Group>

            {profitDesc.length > 0 && (
              <p className="small-description">
                {feesDesc.length > 0 && feesDesc}
                {feesDesc.length > 0 && <br />}
                {profitDesc}
                <br />
                {transactionTotalDesc.length > 0 && transactionTotalDesc}
              </p>
            )}

            {!readOnly && (
              <Button
                variant="outline-info"
                type="submit"
                onClick={e => this.addTransactionRecord(e)}
              >
                {transactionType}
              </Button>
            )}
          </Form>
        </Modal>
        <Tabs
          defaultActiveKey={`tab-${activePortfolio}`}
          onSelect={e => this.tabSelected(e)}
        >
          {tabs}
          <Tab key="new-portfolio" eventKey="new-portfolio" title="...">
            <div className="div-title">ADD NEW PORTFOLIO</div>
            <Form className="settings-container">
              <InputGroup size="sm" className="mb-3 small-settings">
                <InputGroup.Prepend>
                  <InputGroup.Text id="portfolio-name">New</InputGroup.Text>
                </InputGroup.Prepend>

                <Form.Control
                  placeholder="My US Portfolio"
                  aria-label="New Portfolio"
                  aria-describedby="portfolio-name"
                  onChange={evt =>
                    this.setState({ newPortfolioName: evt.target.value })
                  }
                />

                <Button
                  size="sm"
                  variant="outline-info"
                  type="submit"
                  onClick={e => this.addPortfolio(e)}
                >
                  Create
                </Button>
              </InputGroup>
            </Form>
          </Tab>
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
