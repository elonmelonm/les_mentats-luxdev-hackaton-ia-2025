import React, { useEffect, useRef } from 'react';
import { CheckCircleIcon, XCircleIcon, MapIcon } from '@heroicons/react/24/outline';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const AnalysisResults = ({ results }) => {
  if (!results) return null;

  const layers = [
    { key: 'aif', label: 'AIF', description: 'Aires d\'Intérêt Foncier' },
    { key: 'air_proteges', label: 'Aires Protégées', description: 'Zones protégées' },
    { key: 'dpl', label: 'DPL', description: 'Domaine Privé de l\'État' },
    { key: 'dpm', label: 'DPM', description: 'Domaine Public Maritime' },
    { key: 'enregistrement_individuel', label: 'Enregistrement Individuel', description: 'Titres individuels' },
    { key: 'litige', label: 'Litiges', description: 'Zones en litige' },
    { key: 'parcelle', label: 'Parcelles', description: 'Parcelles existantes' },
    { key: 'restriction', label: 'Restrictions', description: 'Zones avec restrictions' },
    { key: 'tf_demembres', label: 'TF Démembrés', description: 'Titres fonciers démembrés' },
    { key: 'tf_en_cours', label: 'TF en Cours', description: 'Titres fonciers en cours' },
    { key: 'tf_etat', label: 'TF État', description: 'Titres fonciers de l\'État' },
    { key: 'titre_reconstitue', label: 'Titre Reconstitué', description: 'Titres reconstitués' },
    { key: 'zone_inondable', label: 'Zone Inondable', description: 'Zones inondables' },
  ];

  const hasEmpietement = results.empietement;
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize MapLibre map inspired by public/index.html
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [2.3158, 9.3077],
      zoom: 7,
    });

    // Controls
    map.addControl(new maplibregl.NavigationControl(), 'top-left');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }));

    // Optional: if results contain a GeoJSON to display (e.g., parcelle_libre_finale)
    map.on('load', () => {
      const maybeGeoJSON = results?.parcelle_libre_finale;
      if (maybeGeoJSON && typeof maybeGeoJSON === 'object' && (maybeGeoJSON.type === 'Feature' || maybeGeoJSON.type === 'FeatureCollection' || maybeGeoJSON.type === 'Polygon' || maybeGeoJSON.type === 'MultiPolygon')) {
        const featureCollection = maybeGeoJSON.type === 'FeatureCollection'
          ? maybeGeoJSON
          : { type: 'FeatureCollection', features: [maybeGeoJSON.type === 'Feature' ? maybeGeoJSON : { type: 'Feature', geometry: maybeGeoJSON, properties: {} }] };

        if (!map.getSource('analysis-geojson')) {
          map.addSource('analysis-geojson', {
            type: 'geojson',
            data: featureCollection,
          });
        }

        if (!map.getLayer('analysis-fill')) {
          map.addLayer({
            id: 'analysis-fill',
            type: 'fill',
            source: 'analysis-geojson',
            paint: {
              'fill-color': '#3b82f6',
              'fill-opacity': 0.25,
            },
          });
        }

        if (!map.getLayer('analysis-outline')) {
          map.addLayer({
            id: 'analysis-outline',
            type: 'line',
            source: 'analysis-geojson',
            paint: {
              'line-color': '#1d4ed8',
              'line-width': 2,
            },
          });
        }

        // Fit to bounds
        try {
          const coordinates = [];
          featureCollection.features.forEach((f) => {
            const geom = f.geometry;
            if (!geom) return;
            const collect = (coords) => {
              if (typeof coords[0] === 'number') {
                coordinates.push(coords);
              } else {
                coords.forEach(collect);
              }
            };
            collect(geom.coordinates);
          });
          if (coordinates.length > 0) {
            const lons = coordinates.map((c) => c[0]);
            const lats = coordinates.map((c) => c[1]);
            const minLon = Math.min(...lons);
            const minLat = Math.min(...lats);
            const maxLon = Math.max(...lons);
            const maxLat = Math.max(...lats);
            map.fitBounds([[minLon, minLat], [maxLon, maxLat]], { padding: 32, duration: 0 });
          }
        } catch (e) {
          // noop
        }
      }
    });

    return () => {
      map.remove();
    };
  }, [results]);

  return (
    <div className="space-y-6">
      {/* Résumé principal */}
      <div className={`p-6 rounded-lg border-2 ${
        hasEmpietement 
          ? 'bg-red-50 border-red-200' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center space-x-3">
          {hasEmpietement ? (
            <XCircleIcon className="h-8 w-8 text-red-500" />
          ) : (
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          )}
          <div>
            <h2 className={`text-xl font-bold ${
              hasEmpietement ? 'text-red-800' : 'text-green-800'
            }`}>
              {hasEmpietement ? 'Empiètement détecté' : 'Aucun empiètement'}
            </h2>
            <p className={`text-sm ${
              hasEmpietement ? 'text-red-600' : 'text-green-600'
            }`}>
              {hasEmpietement 
                ? 'La parcelle empiète sur une ou plusieurs zones réglementées'
                : 'La parcelle est libre de tout empiètement'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Carte d'analyse */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <MapIcon className="h-5 w-5" />
          <span>Carte</span>
        </h3>
        <div ref={mapContainerRef} className="w-full h-96 rounded-md" />
      </div>


      {/* Détails par couche */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <MapIcon className="h-5 w-5" />
          <span>Analyse par couche</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {layers.map((layer) => {
            const layerResult = results[layer.key];
            const hasIntersection = layerResult?.has_intersection || false;
            
            return (
              <div
                key={layer.key}
                className={`p-4 rounded-lg border ${
                  hasIntersection 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {hasIntersection ? (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{layer.label}</h4>
                      <p className="text-xs text-gray-600">{layer.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    hasIntersection
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {hasIntersection ? 'Empiètement' : 'Libre'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Informations sur la parcelle */}
      {results.coordonnees_parcelle && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Coordonnées de la parcelle
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {JSON.stringify(results.coordonnees_parcelle, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Parcelle libre finale */}
      {results.parcelle_libre_finale && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Zone libre finale
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {JSON.stringify(results.parcelle_libre_finale, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
