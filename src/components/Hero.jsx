import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from '../assets/carte_benin.jpg';
import Image2 from '../assets/topograp_img.jpeg';
import Image3 from '../assets/assistant_img.jpeg';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Données du slider
  const slides = [
    {
      image: Image,
      title: "Cadastre en ligne",
      subtitle: "Réaliser toutes vos demandes directement en ligne.",
      buttonText: "Faire une demande"
    },
    {
      image: Image2,
      title: "Topographie professionnelle",
      subtitle: "Services de levés topographiques précis pour vos projets.",
      buttonText: "Découvrir nos services"
    },
    {
      image: Image3,
      title: "Assistant IA disponible",
      subtitle: "Obtenez des réponses instantanées à vos questions 24h/24.",
      buttonText: "Poser une question"
    }
  ];

  // Auto-slide toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen text-white overflow-hidden">
      {/* Images du slider */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <img
            key={index}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-80' : 'opacity-0'
            }`}
            src={slide.image}
            alt={`Slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Overlay sombre pour améliorer la lisibilité */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{ backgroundColor: '#0f172a' }}
      ></div>
      
      {/* Contenu du slider */}
      <div className="relative container mx-auto px-4 py-20 lg:py-40 h-full flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ${
                index === currentSlide 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8 absolute inset-0 flex items-center justify-center'
              }`}
            >
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                  {slide.subtitle}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      const demandeSection = document.getElementById('services-section');
                      demandeSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#00573A] h-12 hover:bg-white text-white hover:text-green-900 font-semibold py-3 px-8 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
                  >
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Boutons de navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 z-10 cursor-pointer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 z-10 cursor-pointer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicateurs de pagination */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
