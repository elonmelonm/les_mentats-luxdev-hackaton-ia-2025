import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration des icônes Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const CarteTopographie = () => {
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Récupérer les données depuis localStorage
    const data = localStorage.getItem('topographyData');
    if (data) {
      try {
        setExtractedData(JSON.parse(data));
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Erreur parsing data:', err);
      }
    } else {
      setError('Aucune donnée topographique trouvée');
    }
    setLoading(false);
  }, []);

  // Fonction pour convertir les coordonnées en format Leaflet
  const convertCoordinatesToLeaflet = (coords) => {
    if (!coords || !Array.isArray(coords)) return [];
    
    // Conversion des coordonnées UTM vers lat/lng (approximation pour le Bénin)
    return coords.map(coord => {
      // Approximation simple pour la zone de Cotonou
      // En réalité, il faudrait une conversion UTM précise
      const lat = 6.3725 + (coord.y - 793850) * 0.00001;
      const lng = 2.3544 + (coord.x - 395400) * 0.00001;
      return [lat, lng];
    });
  };

  // Calcul du centre de la carte
  const getMapCenter = () => {
    if (!extractedData?.coordonnees_parcelle) {
      return [6.3725, 2.3544]; // Cotonou par défaut
    }
    
    const coords = extractedData.coordonnees_parcelle;
    const avgX = coords.reduce((sum, coord) => sum + coord.x, 0) / coords.length;
    const avgY = coords.reduce((sum, coord) => sum + coord.y, 0) / coords.length;
    
    const lat = 6.3725 + (avgY - 793850) * 0.00001;
    const lng = 2.3544 + (avgX - 395400) * 0.00001;
    
    return [lat, lng];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#367C55] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (error || !extractedData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.close()}
            className="bg-[#367C55] text-white px-4 py-2 rounded-lg hover:bg-[#2d5f44] transition-colors duration-200"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const mapCenter = getMapCenter();
  const parcelCoords = convertCoordinatesToLeaflet(extractedData.coordonnees_parcelle);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#367C55] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Carte Interactive Topographique</h1>
                <p className="text-sm text-gray-600">
                  {extractedData._metadata?.fileName || 'Terrain analysé'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Statut de l'analyse */}
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                extractedData.empietement 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {extractedData.empietement ? '⚠️ Empiètement' : '✅ Conforme'}
              </div>
              
              <button
                onClick={() => window.close()}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex h-screen">
        {/* Sidebar avec informations */}
        <div className="w-80 bg-white shadow-lg overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Informations du terrain
            </h2>
            
            {/* Métadonnées */}
            {extractedData._metadata && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Fichier source</h3>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom:</span>
                    <span className="font-medium">{extractedData._metadata.fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taille:</span>
                    <span className="font-medium">{extractedData._metadata.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confiance:</span>
                    <span className="font-medium text-green-600">{extractedData._metadata.confidence}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Statut de l'analyse */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Statut de l'analyse</h3>
              <div className={`p-3 rounded-lg border ${extractedData.empietement ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center space-x-2">
                  {extractedData.empietement ? (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className={`font-medium ${extractedData.empietement ? 'text-red-800' : 'text-green-800'}`}>
                    {extractedData.empietement ? 'Empiètement détecté' : 'Analyse conforme'}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${extractedData.empietement ? 'text-red-600' : 'text-green-600'}`}>
                  {extractedData.empietement ? 'Conflits avec les réglementations' : 'Aucun conflit détecté'}
                </p>
              </div>
            </div>

            {/* Intersections par couche */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Analyse par couche</h3>
              <div className="space-y-2">
                {[
                  { key: 'aif', label: 'AIF', data: extractedData.aif },
                  { key: 'dpl', label: 'DPL', data: extractedData.dpl },
                  { key: 'dpm', label: 'DPM', data: extractedData.dpm }
                ].map(({ key, label, data }) => (
                  <div key={key} className={`p-2 rounded border ${data.has_intersection ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${data.has_intersection ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {data.has_intersection ? 'Conflit' : 'Libre'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coordonnées */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Coordonnées</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {extractedData.coordonnees_parcelle.map((coord, index) => (
                    <div key={index} className="text-center">
                      <div className="text-gray-600 text-xs">P{index + 1}</div>
                      <div className="font-mono text-xs">
                        {coord.x.toFixed(1)}
                      </div>
                      <div className="font-mono text-xs">
                        {coord.y.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Légende */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Légende</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 border-2 border-blue-700 rounded"></div>
                  <span>Parcelle analysée</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 border-2 border-red-700 rounded"></div>
                  <span>Zone d'empiètement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 border-2 border-green-700 rounded"></div>
                  <span>Zone libre</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte */}
        <div className="flex-1">
          <MapContainer
            center={mapCenter}
            zoom={16}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Parcelle principale */}
            {parcelCoords.length > 0 && (
              <Polygon
                positions={parcelCoords}
                pathOptions={{
                  color: '#3B82F6',
                  weight: 3,
                  fillColor: '#3B82F6',
                  fillOpacity: 0.3
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-800 mb-2">Parcelle analysée</h3>
                    <p className="text-sm text-gray-600">
                      {extractedData._metadata?.fileName || 'Terrain topographique'}
                    </p>
                    <div className="mt-2 text-xs">
                      <p><strong>Statut:</strong> {extractedData.empietement ? 'Empiètement détecté' : 'Conforme'}</p>
                      <p><strong>Parcelle libre:</strong> {extractedData.parcelle_libre_finale.includes('EMPTY') ? 'Aucune' : 'Disponible'}</p>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            )}

            {/* Marqueur central */}
            <Marker position={mapCenter}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-800 mb-2">Centre de la parcelle</h3>
                  <p className="text-sm text-gray-600">
                    Coordonnées: {mapCenter[0].toFixed(6)}, {mapCenter[1].toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default CarteTopographie;
