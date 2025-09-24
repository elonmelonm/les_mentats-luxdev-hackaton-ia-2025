import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import DemandePage from './pages/Demande';
import PartenairePage from './pages/Partenaire';
import Contact from './pages/Contact';
// import './App.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demande" element={<DemandePage />} />
          <Route path="/partenaire" element={<PartenairePage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
