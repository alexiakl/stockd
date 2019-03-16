import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Form, Badge, Button } from 'react-bootstrap';
import {
  addSymbolRecord,
  removeSymbolRecord,
  setFees,
  setQuantity,
  setUnitPrice,
  setBuy,
} from '../actions/portfolioSymbolsPicker';

class PortfolioComponent extends Component {
  constructor() {
    super();

    this.state = {
      expandedRows: [],
    };
  }

  handleRowClick(rowId) {
    const { expandedRows } = this.state;
    const isRowCurrentlyExpanded = expandedRows.includes(rowId);

    const newExpandedRows = isRowCurrentlyExpanded
      ? expandedRows.filter(id => id !== rowId)
      : expandedRows.concat(rowId);

    this.setState({ expandedRows: newExpandedRows });
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

  renderSubItem(item, index) {
    const { dispatch } = this.props;
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
            buy
          </Badge>{' '}
          <Badge
            variant={sellVariant}
            onClick={() => this.updateBuy(item.symbol, index, false)}
          >
            sell
          </Badge>
        </td>
        <td>
          <Form.Control
            size="sm"
            type="number"
            placeholder="0"
            defaultValue={item.quantity}
            onChange={evt =>
              this.updateQuantity(item.symbol, index, evt.target.value)
            }
          />
        </td>
        <td>
          <Form.Control
            size="sm"
            type="number"
            placeholder="0"
            defaultValue={item.unitPrice}
            onChange={evt =>
              this.updateUnitPrice(item.symbol, index, evt.target.value)
            }
          />
        </td>
        <td>
          <Form.Control
            size="sm"
            type="number"
            placeholder="0"
            defaultValue={item.fees}
            onChange={evt =>
              this.updateFees(item.symbol, index, evt.target.value)
            }
          />
        </td>
        <td>
          <Form.Control
            size="sm"
            type="number"
            placeholder="0"
            disabled
            value={item.total}
          />
        </td>
        <td className="center">
          <Badge
            variant="warning"
            className="action"
            onClick={() =>
              dispatch(removeSymbolRecord({ symbol: item.symbol, index }))
            }
          >
            -
          </Badge>
        </td>
      </tr>
    );
  }

  renderItem(item) {
    const { expandedRows } = this.state;
    const { dispatch } = this.props;
    const clickCallback = () => this.handleRowClick(item.symbol);
    const itemRows = [
      <tr key={`row-data-${item.symbol}`}>
        <td>
          <Button size="sm" onClick={clickCallback} variant="secondary">
            {item.symbol} <Badge variant="light">{item.records.length}</Badge>
            <span className="sr-only">unread messages</span>
          </Button>
        </td>
        <td />
        <td />
        <td />
        <td />
        <td className="center">
          <Badge
            key={item.symbol}
            variant="info"
            className="action"
            onClick={() => dispatch(addSymbolRecord(item.symbol))}
          >
            +
          </Badge>
        </td>
      </tr>,
    ];

    let allSubItemRows = [];
    item.records.forEach((record, index) => {
      const perItemRows = this.renderSubItem(record, index);
      allSubItemRows = allSubItemRows.concat(perItemRows);
    });

    if (expandedRows.includes(item.symbol)) {
      itemRows.push(allSubItemRows);
    }

    return itemRows;
  }

  render() {
    const { data, theme } = this.props;
    let allItemRows = [];

    Object.keys(data).forEach(symbol => {
      const record = data[symbol];
      const perItemRows = this.renderItem(record);
      allItemRows = allItemRows.concat(perItemRows);
    });

    return (
      <Table hover variant={theme}>
        <thead>
          <tr>
            <th />
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Fees</th>
            <th>Total</th>
            <th />
          </tr>
        </thead>
        <tbody>{allItemRows}</tbody>
      </Table>
    );
  }
}

const mapStateToProps = state => ({
  data: state.portfolioSymbolsPicker.data,
  theme: state.appStatus.theme,
});

export default connect(mapStateToProps)(PortfolioComponent);
