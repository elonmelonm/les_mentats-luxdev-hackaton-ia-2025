import React, { useState } from 'react';
import { DocumentArrowUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import apiService from '../services/apiService';

const ImageAnalyzer = ({ onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Vérifier le format du fichier
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp', 'image/tiff'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format de fichier non supporté. Utilisez PNG, JPG, JPEG, BMP ou TIFF.');
      return;
    }

    // Vérifier la taille du fichier (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Le fichier est trop volumineux. Taille maximale: 10MB.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await apiService.analyzeImage(file);
      console.log('Résultat de l\'analyse:', result);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('Erreur lors de l\'analyse:', err);
      setError(err.message || 'Erreur lors de l\'analyse de l\'image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.bmp,.tiff"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isAnalyzing}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <DocumentArrowUpIcon className="h-12 w-12 text-gray-400" />
          
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">
              {isAnalyzing ? 'Analyse en cours...' : 'Glissez votre image ici'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              ou cliquez pour sélectionner un fichier
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Formats supportés: PNG, JPG, JPEG, BMP, TIFF (max 10MB)
            </p>
          </div>

          {isAnalyzing && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Traitement en cours...</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
