import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FilterBar from './FilterBar'; // Assurez-vous de créer ce composant
import './Header.css';

const Header = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <header className="header">
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
