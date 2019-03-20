import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PortfolioSymbolsPicker from '../components/symbolsPicker/PortfolioSymbolsPicker';
import PortfolioComponent from '../components/PortfolioComponent';
import { TOKEN } from '../constants';

const Portfolio = ({ theme }) => {
  const token = localStorage.getItem(TOKEN);
  if (!token) {
    return <Redirect to="/login" />;
  }
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
