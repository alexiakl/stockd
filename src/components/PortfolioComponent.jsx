import React from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col } from 'react-bootstrap';

const PortfolioComponent = ({ data, dispatch }) => {
  return (
    <div className="sdcontainer">
      <div className="results">
        {data &&
          data.length > 0 &&
          data.map(record => (
            <Form>
              <Form.Row>
                <Form.Group as={Col} md="2">
                  <Form.Control
                    required
                    type="text"
                    defaultValue={record.symbol}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Control required type="text" defaultValue="Sold" />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Control required type="text" defaultValue="Sold" />
                </Form.Group>
              </Form.Row>
            </Form>
          ))}
      </div>
    </div>
  );
};
const mapStateToProps = state => ({
  data: state.portfolioSymbolsPicker.data,
});

export default connect(mapStateToProps)(PortfolioComponent);
