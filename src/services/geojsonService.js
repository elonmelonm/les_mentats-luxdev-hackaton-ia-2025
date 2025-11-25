// Service pour charger et gérer les fichiers GeoJSON des couches réglementaires

class GeoJSONService {
  constructor() {
    this.cache = new Map();
    this.basePath = '/src/data/';
  }

  // Définition des couches disponibles avec leurs propriétés
  getLayerDefinitions() {
    return {
      'aif': {
        name: 'AIF (Aires d\'Intérêt Foncier)',
        color: '#ff6b6b',
        opacity: 0.3,
        strokeColor: '#d63031',
        strokeWidth: 2,
        description: 'Zones d\'intérêt foncier réglementées'
      },
      'dpl': {
        name: 'DPL (Domaine Public Lacustre)',
        color: '#4ecdc4',
        opacity: 0.3,
        strokeColor: '#00b894',
        strokeWidth: 2,
        description: 'Domaine public des lacs et cours d\'eau'
      },
      'dpm': {
        name: 'DPM (Domaine Public Maritime)',
        color: '#45b7d1',
        opacity: 0.3,
        strokeColor: '#0984e3',
        strokeWidth: 2,
        description: 'Domaine public maritime et côtier'
      },
      'air_proteges': {
        name: 'Aires Protégées',
        color: '#a29bfe',
        opacity: 0.3,
        strokeColor: '#6c5ce7',
        strokeWidth: 2,
        description: 'Zones protégées et réserves naturelles'
      },
      'parcelles': {
        name: 'Parcelles Cadastrales',
        color: '#fd79a8',
        opacity: 0.2,
        strokeColor: '#e84393',
        strokeWidth: 1,
        description: 'Parcelles cadastrales enregistrées'
      },
      'restriction': {
        name: 'Restrictions',
        color: '#fdcb6e',
        opacity: 0.3,
        strokeColor: '#e17055',
        strokeWidth: 2,
        description: 'Zones avec restrictions d\'usage'
      },
      'zone_inondable': {
        name: 'Zones Inondables',
        color: '#74b9ff',
        opacity: 0.3,
        strokeColor: '#0984e3',
        strokeWidth: 2,
        description: 'Zones à risque d\'inondation'
      },
      'litige': {
        name: 'Litiges',
        color: '#e17055',
        opacity: 0.4,
        strokeColor: '#d63031',
        strokeWidth: 2,
        description: 'Zones en litige foncier'
      },
      'enregistrement individuel': {
        name: 'Enregistrement Individuel',
        color: '#00b894',
        opacity: 0.3,
        strokeColor: '#00a085',
        strokeWidth: 2,
        description: 'Parcelles en cours d\'enregistrement individuel'
      },
      'tf_demembres': {
        name: 'Titres Fonciers Démembrés',
        color: '#6c5ce7',
        opacity: 0.3,
        strokeColor: '#5f3dc4',
        strokeWidth: 2,
        description: 'Titres fonciers démembrés'
      },
      'tf_en_cours': {
        name: 'Titres Fonciers en Cours',
        color: '#fdcb6e',
        opacity: 0.3,
        strokeColor: '#e17055',
        strokeWidth: 2,
        description: 'Titres fonciers en cours de traitement'
      },
      'tf_etat': {
        name: 'Titres Fonciers d\'État',
        color: '#636e72',
        opacity: 0.3,
        strokeColor: '#2d3436',
        strokeWidth: 2,
        description: 'Titres fonciers appartenant à l\'État'
      },
      'titre_reconstitue': {
        name: 'Titres Reconstitués',
        color: '#00cec9',
        opacity: 0.3,
        strokeColor: '#00b894',
        strokeWidth: 2,
        description: 'Titres fonciers reconstitués'
      }
    };
  }

  // Charger un fichier GeoJSON
  async loadGeoJSON(layerName) {
    // Vérifier le cache
    if (this.cache.has(layerName)) {
      return this.cache.get(layerName);
    }

    try {
      const response = await fetch(`${this.basePath}${layerName}.geojson`);
      
      if (!response.ok) {
        throw new Error(`Erreur de chargement: ${response.status} ${response.statusText}`);
      }

      const geojson = await response.json();
      
      // Valider la structure GeoJSON
      if (!geojson.type || !geojson.features) {
        throw new Error('Format GeoJSON invalide');
      }

      // Mettre en cache
      this.cache.set(layerName, geojson);
      
      console.log(`✅ Couche ${layerName} chargée avec succès:`, geojson);
      return geojson;

    } catch (error) {
      console.error(`❌ Erreur lors du chargement de ${layerName}:`, error);
      throw error;
    }
  }

  // Charger plusieurs couches en parallèle
  async loadMultipleLayers(layerNames) {
    const promises = layerNames.map(name => this.loadGeoJSON(name));
    
    try {
      const results = await Promise.allSettled(promises);
      
      const loadedLayers = {};
      const errors = [];

      results.forEach((result, index) => {
        const layerName = layerNames[index];
        
        if (result.status === 'fulfilled') {
          loadedLayers[layerName] = result.value;
        } else {
          errors.push({ layer: layerName, error: result.reason });
        }
      });

      if (errors.length > 0) {
        console.warn('Certaines couches n\'ont pas pu être chargées:', errors);
      }

      return { loadedLayers, errors };

    } catch (error) {
      console.error('Erreur lors du chargement des couches:', error);
      throw error;
    }
  }

  // Charger toutes les couches disponibles
  async loadAllLayers() {
    const layerNames = Object.keys(this.getLayerDefinitions());
    return this.loadMultipleLayers(layerNames);
  }

  // Obtenir les métadonnées d'une couche
  getLayerMetadata(layerName) {
    const definitions = this.getLayerDefinitions();
    return definitions[layerName] || null;
  }

  // Vider le cache
  clearCache() {
    this.cache.clear();
  }

  // Obtenir les statistiques d'une couche
  getLayerStats(geojson) {
    if (!geojson || !geojson.features) {
      return null;
    }

    const stats = {
      totalFeatures: geojson.features.length,
      geometryTypes: {},
      bounds: null
    };

    // Compter les types de géométries
    geojson.features.forEach(feature => {
      const type = feature.geometry?.type || 'unknown';
      stats.geometryTypes[type] = (stats.geometryTypes[type] || 0) + 1;
    });

    // Calculer les limites (bounding box)
    if (geojson.features.length > 0) {
      let minLng = Infinity, minLat = Infinity;
      let maxLng = -Infinity, maxLat = -Infinity;

      geojson.features.forEach(feature => {
        if (feature.geometry?.coordinates) {
          this.calculateBounds(feature.geometry, (lng, lat) => {
            minLng = Math.min(minLng, lng);
            minLat = Math.min(minLat, lat);
            maxLng = Math.max(maxLng, lng);
            maxLat = Math.max(maxLat, lat);
          });
        }
      });

      if (minLng !== Infinity) {
        stats.bounds = {
          minLng, minLat, maxLng, maxLat,
          center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2]
        };
      }
    }

    return stats;
  }

  // Calculer les limites d'une géométrie
  calculateBounds(geometry, callback) {
    if (!geometry || !geometry.coordinates) return;

    const coords = geometry.coordinates;

    switch (geometry.type) {
      case 'Point':
        callback(coords[0], coords[1]);
        break;
      case 'LineString':
      case 'MultiPoint':
        coords.forEach(coord => callback(coord[0], coord[1]));
        break;
      case 'Polygon':
      case 'MultiLineString':
        coords.forEach(ring => {
          ring.forEach(coord => callback(coord[0], coord[1]));
        });
        break;
      case 'MultiPolygon':
        coords.forEach(polygon => {
          polygon.forEach(ring => {
            ring.forEach(coord => callback(coord[0], coord[1]));
          });
        });
        break;
    }
  }
}

// Instance singleton
const geojsonService = new GeoJSONService();

export default geojsonService;
