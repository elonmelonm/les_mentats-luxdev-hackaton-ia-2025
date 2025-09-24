import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen text-white">
      {/* Image de fond avec opacité */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/src/assets/carte_benin.jpg')`,
          opacity: 0.8
        }}
      ></div>
      
      {/* Overlay sombre pour améliorer la lisibilité */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{ backgroundColor: '#0f172a' }}
      ></div>
      
      <div className="relative container mx-auto px-4 py-20 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Cadastre en ligne
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Réaliser toutes vos demandes directement en ligne.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => {
                const demandeSection = document.getElementById('demande-section');
                demandeSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#00573A] h-12 hover:bg-white text-white hover:text-green-900 font-semibold py- px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Faire une demande
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
