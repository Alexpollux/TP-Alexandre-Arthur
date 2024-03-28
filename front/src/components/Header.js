import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FilterBar from './FilterBar';
import './Header.css';

const Header = () => {
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();

  // Ferme la barre de filtre chaque fois que l'URL change
  useEffect(() => {
    setShowFilters(false);
  }, [location]);

  return (
    <header className="header">
      {location.pathname === '/' && (
          <button onClick={() => setShowFilters(!showFilters)} className="filter-button">
            Filter
          </button>
        )}
      {showFilters && <FilterBar />}
      <button onClick={() => setShowFilters(!showFilters)} className="filter-button">Filtres</button>
      <Link to="/" className="header-link">D'une bière deux coups</Link>
      <nav className="header-nav">
        <Link to="/contact" className="header-nav-link">Contact</Link>
        
      </nav>
    </header>
  );
};

export default Header;
