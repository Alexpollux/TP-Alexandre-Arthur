import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function BeerDetails() {
  const { id } = useParams();
  const [beer, setBeer] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:1234/api/beers/${id}`) // Utilisez le bon port ici aussi
      .then(response => response.json())
      .then(data => setBeer(data))
      .catch(error => console.error("Error fetching data: ", error));
  }, [id]);
  

  if (!beer) return <div>Loading...</div>;

  return (
    <div>
      <h1>{beer.name}</h1>
      <img src={beer.image_url} alt={beer.name} style={{ maxWidth: "100px" }} />
      <p>{beer.description}</p>
      <p><strong>ABV:</strong> {beer.abv}%</p>
    </div>
  );
}

export default BeerDetails;