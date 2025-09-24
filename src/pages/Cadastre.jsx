import React from 'react';

const Cadastre = () => {
  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Cadastre</h2>
            <p className="text-xl text-gray-600">Explorez la carte interactive centrée sur le Bénin.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-[70vh]">
              <iframe
                title="Carte du Bénin"
                src="https://www.openstreetmap.org/export/embed.html?bbox=0.772%2C5.5%2C3.9%2C12.7&layer=mapnik&marker=9.3%2C2.3"
                className="w-full h-full border-0"
              />
            </div>
            <div className="p-4 text-sm text-gray-600 bg-gray-50 border-t">
              Source: OpenStreetMap — utilisez les contrôles pour zoomer et naviguer.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cadastre;
