
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import des composants d'analyse
import ImageAnalyzer from '../components/ImageAnalyzer';
import AnalysisResults from '../components/AnalysisResults';
import apiService from '../services/apiService';

export default function Topographie() {
  const navigate = useNavigate();
  
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fonction pour gérer les résultats de l'analyse
  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setSuccess('Analyse terminée avec succès !');
    setError('');
  };

  // Fonction pour gérer les erreurs d'analyse
  const handleAnalysisError = (errorMessage) => {
    setError(errorMessage);
    setSuccess('');
  };

  // Fonction pour ouvrir la carte avec les résultats
  const openMapPage = () => {
    if (analysisResults) {
      localStorage.setItem('topographyData', JSON.stringify(analysisResults));
      navigate('/carte-topographie');
    }
  };

  // Fonction pour recommencer l'analyse
  const resetAnalysis = () => {
    setAnalysisResults(null);
    setError('');
    setSuccess('');
  };

  // Coordonnées par défaut (Cotonou, Bénin)
  const defaultPosition = [6.3725, 2.3544];

  return (
    <div className="min-h-screen bg-[#EDEDED] py-8 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec fond dégradé */}
        <div className="text-center mb-12 p-12 rounded-xl" style={{ background: 'linear-gradient(135deg, #1B4332, #95D5B2)' }}>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Services de Topographie
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
          </div>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Chargez votre relevé topographiques pour une analyse précise et professionnelle
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Section Upload et Analyse */}
          <div className="space-y-6">
            {!analysisResults ? (
              <div className="bg-whit rounded-lg shadow-lg p-6">
                <ImageAnalyzer onAnalysisComplete={handleAnalysisComplete} />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Résumé de l'analyse */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#367C55]">
                      Résultats de l'analyse
                    </h2>
                    <button
                      onClick={resetAnalysis}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Nouvelle analyse
                    </button>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      {analysisResults.empietement ? (
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      ) : (
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <h3 className={`text-xl mb-2 font-medium ${analysisResults.empietement ? 'text-red-600' : 'text-green-600'}`}>
                      <span className='font-semibold text-gray-800'>Empiètement détecté:{' '}</span> 
                      {analysisResults.empietement ? 'Oui' : 'Non'}
                    </h3>
                    {analysisResults.empietement ? (
                      <p className="text-gray-600">
                        La parcelle présente des conflits avec les couches réglementaires. La parcelle libre finale est <span className='font-semibold text-red-600'>indisponible</span>.
                      </p>
                    ) : (
                      <p className="text-gray-600">
                        La parcelle est conforme aux réglementations. Une parcelle libre est <span className='font-semibold text-green-600'>disponible</span>.
                      </p>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={openMapPage}
                      className={`${analysisResults.empietement ? 'bg-red-600 hover:bg-red-700' : 'bg-[#367C55] hover:bg-[#2d5f44]'} text-white py-3 px-8 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                    >
                      Voir sur la carte interactive
                    </button>
                  </div>
                </div>

                {/* Résultats détaillés */}
                <AnalysisResults results={analysisResults} />
              </div>
            )}

            {/* Messages d'erreur et succès */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600">{success}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
