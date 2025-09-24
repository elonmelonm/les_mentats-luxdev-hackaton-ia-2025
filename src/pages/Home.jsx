

import React from 'react';
import Hero from '../components/Hero';
import DemandeSimple from '../components/DemandeSimple';
import Partenaire from '../components/Partenaire';
import { Services } from '../components/Services';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <div>
      <Hero />
      <Services />
      {/* <DemandeSimple /> */}
      {/* <Partenaire /> */}
      <Contact />
    </div>
  );
};

export default Home;
