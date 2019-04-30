import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PortfolioComponent from '../components/PortfolioComponent';
import Footer from '../components/layout/Footer';

const Portfolio = ({ theme, loggedin }) => {
  if (!loggedin) {
    return <Redirect to="/login" />;
  }
  return (
    <div className={`${theme} `}>
      <PortfolioComponent />
      <Footer />
    </div>
  );
};

const mapStateToProps = state => ({
  theme: state.appStatus.theme,
  loggedin: state.appStatus.loggedin,
});

export default connect(mapStateToProps)(Portfolio);
