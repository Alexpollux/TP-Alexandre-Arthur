import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BeerProvider } from './BeerContext';
import BeerList from './components/BeerList';
import BeerDetails from './components/BeerDetails';
import ContactForm from './components/ContactForm';
import Header from './components/Header';

function App() {
    return (
        <BeerProvider> {}
            <Router>
                <Header />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<BeerList />} />
                        <Route path="/beer/:id" element={<BeerDetails />} />
                        <Route path="/contact" element={<ContactForm />} />
                    </Routes>
                </div>
            </Router>
        </BeerProvider>
    );
}

export default App;
