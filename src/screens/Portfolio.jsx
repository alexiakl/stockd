import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PortfolioSymbolsPicker from '../components/symbolsPicker/PortfolioSymbolsPicker';
import PortfolioComponent from '../components/PortfolioComponent';

const Portfolio = ({ theme, loggedin }) => {
  if (!loggedin) {
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
  loggedin: state.appStatus.loggedin,
});

export default connect(mapStateToProps)(Portfolio);
