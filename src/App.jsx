import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Chatbots from './pages/Chatbots';
import Dashboard from './pages/Dashboard';
import Cadastre from './pages/Cadastre';
import Topographie from './pages/Topographie';
import CarteTopographie from './pages/CarteTopographie';
// import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/carte-topographie" element={<CarteTopographie />} />
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chatbots" element={<Chatbots />} />
              <Route path="/cadastre" element={<Cadastre />} />
              <Route path="/topographie" element={<Topographie />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
