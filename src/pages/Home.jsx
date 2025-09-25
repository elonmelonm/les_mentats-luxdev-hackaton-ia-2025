

import React from 'react';
import Hero from '../components/Hero';
import DemandeSimple from '../components/DemandeSimple';
import Partenaire from '../components/Partenaire';
import { Services } from '../components/Services';
import Contact from '../components/Contact';
import ChatbotButton from '../components/ChatbotButton';

const Home = () => {
  return (
    <div>
      <Hero />
      <div id="services-section">
        <Services />
      </div>
      {/* <DemandeSimple /> */}
      {/* <Partenaire /> */}
      <Contact />
      <ChatbotButton />
    </div>
  );
};

export default Home;
