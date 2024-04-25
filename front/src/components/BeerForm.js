import React, { useState } from 'react';

function BeerForm() {
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [option, setOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Ajouté pour gérer l'état du bouton

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setOption(''); // Reset option when category changes
  };

  const handleSubmit = (e) => {
    setIsSubmitting(true); // Désactive le bouton lors de l'envoi du formulaire
    e.preventDefault();
    fetch('http://localhost:1234/api/scraping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        search: searchTerm,
        filter: category,
        sort: option
      }),
    })
    .then(response => response.json())
    .then(data => {
      alert('Message envoyé !');
      setIsSubmitting(false); // Réactive le bouton après la réponse
    })
    .catch(error => {
      console.error('Error:', error);
      setIsSubmitting(false); // Réactive le bouton en cas d'erreur
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label htmlFor="searchTerm">Search Term:</label>
        <input 
          type="text" 
          id="searchTerm" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select id="category" value={category} onChange={handleCategoryChange} required>
          <option value="">Select a category</option>
          <option value="beer">Bière</option>
          <option value="brewery">Brasserie</option>
          <option value="venues">Lieu</option>
        </select>
      </div>
      {category === "beer" && (
        <div>
          <label htmlFor="option">Option:</label>
          <select id="option" value={option} onChange={(e) => setOption(e.target.value)}>
            <option value="all">Les plus populaires</option>
            <option value="highest_abv">ABV plus élevé</option>
            <option value="lowest_abv">ABV moins élevé</option>
          </select>
        </div>
      )}
      {category === "venues" && (
        <div>
          <label htmlFor="option">Option:</label>
          <select id="option" value={option} onChange={(e) => setOption(e.target.value)}>
            <option value="all">Les plus populaires ALL TIME</option>
            <option value="popular_recent">Les plus populaires récemment</option>
          </select>
        </div>
      )}
      <div>
        <button type="submit" disabled={isSubmitting} style={{
        backgroundColor: isSubmitting ? 'pink' : '',
        }}>Rechercher</button>
      </div>
    </form>
  );
}

export default BeerForm;
