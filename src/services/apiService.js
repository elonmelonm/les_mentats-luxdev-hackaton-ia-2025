// Service API pour communiquer avec l'API FastAPI
// Utilise le proxy Vite configuré dans vite.config.js
const API_BASE_URL = '';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Méthode générique pour les appels API
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  // Analyser une image via OCR
  async analyzeImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseURL}/api/analyse/img`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'analyse d\'image:', error);
      throw error;
    }
  }

  // Analyser des coordonnées
  async analyzeCoordinates(coordinates) {
    return this.makeRequest('/api/analyse/coords', {
      method: 'POST',
      body: JSON.stringify(coordinates),
    });
  }

  // Vérifier la santé de l'API
  async healthCheck() {
    try {
      const response = await this.makeRequest('/api');
      return response;
    } catch (error) {
      console.error('L\'API n\'est pas accessible:', error);
      throw error;
    }
  }
}

// Instance singleton
const apiService = new ApiService();

export default apiService;
