import React, { useEffect, useState, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Import des composants d'analyse
import CoordinateAnalyzer from '../components/CoordinateAnalyzer';
import AnalysisResults from '../components/AnalysisResults';
import geojsonService from '../services/geojsonService';

const CarteTopographie = () => {
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCoordinateAnalyzer, setShowCoordinateAnalyzer] = useState(false);
  
  // États pour les couches GeoJSON
  const [availableLayers, setAvailableLayers] = useState({});
  const [activeLayers, setActiveLayers] = useState({});
  const [layersLoading, setLayersLoading] = useState(false);

  // Fonction pour charger les couches GeoJSON
  const loadGeoJSONLayers = async () => {
    setLayersLoading(true);
    try {
      console.log('🔄 Chargement des couches GeoJSON...');
      const { loadedLayers, errors } = await geojsonService.loadAllLayers();
      
      setAvailableLayers(loadedLayers);
      
      // Activer par défaut les couches principales
      const defaultActiveLayers = {
        'aif': true,
        'dpl': true,
        'dpm': true,
        'parcelles': false,
        'zone_inondable': false
      };
      setActiveLayers(defaultActiveLayers);
      
      console.log('✅ Couches GeoJSON chargées:', Object.keys(loadedLayers));
      
      if (errors.length > 0) {
        console.warn('⚠️ Erreurs de chargement:', errors);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des couches:', error);
      setError('Erreur lors du chargement des couches réglementaires');
    } finally {
      setLayersLoading(false);
    }
  };

  // Fonction pour charger des données de test
  const loadTestData = () => {
    const testData = {
      empietement: true,
      coordonnees_parcelle: [
        { x: 395400, y: 793850 },
        { x: 395500, y: 793850 },
        { x: 395500, y: 793950 },
        { x: 395400, y: 793950 }
      ],
      aif: {
        has_intersection: true,
        geometry: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [2.3544, 6.3725],
              [2.3554, 6.3725],
              [2.3554, 6.3735],
              [2.3544, 6.3735],
              [2.3544, 6.3725]
            ]]
          },
          properties: { name: 'AIF Test' }
        }
      },
      dpl: {
        has_intersection: false,
        geometry: null
      },
      dpm: {
        has_intersection: true,
        geometry: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [2.3540, 6.3720],
              [2.3550, 6.3720],
              [2.3550, 6.3730],
              [2.3540, 6.3730],
              [2.3540, 6.3720]
            ]]
          },
          properties: { name: 'DPM Test' }
        }
      }
    };
    
    setExtractedData(testData);
    setError('');
  };
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [popupInfo, setPopupInfo] = useState(null);

  // Fonction pour gérer les résultats de l'analyse de coordonnées
  const handleCoordinateAnalysisComplete = (results) => {
    setExtractedData(results);
    setShowCoordinateAnalyzer(false);
    setError('');
  };

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
    
    // Charger les couches GeoJSON
    loadGeoJSONLayers();
  }, []);

  // Fonction pour convertir les coordonnées en format MapLibre
  const convertCoordinatesToMapLibre = (coords) => {
    if (!coords || !Array.isArray(coords)) {
      console.warn('Coordonnées invalides:', coords);
      return [];
    }
    
    // Conversion des coordonnées UTM vers lat/lng (approximation pour le Bénin)
    return coords.map(coord => {
      if (!coord || typeof coord.x !== 'number' || typeof coord.y !== 'number') {
        console.warn('Coordonnée invalide:', coord);
        return [2.3544, 6.3725]; // Coordonnées par défaut
      }
      
      // Approximation simple pour la zone de Cotonou
      const lat = 6.3725 + (coord.y - 793850) * 0.00001;
      const lng = 2.3544 + (coord.x - 395400) * 0.00001;
      return [lng, lat];
    });
  };

  // Calcul du centre de la carte
  const getMapCenter = () => {
    if (!extractedData?.coordonnees_parcelle || !Array.isArray(extractedData.coordonnees_parcelle)) {
      return [2.3544, 6.3725]; // [lng, lat]
    }
    
    const coords = extractedData.coordonnees_parcelle;
    const validCoords = coords.filter(coord => coord && typeof coord.x === 'number' && typeof coord.y === 'number');
    
    if (validCoords.length === 0) {
      return [2.3544, 6.3725]; // [lng, lat]
    }
    
    const avgX = validCoords.reduce((sum, coord) => sum + coord.x, 0) / validCoords.length;
    const avgY = validCoords.reduce((sum, coord) => sum + coord.y, 0) / validCoords.length;
    
    const lat = 6.3725 + (avgY - 793850) * 0.00001;
    const lng = 2.3544 + (avgX - 395400) * 0.00001;
    
    return [lng, lat];
  };

  // Initialiser la carte MapLibre
  useEffect(() => {
    if (map.current) return; // Éviter la réinitialisation

    // Attendre que le conteneur soit disponible
    const initMap = () => {
      if (!mapContainer.current) {
        setTimeout(initMap, 100);
        return;
      }

      const center = getMapCenter();
      
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm'
            }
          ]
        },
        center: center,
        zoom: 16
      });

      // Ajouter les contrôles de navigation
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');
    };

    initMap();

    // Gérer le nettoyage
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Mettre à jour la carte quand les données changent
  useEffect(() => {
    if (!map.current || !extractedData?.coordonnees_parcelle) return;

    // Attendre que la carte soit chargée
    if (!map.current.isStyleLoaded()) {
      map.current.on('styledata', () => {
        updateMapWithData();
      });
      return;
    }

    updateMapWithData();
  }, [extractedData]);

  // Mettre à jour les couches GeoJSON quand elles changent
  useEffect(() => {
    if (!map.current || Object.keys(availableLayers).length === 0) return;

    // Attendre que la carte soit chargée
    if (!map.current.isStyleLoaded()) {
      map.current.on('styledata', () => {
        addRegulatoryLayers();
      });
      return;
    }

    addRegulatoryLayers();
  }, [availableLayers, activeLayers]);

  // Fonction pour ajouter les couches réglementaires GeoJSON
  const addRegulatoryLayers = () => {
    if (!map.current) return;

    console.log('Ajout des couches réglementaires GeoJSON...');

    // Parcourir toutes les couches disponibles
    Object.entries(availableLayers).forEach(([layerName, geojsonData]) => {
      if (!activeLayers[layerName] || !geojsonData) return;

      const layerMetadata = geojsonService.getLayerMetadata(layerName);
      if (!layerMetadata) return;

      console.log(`Ajout de la couche ${layerName}:`, geojsonData);

      // Supprimer la source existante si elle existe
      if (map.current.getSource(`${layerName}-source`)) {
        map.current.removeLayer(`${layerName}-fill`);
        map.current.removeLayer(`${layerName}-stroke`);
        map.current.removeSource(`${layerName}-source`);
      }

      // Ajouter la source
      map.current.addSource(`${layerName}-source`, {
        type: 'geojson',
        data: geojsonData
      });

      // Ajouter les layers
      map.current.addLayer({
        id: `${layerName}-fill`,
        type: 'fill',
        source: `${layerName}-source`,
        paint: {
          'fill-color': layerMetadata.color,
          'fill-opacity': layerMetadata.opacity
        }
      });

      map.current.addLayer({
        id: `${layerName}-stroke`,
        type: 'line',
        source: `${layerName}-source`,
        paint: {
          'line-color': layerMetadata.strokeColor,
          'line-width': layerMetadata.strokeWidth,
          'line-dasharray': [2, 2]
        }
      });
    });
  };

  const updateMapWithData = () => {
    if (!map.current || !extractedData?.coordonnees_parcelle || !Array.isArray(extractedData.coordonnees_parcelle)) {
      console.warn('Données de parcelle invalides:', extractedData?.coordonnees_parcelle);
      return;
    }

    console.log('Données extraites:', extractedData);
    console.log('Coordonnées de la parcelle:', extractedData.coordonnees_parcelle);

    const center = getMapCenter();
    console.log('Centre de la carte calculé:', center);
    map.current.setCenter(center);

    // Créer le GeoJSON pour la parcelle
    const coordinates = convertCoordinatesToMapLibre(extractedData.coordonnees_parcelle);
    console.log('Coordonnées converties pour MapLibre:', coordinates);
    
    const parcelGeoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates]
      },
      properties: {
        name: 'Parcelle analysée',
        empietement: extractedData.empietement
      }
    };

    // Supprimer les sources et layers existants
    if (map.current.getSource('parcel')) {
      map.current.removeLayer('parcel-fill');
      map.current.removeLayer('parcel-stroke');
      map.current.removeSource('parcel');
    }

    // Ajouter la source de données
    console.log('Ajout de la source GeoJSON:', parcelGeoJSON);
    map.current.addSource('parcel', {
      type: 'geojson',
      data: parcelGeoJSON
    });

    // Ajouter les layers
    console.log('Ajout des layers de la parcelle...');
    map.current.addLayer({
      id: 'parcel-fill',
      type: 'fill',
      source: 'parcel',
      paint: {
        'fill-color': extractedData.empietement ? '#ef4444' : '#3b82f6',
        'fill-opacity': 0.3
      }
    });

    map.current.addLayer({
      id: 'parcel-stroke',
      type: 'line',
      source: 'parcel',
      paint: {
        'line-color': extractedData.empietement ? '#dc2626' : '#2563eb',
        'line-width': 3
      }
    });

    console.log('Layers ajoutés avec succès');

    // Ajouter les couches réglementaires si disponibles
    addRegulatoryLayers();

    // Ajouter un marqueur central
    if (map.current.getSource('marker')) {
      map.current.removeLayer('marker');
      map.current.removeSource('marker');
    }

    map.current.addSource('marker', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: center
        },
        properties: {
          name: 'Centre de la parcelle'
        }
      }
    });

    map.current.addLayer({
      id: 'marker',
      type: 'circle',
      source: 'marker',
      paint: {
        'circle-color': extractedData.empietement ? '#ef4444' : '#10b981',
        'circle-radius': 8,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2
      }
    });

    // Ajouter un popup au clic sur le marqueur
    map.current.on('click', 'marker', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;

      // Créer le popup
      new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-gray-800 mb-2">Centre de la parcelle</h3>
            <p class="text-sm text-gray-600">
              Coordonnées: ${center[1].toFixed(6)}, ${center[0].toFixed(6)}
            </p>
            <div class="mt-2 text-xs">
              <p><strong>Statut:</strong> ${extractedData.empietement ? 'Empiètement détecté' : 'Conforme'}</p>
              <p><strong>Parcelle libre:</strong> ${extractedData.parcelle_libre_finale?.includes('EMPTY') ? 'Aucune' : 'Disponible'}</p>
            </div>
          </div>
        `)
        .addTo(map.current);
    });

    // Changer le curseur au survol
    map.current.on('mouseenter', 'marker', () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'marker', () => {
      map.current.getCanvas().style.cursor = '';
    });
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
                  {extractedData ? 'Terrain analysé' : 'Aucune donnée'}
                </p>
              </div>
            </div>
            
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={loadTestData}
                      className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>Données de test</span>
                    </button>
                    <button
                      onClick={loadGeoJSONLayers}
                      disabled={layersLoading}
                      className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>{layersLoading ? 'Chargement...' : 'Recharger couches'}</span>
                    </button>
                    <button
                      onClick={() => setShowCoordinateAnalyzer(true)}
                      className="flex items-center space-x-2 bg-[#367C55] text-white px-4 py-2 rounded-lg hover:bg-[#2d5f44] transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Analyser des coordonnées</span>
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

            {extractedData ? (
              <>
                {/* Debug des données */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Debug (dev only)</h4>
                    <pre className="text-xs text-yellow-700 overflow-auto max-h-32">
                      {JSON.stringify(extractedData, null, 2)}
                    </pre>
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
                    {extractedData.coordonnees_parcelle && Array.isArray(extractedData.coordonnees_parcelle) ? (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {extractedData.coordonnees_parcelle.map((coord, index) => (
                          <div key={index} className="text-center">
                            <div className="text-gray-600 text-xs">P{index + 1}</div>
                            <div className="font-mono text-xs">
                              {coord.x?.toFixed(1) || 'N/A'}
                            </div>
                            <div className="font-mono text-xs">
                              {coord.y?.toFixed(1) || 'N/A'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Aucune coordonnée disponible</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">Aucune donnée topographique disponible</p>
                <button
                  onClick={() => setShowCoordinateAnalyzer(true)}
                  className="bg-[#367C55] text-white px-4 py-2 rounded-lg hover:bg-[#2d5f44] transition-colors duration-200"
                >
                  Analyser des coordonnées
                </button>
              </div>
            )}

                  {/* Contrôles des couches */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-3">Couches réglementaires</h3>
                    {layersLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#367C55] mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Chargement des couches...</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {Object.entries(availableLayers).map(([layerName, geojsonData]) => {
                          const metadata = geojsonService.getLayerMetadata(layerName);
                          const isActive = activeLayers[layerName] || false;
                          
                          if (!metadata) return null;
                          
                          return (
                            <div key={layerName} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                              <input
                                type="checkbox"
                                id={`layer-${layerName}`}
                                checked={isActive}
                                onChange={(e) => {
                                  setActiveLayers(prev => ({
                                    ...prev,
                                    [layerName]: e.target.checked
                                  }));
                                }}
                                className="w-4 h-4 text-[#367C55] border-gray-300 rounded focus:ring-[#367C55]"
                              />
                              <div 
                                className="w-4 h-4 rounded border-2"
                                style={{
                                  backgroundColor: isActive ? metadata.color : '#e5e7eb',
                                  borderColor: isActive ? metadata.strokeColor : '#9ca3af'
                                }}
                              ></div>
                              <label 
                                htmlFor={`layer-${layerName}`}
                                className="flex-1 text-sm cursor-pointer"
                              >
                                <div className="font-medium text-gray-800">{metadata.name}</div>
                                <div className="text-xs text-gray-500">{metadata.description}</div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Légende */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Légende</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 border-2 rounded ${extractedData?.empietement ? 'bg-red-500 border-red-700' : 'bg-blue-500 border-blue-700'}`}></div>
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

        {/* Carte MapLibre */}
        <div className="flex-1">
          <div ref={mapContainer} className="w-full h-full" />
        </div>
      </div>

      {/* Modal pour l'analyseur de coordonnées */}
      {showCoordinateAnalyzer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Analyse de coordonnées</h2>
              <button
                onClick={() => setShowCoordinateAnalyzer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <CoordinateAnalyzer onAnalysisComplete={handleCoordinateAnalysisComplete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarteTopographie;