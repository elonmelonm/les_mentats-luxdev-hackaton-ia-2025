import React, { useEffect, useState } from 'react';

const Partenaire = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Logos des partenaires (vous pouvez remplacer par de vrais logos)
  const partenaires = [
    {
      id: 1,
      name: "Ministère de l'Urbanisme",
      logo: "/src/assets/logo-andf.png",
      description: "Ministère de l'Urbanisme"
    },
    {
      id: 2,
      name: "Direction des Domaines",
      logo: "/src/assets/logo-andf.png",
      description: "Direction des Domaines"
    },
    {
      id: 3,
      name: "Ordre des Géomètres",
      logo: "/src/assets/logo-andf.png",
      description: "Ordre des Géomètres"
    },
    {
      id: 4,
      name: "Ordre des Notaires",
      logo: "/src/assets/logo-andf.png",
      description: "Ordre des Notaires"
    },
    {
      id: 5,
      name: "Chambre des Avocats",
      logo: "/src/assets/logo-andf.png",
      description: "Chambre des Avocats"
    },
    {
      id: 6,
      name: "Collectivités Locales",
      logo: "/src/assets/logo-andf.png",
      description: "Collectivités Locales"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % partenaires.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [partenaires.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % partenaires.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + partenaires.length) % partenaires.length);
  };

  return (
    <section className="py-20 h-screen bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Nos Partenaires
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nous travaillons en étroite collaboration avec des institutions de confiance 
            pour garantir la sécurisation foncière au Sénégal.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
            >
              {partenaires.map((partenaire) => (
                <div key={partenaire.id} className="w-1/3 flex-shrink-0 px-4">
                  <div className="bg-gray-50 rounded-lg p-8 h-48 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-300">
                    <div className="mb-4">
                      <img 
                        src={partenaire.logo} 
                        alt={partenaire.name}
                        className="h-16 w-auto object-contain mx-auto"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 text-center">
                      {partenaire.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-center mt-2">
                      {partenaire.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200"
            aria-label="Précédent"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200"
            aria-label="Suivant"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {partenaires.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partenaire;
