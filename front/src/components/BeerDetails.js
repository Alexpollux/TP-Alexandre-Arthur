import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BeerDetails.css'; // Assurez-vous que le chemin d'accès est correct

function BeerDetails() {
  const { id } = useParams();
  const [beer, setBeer] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:1234/api/beers/${id}`) // Utilisez le bon port ici aussi
      .then(response => response.json())
      .then(data => setBeer(data))
      .catch(error => console.error("Error fetching data: ", error));
  }, [id]);
  
  if (!beer) return <div className="loading-container">Loading...</div>;

  return (
    <div className="beer-details-container">
      <h1 className="beer-details-title">{beer.name}</h1>
      <img src={beer.image_url} alt={beer.name} className="beer-details-image" />
      <p className="beer-details-description">{beer.description}</p>
      <p className="beer-details-abv"><strong>ABV:</strong> {beer.abv}%</p>
    </div>
  );
}

export default BeerDetails;
