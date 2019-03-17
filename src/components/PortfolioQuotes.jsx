import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Form, Badge, Button } from 'react-bootstrap';

class PortfolioQuotes extends Component {
  generatePortfolioQuotes() {
    const { data, quotes, theme } = this.props;
    if (data) {
      Object.keys(data).forEach(symbol => {
        const item = data[symbol];
        let b = 0;
        let s = 0;
        item.records.forEach((record, index) => {
          if (quotes.data) {
            b += record.quantity * record.unitPrice + record.fees;
            s +=
              record.quantity * quotes.data[symbol].quote.latestPrice -
              record.fees;
          }
        });
        const result = s - b;
        console.log(`${symbol}: ${result.toFixed(2)}`);
      });
    }

    return '';
  }

  render() {
    const portfolioQuotes = this.generatePortfolioQuotes();

    return <React.Fragment>{portfolioQuotes}</React.Fragment>;
  }
}

const mapStateToProps = state => ({
  data: state.portfolio.data,
  quotes: state.portfolio.quotes,
  theme: state.appStatus.theme,
});

export default connect(mapStateToProps)(PortfolioQuotes);
