import React from 'react';

const Hero = () => {
  return (
    <section className="relative h-screen text-white bg-cover bg-center bg-no-repeat benin-hero-bg">
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Cadastre en ligne</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Réaliser toutes vos demandes
            <span className="block text-yellow-400">directement en ligne.</span>
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => {
                const demandeSection = document.getElementById('demande-section');
                demandeSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
