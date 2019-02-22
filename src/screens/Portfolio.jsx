import React from 'react';
import { connect } from 'react-redux';
import PortfolioSymbolsPicker from '../components/PortfolioSymbolPicker';

const Portfolio = ({ dispatch }) => {
  return (
    <div>
      <PortfolioSymbolsPicker />
    </div>
  );
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Portfolio);
