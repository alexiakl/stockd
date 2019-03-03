import React from 'react';
import { connect } from 'react-redux';
import PortfolioSymbolsPicker from '../components/symbolsPicker/PortfolioSymbolsPicker';

const Portfolio = ({ dispatch }) => {
  return (
    <div>
      <PortfolioSymbolsPicker />
    </div>
  );
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Portfolio);
