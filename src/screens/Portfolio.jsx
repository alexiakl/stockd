import React from 'react';
import { connect } from 'react-redux';
import PortfolioSymbolsPicker from '../components/symbolsPicker/PortfolioSymbolsPicker';

const Portfolio = ({ theme }) => {
  return <div className={`${theme} `}>{/* <PortfolioSymbolsPicker /> */}</div>;
};

const mapStateToProps = state => ({
  theme: state.appStatus.theme,
});

export default connect(mapStateToProps)(Portfolio);
