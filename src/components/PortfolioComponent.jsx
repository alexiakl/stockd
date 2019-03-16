import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Badge } from 'react-bootstrap';
import {
  addSymbolRecord,
  removeSymbolRecord,
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

  renderSubItem(item, index) {
    const { dispatch } = this.props;
    return (
      <tr key={`row-expanded-${item.symbol}-${index}`}>
        <td />
        <td>
          <Badge variant="warning">buy</Badge>{' '}
          <Badge variant="light">sell</Badge>
        </td>
        <td>20</td>
        <td>100</td>
        <td>50</td>
        <td>10000</td>
        <td>
          <Badge
            variant="warning"
            onClick={() =>
              dispatch(removeSymbolRecord({ symbol: item.symbol, index }))
            }
          >
            Remove
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
          <Badge onClick={clickCallback} variant="secondary">
            {item.symbol}
          </Badge>
        </td>
        <td>
          <Badge onClick={clickCallback} variant="secondary">
            {item.records.length} transaction{item.records.length > 1 && 's'}
          </Badge>
        </td>
        <td />
        <td />
        <td />
        <td />
        <td>
          <Badge
            key={item.symbol}
            variant="info"
            onClick={() => dispatch(addSymbolRecord(item.symbol))}
          >
            Add
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

    data.forEach(record => {
      const perItemRows = this.renderItem(record);
      allItemRows = allItemRows.concat(perItemRows);
    });

    return (
      <Table hover variant={theme}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Fees</th>
            <th>Total</th>
            <th>Actions</th>
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
