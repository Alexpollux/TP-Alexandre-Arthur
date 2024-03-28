import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BeerList from './components/BeerList';
import BeerDetails from './components/BeerDetails';
import ContactForm from './components/ContactForm';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header /> {}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<BeerList />} />
          <Route path="/beer/:id" element={<BeerDetails />} />
          <Route path="/contact" element={<ContactForm />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;