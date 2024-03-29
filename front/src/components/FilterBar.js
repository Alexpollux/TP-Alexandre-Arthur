import React, { useEffect, useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ onFilter }) => {
  const [startDate, setStartDate] = useState({ month: '01', year: '2007' });
  const [endDate, setEndDate] = useState({ month: '12', year: '2016' });
  const [beer, setBeer] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:1234/api/beers?brewed_before=${startDate}&brewed_after=${endDate}`) // Utilisez le bon port ici aussi
      .then(response => response.json())
      .then(data => setBeer(data))
      .catch(error => console.error("Error fetching data: ", error));
  }, [startDate, endDate]);

  const handleFilterClick = () => {
    fetch(`http://localhost:1234/api/beers?brewed_before=${startDate}&brewed_after=${endDate}`)
  };

  return (
    <div className="filter-bar">
      <p>Filtrer les bières par :</p>
      <div className="date-filter">
        <div>
          <label htmlFor="start-month">Brewed after: </label>
          <input 
            type="number" 
            id="start-month" 
            value={startDate.month}
            onChange={(e) => setStartDate({ ...startDate, month: e.target.value })}
            min="1" 
            max="12" 
          />
          <input 
            type="number" 
            id="start-year" 
            value={startDate.year}
            onChange={(e) => setStartDate({ ...startDate, year: e.target.value })}
            min="2007"
            max="2015" 
          />
        </div>
        <div>
          <label htmlFor="end-month">Brewed before: </label>
          <input 
            type="number" 
            id="end-month" 
            value={endDate.month}
            onChange={(e) => setEndDate({ ...endDate, month: e.target.value })}
            min="1" 
            max="12" 
          />
          <input 
            type="number" 
            id="end-year" 
            value={endDate.year}
            onChange={(e) => setEndDate({ ...endDate, year: e.target.value })}
            min="2008"
            max="2016"
          />
        </div>
      </div>
      <button onClick={handleFilterClick}>Appliquer les filtres</button>
    </div>
  );
};

export default FilterBar;



