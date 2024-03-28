import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BeerList.css';

function BeerList() {
  const [beers, setBeers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:1234/api/beers')
      .then(response => response.json())
      .then(data => setBeers(data))
      .catch(error => console.error("Error fetching data: ", error));
  }, []);

  return (
    <div className="beer-list">
      {beers.map(beer => (
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
  );
}

export default BeerList;
