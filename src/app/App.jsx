import React from 'react';
import '../styles/App.scss';
import Mixed from '../components/mixed';
import StockdNav from '../components/StockdNav';

export default () => (
  <div className="Home">
    <StockdNav />
    <Mixed />
  </div>
);
