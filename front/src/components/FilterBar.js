import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ onFilter }) => {
  const [startDate, setStartDate] = useState({ month: '01', year: '2007' });
  const [endDate, setEndDate] = useState({ month: '12', year: '2016' });

  const handleFilter = () => {
    onFilter(startDate, endDate);
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
      <button onClick={handleFilter}>Appliquer les filtres</button>
    </div>
  );
};

export default FilterBar;
