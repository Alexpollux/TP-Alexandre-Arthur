import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FilterBar from './FilterBar';
import { useBeers } from '../BeerContext';
import './Header.css';

const Header = () => {
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const { handleFilter } = useBeers();

  const closeFilters = () => {
        setShowFilters(false);
    };

  useEffect(() => {
    setShowFilters(false);
  }, [location]);

  return (
    <header className="header">
      {location.pathname === '/' && (
        <button onClick={() => setShowFilters(!showFilters)} className="filter-button">
          Filtres
        </button>
      )}
      {showFilters && <FilterBar onFilter={handleFilter} onClose={closeFilters}/>}
      {location.pathname !== '/' && (
        <Link to="/" className="header-link" style={{paddingLeft:'94px'}}>D'une bière deux coups</Link>
      )}
      {location.pathname === '/' && (
        <Link to="/" className="header-link">D'une bière deux coups</Link>
      )}
      <nav className="header-nav">
      <Link to="/contact" className="header-nav-link">Contact</Link>
        
      </nav>
    </header>
  );
};

export default Header;
