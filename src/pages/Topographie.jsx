
import React, { useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration des icônes Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Topographie() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cameraStream, setCameraStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const cameraCanvasRef = useRef(null);

  // Détection mobile/tablette
  React.useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsMobile(isMobileDevice || isTablet || isTouchDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Validation des fichiers
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non autorisé. Formats acceptés : PDF, JPEG, JPG, PNG');
      return false;
    }

    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux. Taille maximale : 100MB');
      return false;
    }

    setError('');
    return true;
  };

  // Gestion du drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setSuccess('Fichier sélectionné avec succès');
      }
    }
  }, []);

  // Gestion de la sélection de fichier
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setSuccess('Fichier sélectionné avec succès');
    }
  };

  // Gestion de l'upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulation de l'upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setSuccess('Fichier téléversé avec succès !');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Gestion de la caméra
  const startCamera = async () => {
    try {
      console.log('🔍 Début de l\'accès à la caméra...');
      
      // Vérifier si getUserMedia est supporté
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Votre navigateur ne supporte pas l\'accès à la caméra');
        return;
      }

      // Vérifier les contraintes supportées
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('📹 Appareils vidéo disponibles:', videoDevices);

      // Configuration progressive avec fallback
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Caméra arrière
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      };

      console.log('🎥 Tentative d\'accès avec contraintes:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ Stream obtenu:', stream);
      console.log('📊 Tracks vidéo:', stream.getVideoTracks());

      setCameraStream(stream);
      setShowCamera(true);
      setError(''); // Clear any previous errors
      
      if (cameraVideoRef.current) {
        console.log('🎬 Configuration de l\'élément vidéo...');
        
        // Vérifier que le stream est valide
        if (!stream || stream.getVideoTracks().length === 0) {
          console.error('❌ Stream invalide ou pas de tracks vidéo');
          setError('Aucun flux vidéo disponible');
          return;
        }

        // Assigner le stream à l'élément vidéo
        cameraVideoRef.current.srcObject = stream;
        console.log('✅ Stream assigné à l\'élément vidéo');
        
        // Vérifier que l'assignation a fonctionné
        setTimeout(() => {
          console.log('🔍 Vérification après assignation:');
          console.log('- srcObject:', cameraVideoRef.current.srcObject);
          console.log('- readyState:', cameraVideoRef.current.readyState);
        }, 100);
        
        // Gestion des événements vidéo
        cameraVideoRef.current.onloadedmetadata = () => {
          console.log('📺 Métadonnées vidéo chargées');
          console.log('- Dimensions:', cameraVideoRef.current.videoWidth, 'x', cameraVideoRef.current.videoHeight);
          cameraVideoRef.current.play().then(() => {
            console.log('▶️ Vidéo en cours de lecture');
          }).catch(err => {
            console.error('❌ Erreur de lecture vidéo:', err);
          });
        };

        cameraVideoRef.current.oncanplay = () => {
          console.log('🎬 Vidéo prête à être lue');
        };

        cameraVideoRef.current.onerror = (err) => {
          console.error('❌ Erreur vidéo:', err);
          setError('Erreur lors de l\'affichage de la vidéo');
        };

        // Forcer la lecture après un délai
        setTimeout(() => {
          if (cameraVideoRef.current && cameraVideoRef.current.paused) {
            console.log('🔄 Tentative de lecture forcée...');
            cameraVideoRef.current.play().catch(err => {
              console.error('❌ Échec de la lecture forcée:', err);
            });
          }
        }, 1000);

        // Vérification supplémentaire après 2 secondes
        setTimeout(() => {
          if (cameraVideoRef.current) {
            console.log('🔍 Vérification finale:');
            console.log('- srcObject:', cameraVideoRef.current.srcObject);
            console.log('- readyState:', cameraVideoRef.current.readyState);
            console.log('- paused:', cameraVideoRef.current.paused);
            console.log('- videoWidth:', cameraVideoRef.current.videoWidth);
            console.log('- videoHeight:', cameraVideoRef.current.videoHeight);
            
            if (!cameraVideoRef.current.srcObject) {
              console.error('❌ srcObject toujours null après 2 secondes');
              setError('Impossible d\'assigner le flux vidéo à l\'élément');
            }
          }
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Erreur caméra:', error);
      let errorMessage = 'Impossible d\'accéder à la caméra';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permission d\'accès à la caméra refusée. Veuillez autoriser l\'accès et réessayer.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Aucune caméra trouvée sur cet appareil.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Votre navigateur ne supporte pas l\'accès à la caméra.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'La caméra est déjà utilisée par une autre application.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Configuration de caméra non supportée. Essayez avec une configuration plus simple.';
        // Essayer avec une configuration plus simple
        try {
          console.log('🔄 Tentative avec configuration simplifiée...');
          const simpleStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          setCameraStream(simpleStream);
          setShowCamera(true);
          setError('');
          
          if (cameraVideoRef.current) {
            cameraVideoRef.current.srcObject = simpleStream;
            cameraVideoRef.current.play();
          }
          return;
        } catch (simpleError) {
          console.error('❌ Échec avec configuration simple:', simpleError);
        }
      }
      
      setError(errorMessage);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        console.log('🛑 Arrêt du track:', track.label, track.readyState);
        track.stop();
      });
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  // Fonction de diagnostic
  const diagnoseCamera = () => {
    console.log('🔍 Diagnostic de la caméra:');
    console.log('- getUserMedia supporté:', !!navigator.mediaDevices?.getUserMedia);
    console.log('- HTTPS:', location.protocol === 'https:');
    console.log('- Localhost:', location.hostname === 'localhost' || location.hostname === '127.0.0.1');
    console.log('- User Agent:', navigator.userAgent);
    console.log('- Stream actuel:', cameraStream);
    console.log('- Tracks vidéo:', cameraStream ? cameraStream.getVideoTracks() : 'Aucun stream');
    
    if (cameraVideoRef.current) {
      console.log('- Élément vidéo:', cameraVideoRef.current);
      console.log('- srcObject:', cameraVideoRef.current.srcObject);
      console.log('- readyState:', cameraVideoRef.current.readyState);
      console.log('- paused:', cameraVideoRef.current.paused);
      console.log('- videoWidth:', cameraVideoRef.current.videoWidth);
      console.log('- videoHeight:', cameraVideoRef.current.videoHeight);
      console.log('- autoplay:', cameraVideoRef.current.autoplay);
      console.log('- muted:', cameraVideoRef.current.muted);
      console.log('- playsInline:', cameraVideoRef.current.playsInline);
    }

    // Test de création d'un nouveau stream
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('🧪 Test de création d\'un nouveau stream...');
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(testStream => {
          console.log('✅ Test stream créé:', testStream);
          console.log('- Tracks:', testStream.getVideoTracks());
          testStream.getTracks().forEach(track => track.stop());
        })
        .catch(err => {
          console.error('❌ Échec du test stream:', err);
        });
    }
  };

  const capturePhoto = () => {
    if (cameraVideoRef.current && cameraCanvasRef.current) {
      const video = cameraVideoRef.current;
      const canvas = cameraCanvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        if (validateFile(file)) {
          setSelectedFile(file);
          setSuccess('Photo capturée avec succès');
          stopCamera();
        }
      }, 'image/jpeg', 0.8);
    }
  };

  // Coordonnées par défaut (Cotonou, Bénin)
  const defaultPosition = [6.3725, 2.3544];

  return (
    <div className="min-h-screen bg-[#EDEDED] py-8 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#367C55] mb-4">
            Services de Topographie
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-1 bg-[#367C55] rounded-full"></div>
            <div className="w-1 h-1 bg-[#367C55] rounded-full"></div>
            <div className="w-12 h-1 bg-[#367C55] rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Téléversez vos documents topographiques pour une analyse précise et professionnelle
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section Upload */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#367C55] mb-6">
                Téléverser un document
              </h2>
              
              {/* Zone de drag & drop */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                  isDragOver 
                    ? 'border-[#367C55] bg-green-50' 
                    : 'border-gray-300 hover:border-[#367C55] hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    {/* Affichage de l'image sélectionnée */}
                    {selectedFile.type.startsWith('image/') ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Aperçu"
                          className="mx-auto max-h-48 rounded-lg shadow-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            setSuccess('');
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-[#367C55] rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-700">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            setSuccess('');
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    {/* Bouton caméra pour mobile/tablette */}
                    {/* {isMobile && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startCamera();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#367C55] text-white rounded-lg hover:bg-[#2d5f44] transition-colors duration-200 mx-auto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Prendre une photo
                      </button>
                    )} */}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-[#367C55] bg-opacity-10 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    
                    <div>
                      <p className="text-lg font-semibold text-gray-700">
                        Glissez-déposez votre fichier ici
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        ou cliquez pour sélectionner
                      </p>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      <p>Formats acceptés : PDF, JPEG, JPG, PNG</p>
                      <p>Taille maximale : 100MB</p>
                    </div>
                    
                    {/* Bouton caméra pour mobile/tablette */}
                    {/* {isMobile && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startCamera();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#367C55] text-white rounded-lg hover:bg-[#2d5f44] transition-colors duration-200 mx-auto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Prendre une photo
                      </button>
                    )} */}
                  </div>
                )}
              </div>

              {/* Input file caché */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpeg,.jpg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />



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

              {/* Barre de progression */}
              {isUploading && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Téléversement en cours...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#367C55] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Bouton d'upload */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full mt-6 bg-[#367C55] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2d5f44] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isUploading ? 'Téléversement...' : 'Téléverser'}
              </button>
            </div>
          </div>

          {/* Section Carte */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#367C55] mb-6">
              Carte Interactive
            </h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <MapContainer
                center={defaultPosition}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={defaultPosition}>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold text-[#367C55]">Cotonou, Bénin</h3>
                      <p className="text-sm text-gray-600">
                        Position par défaut pour les services de topographie
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>📍 Utilisez la carte pour localiser votre projet</p>
              <p>🗺️ Cliquez sur la carte pour ajouter des marqueurs</p>
            </div>
          </div>
        </div>

        {/* Canvas caché pour la capture */}
        <canvas ref={cameraCanvasRef} className="hidden" />
      </div>
    </div>
  );
}
