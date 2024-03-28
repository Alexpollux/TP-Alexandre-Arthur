import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BeerList.css';
import FilterBar from './FilterBar'; // Assurez-vous d'importer FilterBar

function BeerList() {
  const [beers, setBeers] = useState([]);
  const [filteredBeers, setFilteredBeers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:1234/api/beers')
      .then(response => response.json())
      .then(data => {
        setBeers(data);
        setFilteredBeers(data); // Initialise les bières filtrées avec toutes les bières
      })
      .catch(error => console.error("Error fetching data: ", error));
  }, []);

  const handleFilter = (start, end) => {
    // Logique de filtrage ici
    const startFilter = `${start.year}-${start.month}`;
    const endFilter = `${end.year}-${end.month}`;

    const filtered = beers.filter(beer => {
      const [month, year] = beer.first_brewed.split('/');
      const beerDate = `${year}-${month.padStart(2, '0')}`;
      return beerDate >= startFilter && beerDate <= endFilter;
    });

    setFilteredBeers(filtered);
  };

  return (
    <div>
      <FilterBar onFilter={handleFilter} />
      <div className="beer-list">
        {filteredBeers.map(beer => (
          <Link to={`/beer/${beer.id}`} className="beer-card" key={beer.id}>
            <img src={beer.image_url} alt={beer.name} className="beer-image" />
            <div className="beer-text-content">
              <h3>{beer.name}</h3>
              <p className="first-brewed">{beer.first_brewed}</p>
              <p className="tagline">{beer.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BeerList;
