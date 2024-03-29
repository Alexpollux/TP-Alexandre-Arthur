import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BeerList.css';
import FilterBar from './FilterBar';

function BeerList() {
  const [beers, setBeers] = useState([]);
  const [filteredBeers, setFilteredBeers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:1234/api/beers')
      .then(response => response.json())
      .then(data => {
        setBeers(data);
        setFilteredBeers(data);
      })
      .catch(error => console.error("Error fetching data: ", error));
  }, []);

  const handleFilter = (filters) => {
    const startMonthPadded = String(filters.startDate.month).padStart(2, '0');
    const endMonthPadded = String(filters.endDate.month).padStart(2, '0');
    const startFilter = `${filters.startDate.year}-${startMonthPadded}`;
    const endFilter = `${filters.endDate.year}-${endMonthPadded}`;

    const filtered = beers.filter(beer => {
      const beerFirstBrewedDate = beer.first_brewed.split('/').reverse().join('-');
      return beerFirstBrewedDate >= startFilter && beerFirstBrewedDate <= endFilter;
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
