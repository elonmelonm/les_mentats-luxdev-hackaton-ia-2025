import React, { useState } from 'react';
import { MapPinIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import apiService from '../services/apiService';

const CoordinateAnalyzer = ({ onAnalysisComplete }) => {
  const [coordinates, setCoordinates] = useState([
    { x: '', y: '' },
    { x: '', y: '' },
    { x: '', y: '' },
    { x: '', y: '' }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleCoordinateChange = (index, field, value) => {
    const newCoordinates = [...coordinates];
    newCoordinates[index] = {
      ...newCoordinates[index],
      [field]: parseFloat(value) || 0
    };
    setCoordinates(newCoordinates);
  };

  const addCoordinate = () => {
    setCoordinates([...coordinates, { x: '', y: '' }]);
  };

  const removeCoordinate = (index) => {
    if (coordinates.length > 3) {
      setCoordinates(coordinates.filter((_, i) => i !== index));
    }
  };

  const handleAnalyze = async () => {
    // Validation des coordonnées
    const validCoordinates = coordinates.filter(coord => coord.x !== '' && coord.y !== '');
    
    if (validCoordinates.length < 3) {
      setError('Veuillez saisir au moins 3 points pour former un polygone');
      return;
    }

    // Vérifier que les coordonnées sont dans une plage raisonnable (approximativement le Bénin)
    const isValidRange = validCoordinates.every(coord => 
      coord.x > 300000 && coord.x < 500000 && 
      coord.y > 700000 && coord.y < 900000
    );

    if (!isValidRange) {
      setError('Les coordonnées semblent être en dehors de la zone du Bénin. Veuillez vérifier vos coordonnées.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await apiService.analyzeCoordinates(validCoordinates);
      console.log('Résultat de l\'analyse:', result);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('Erreur lors de l\'analyse:', err);
      setError(err.message || 'Erreur lors de l\'analyse des coordonnées');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetCoordinates = () => {
    setCoordinates([
      { x: '', y: '' },
      { x: '', y: '' },
      { x: '', y: '' },
      { x: '', y: '' }
    ]);
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#367C55] mb-6 flex items-center">
        <MapPinIcon className="h-6 w-6 mr-2" />
        Analyse de coordonnées
      </h2>

      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Saisissez les coordonnées de votre parcelle pour analyser les empiètements potentiels.
          Les coordonnées doivent être en format UTM (zone 31N pour le Bénin).
        </p>

        {/* Saisie des coordonnées */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">Coordonnées de la parcelle</h3>
          
          {coordinates.map((coord, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600 w-8">
                P{index + 1}:
              </span>
              
              <div className="flex-1 flex space-x-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">X (Easting)</label>
                  <input
                    type="number"
                    value={coord.x}
                    onChange={(e) => handleCoordinateChange(index, 'x', e.target.value)}
                    placeholder="Ex: 395400"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#367C55] focus:border-transparent"
                    disabled={isAnalyzing}
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Y (Northing)</label>
                  <input
                    type="number"
                    value={coord.y}
                    onChange={(e) => handleCoordinateChange(index, 'y', e.target.value)}
                    placeholder="Ex: 793850"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#367C55] focus:border-transparent"
                    disabled={isAnalyzing}
                  />
                </div>
              </div>

              {coordinates.length > 3 && (
                <button
                  onClick={() => removeCoordinate(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                  disabled={isAnalyzing}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addCoordinate}
            className="flex items-center space-x-2 text-[#367C55] hover:text-[#2d5f44] text-sm font-medium"
            disabled={isAnalyzing}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Ajouter un point</span>
          </button>
        </div>

        {/* Plage de coordonnées recommandée */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Plage de coordonnées recommandée (Bénin)</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>X (Easting):</strong> 300,000 - 500,000</p>
            <p><strong>Y (Northing):</strong> 700,000 - 900,000</p>
            <p><strong>Système:</strong> UTM Zone 31N (WGS84)</p>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || coordinates.filter(c => c.x !== '' && c.y !== '').length < 3}
            className="flex-1 bg-[#367C55] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2d5f44] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyse en cours...</span>
              </>
            ) : (
              <>
                <MapPinIcon className="h-5 w-5" />
                <span>Analyser les coordonnées</span>
              </>
            )}
          </button>

          <button
            onClick={resetCoordinates}
            disabled={isAnalyzing}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoordinateAnalyzer;
