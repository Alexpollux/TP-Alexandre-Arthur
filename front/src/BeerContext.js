import React, { createContext, useState, useContext } from 'react';

const BeerContext = createContext();

export const useBeers = () => useContext(BeerContext);

export const BeerProvider = ({ children }) => {
    const [beers, setBeers] = useState([]);
    const [filteredBeers, setFilteredBeers] = useState([]);

    const handleFilter = (filters) => {
        const { startDate, endDate } = filters;
        const apiUrl = `http://localhost:1234/api/beers?brewed_after=${startDate}&brewed_before=${endDate}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                setBeers(data);
                setFilteredBeers(data);
            })
            .catch(error => console.error("Error fetching filtered beers: ", error));
    };

    return (
        <BeerContext.Provider value={{ beers, filteredBeers, setBeers, setFilteredBeers, handleFilter }}>
            {children}
        </BeerContext.Provider>
    );
};
