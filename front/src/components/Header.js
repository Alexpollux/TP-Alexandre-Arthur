import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Assurez-vous d'importer votre CSS

const Header = () => (
  <header className="header">
    <Link to="/" className="header-link">La Liste à Bière</Link>
    <nav className="header-nav">
      <Link to="/contact" className="header-nav-link">Contact</Link>
    </nav>
  </header>
);

export default Header;
