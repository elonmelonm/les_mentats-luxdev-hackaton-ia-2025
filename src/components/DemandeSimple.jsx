import React, { useState } from 'react';

const DemandeSimple = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      console.log('Fichier sélectionné:', selectedFile);
      alert('Fichier téléversé avec succès !');
      setSelectedFile(null);
      // Reset the file input
      e.target.reset();
    } else {
      alert('Veuillez sélectionner un fichier');
    }
  };

  return (
    <section id="demande-section" className="py-20 ">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Faire une demande
            </h2>
            <p className="text-xl text-gray-600">
              Téléversez vos documents pour sécuriser votre propriété foncière
            </p>
          </div>

          <div className=" rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Documents à téléverser *
                </label>
                
                {/* Zone de glisser-déposer */}
                <div className="relative">
                  <div 
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 cursor-pointer ${
                      isDragOver 
                        ? 'border-blue-500 bg-blue-100' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    {/* Icône cloud */}
                    <div className="mx-auto mb-6">
                      <svg
                        className="mx-auto h-16 w-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    
                    {/* Texte principal */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Glissez-déposez vos fichiers ici
                    </h3>
                    
                    {/* Texte secondaire */}
                    <p className="text-gray-600 mb-6">
                      Téléchargez les documents nécessaires pour votre demande.
                    </p>
                    
                    {/* Séparateur */}
                    <p className="text-gray-500 mb-4">ou</p>
                    
                    {/* Bouton parcourir */}
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-6 py-3 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-colors duration-200 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Parcourir les fichiers
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  
                  {/* Indication des formats acceptés */}
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Formats acceptés : PDF, DOC, DOCX, JPG, PNG (max 10MB)
                  </p>
                </div>

                {/* Affichage du fichier sélectionné */}
                {selectedFile && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-green-600">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          document.getElementById('file-upload').value = '';
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Téléverser
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemandeSimple;
