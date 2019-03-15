import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { addSymbolRecord } from '../actions/portfolioSymbolsPicker';

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

  renderSubItem(item) {
    return (
      <tr key={`row-expanded-${item.symbol}`}>
        <td>yuhu</td>
        <td>
          <Button
            key={item.symbol}
            className="stock-button"
            variant="outline-secondary"
            size="sm"
            onClick={evt => console.log('yo')}
          >
            Remove
          </Button>
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
        <td onClick={clickCallback}>{item.symbol}</td>
        <td onClick={clickCallback}>
          {item.records.length} transaction{item.records.length > 1 && 's'}
        </td>
        <td>
          <Button
            key={item.symbol}
            className="stock-button"
            variant="outline-secondary"
            size="sm"
            onClick={evt => dispatch(addSymbolRecord(item.symbol))}
          >
            Add
          </Button>
        </td>
      </tr>,
    ];

    let allSubItemRows = [];
    item.records.forEach(record => {
      const perItemRows = this.renderSubItem(record);
      allSubItemRows = allSubItemRows.concat(perItemRows);
    });

    if (expandedRows.includes(item.symbol)) {
      itemRows.push(allSubItemRows);
    }

    return itemRows;
  }

  render() {
    const { data } = this.props;
    let allItemRows = [];

    data.forEach(record => {
      const perItemRows = this.renderItem(record);
      allItemRows = allItemRows.concat(perItemRows);
    });

    return (
      <Table striped bordered hover>
        <tbody>{allItemRows}</tbody>
      </Table>
    );
  }
}

const mapStateToProps = state => ({
  data: state.portfolioSymbolsPicker.data,
});

export default connect(mapStateToProps)(PortfolioComponent);
