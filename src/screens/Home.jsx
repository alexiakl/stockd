import React from 'react';
import { connect } from 'react-redux';
import SymbolsPicker from '../components/SymbolsPicker';

const Home = ({ dispatch }) => {
  return (
    <div>
      <SymbolsPicker />
    </div>
  );
};

const mapStateToProps = state => ({
  marketState: state.marketState,
  period: state.periodController.period,
  symbols: state.symbolsPicker.symbols,
});

export default connect(mapStateToProps)(Home);
