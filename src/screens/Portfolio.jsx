import React from 'react';
import { connect } from 'react-redux';
import PortfolioSymbolsPicker from '../components/symbolsPicker/PortfolioSymbolsPicker';
import PortfolioComponent from '../components/PortfolioComponent';

const Portfolio = ({ theme }) => {
  return (
    <div className={`${theme} `}>
      <PortfolioSymbolsPicker />
      <PortfolioComponent />
    </div>
  );
};

const mapStateToProps = state => ({
  theme: state.appStatus.theme,
});

export default connect(mapStateToProps)(Portfolio);
