
import React, { useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration des icônes Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useNavigate } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Topographie() {
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [extractedData, setExtractedData] = useState(null);
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

  // Gestion de l'upload et extraction (SIMULATION)
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess('');

    try {
      // SIMULATION - Étape 1: Upload du fichier
      console.log('🚀 SIMULATION: Début de l\'upload...');
      
      // Simulation de l'upload avec progression
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Simulation de l'upload (2 secondes)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress(100);
      setIsUploading(false);
      console.log('✅ SIMULATION: Upload terminé');
      
      // SIMULATION - Étape 2: Extraction des données
      setIsExtracting(true);
      setSuccess('Fichier téléversé avec succès ! Extraction des données en cours...');
      console.log('🔍 SIMULATION: Début de l\'extraction...');

      // Simulation de l'extraction (3 secondes)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Données simulées basées sur le type de fichier
      const simulatedData = generateSimulatedData(selectedFile);
      
      setExtractedData(simulatedData);
      setIsExtracting(false);
      setSuccess('Extraction terminée ! Données disponibles pour l\'affichage sur la carte.');
      console.log('✅ SIMULATION: Extraction terminée', simulatedData);

    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message || 'Une erreur est survenue lors du traitement');
      setIsUploading(false);
      setIsExtracting(false);
      setUploadProgress(0);
    }
  };

  // Fonction pour générer des données simulées dans le format API
  const generateSimulatedData = (file) => {
    // Générer des coordonnées réalistes autour de Cotonou
    const baseX = 395400 + (Math.random() - 0.5) * 100;
    const baseY = 793850 + (Math.random() - 0.5) * 100;
    
    // Générer une parcelle polygonale
    const coordinates = [
      { x: baseX, y: baseY },
      { x: baseX + 20 + Math.random() * 30, y: baseY - 10 - Math.random() * 20 },
      { x: baseX + 15 + Math.random() * 25, y: baseY - 30 - Math.random() * 20 },
      { x: baseX - 10 - Math.random() * 20, y: baseY - 15 - Math.random() * 15 }
    ];

    // Créer les strings de géométrie
    const polygonCoords = coordinates.map(coord => `${coord.x} ${coord.y} 0`).join(', ');
    const polygonString = `POLYGON Z ((${polygonCoords}, ${coordinates[0].x} ${coordinates[0].y} 0))`;

    // Générer des intersections aléatoires
    const hasIntersection = Math.random() > 0.5;
    const hasEmpietement = Math.random() > 0.3;

    return {
      // Métadonnées du fichier (pour l'affichage)
      _metadata: {
        fileName: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        fileType: file.type,
        extractedAt: new Date().toISOString(),
        confidence: Math.floor(Math.random() * 15 + 85) + '%',
      },
      
      // Données dans le format exact de l'API
      aif: {
        has_intersection: hasIntersection,
        intersections_sur_couche: hasIntersection ? polygonString : null,
        reste_sur_couche: hasIntersection ? null : polygonString
      },
      dpl: {
        has_intersection: Math.random() > 0.7,
        intersections_sur_couche: Math.random() > 0.7 ? polygonString : null,
        reste_sur_couche: Math.random() > 0.7 ? null : polygonString
      },
      dpm: {
        has_intersection: Math.random() > 0.8,
        intersections_sur_couche: Math.random() > 0.8 ? polygonString : null,
        reste_sur_couche: Math.random() > 0.8 ? null : polygonString
      },
      parcelle_libre_finale: hasEmpietement ? 
        "POLYGON Z EMPTY" : 
        `POLYGON Z ((${polygonCoords}, ${coordinates[0].x} ${coordinates[0].y} 0))`,
      union_intersections: polygonString,
      empietement: hasEmpietement,
      coordonnees_parcelle: coordinates
    };
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

  // Fonction pour ouvrir la carte dans une nouvelle page
  const openMapPage = () => {
    if (extractedData) {
      // Sauvegarder les données dans le localStorage pour la page carte
      localStorage.setItem('topographyData', JSON.stringify(extractedData));
      // Naviguer vers la page carte
      navigate('/carte-topographie');
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

        <div className="grid grid-cols-1 gap-8">
          {/* Section Upload */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg  shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#367C55] mb-6">
                Téléverser un document
              </h2>
              {!extractedData && (
                <>
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
                              className="mx-auto max-h-20 rounded-lg shadow-lg"
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
                </>
              )}
              

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
              {(isUploading || isExtracting) && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>
                      {isUploading ? 'Téléversement en cours...' : 'Extraction des données...'}
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#367C55] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  
                  {/* Loader d'extraction */}
                  {isExtracting && (
                    <div className="mt-3 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#367C55]"></div>
                      <span className="ml-2 text-sm text-gray-600">
                        Analyse du document en cours...
                      </span>
                    </div>
                  )}
                </div>
              )}

              {!extractedData && (
                <>
                {/* Bouton d'upload */}
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading || isExtracting}
                  className="w-full mt-6 bg-[#367C55] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2d5f44] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isUploading ? 'Téléversement...' : isExtracting ? 'Extraction...' : 'Téléverser'}
                </button>
                </>
              )}
            </div>

            {/* Section Carte - Affichage conditionnel */}
            {extractedData && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-6">
                  Statut de l'analyse
                </h2>
                
                <div className="text-center">
                  <div className="mb-6">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    {extractedData.empietement ? (
                      <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      
                    )}
                    </div>
                    <h3 className={`text-xl mb-2 font-medium ${extractedData.empietement ? 'text-red-600' : 'text-green-600'}`}>
                      <span className='font-semibold text-gray-800'>Empiètement détecté:{' '}</span> 
                      {extractedData.empietement ? 'Oui' : 'Non'}
                    </h3>
                      {extractedData.empietement ? (
                    <p className="text-gray-600">
                      La parcelle présente des conflits avec les couches réglementaires. La parcelle libre finale est <span className='font-semibold text-red-600'>indisponible</span>.
                    </p>
                    ) : (
                      <p className="text-gray-600">
                      La parcelle est conforme aux réglementations. Une parcelle libre est <span className='font-semibold text-green-600'>disponible</span> .
                    </p>
                    )}
                  </div>
                  
                  <button
                    onClick={openMapPage}
                    className={`${extractedData.empietement ? 'bg-red-600' : 'bg-[#367C55]'} text-white py-3 px-8 rounded-lg font-semibold hover:bg-[#2d5f44] transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                  >
                    🗺️ Ouvrir la carte interactive
                  </button>
                </div>
              </div>
            )}
             {/* Affichage des données extraites */}
             {extractedData && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#367C55] mb-3">
                    📊 Analyse topographique (SIMULATION)
                  </h3>
                  
                  {/* Informations du fichier */}
                  {extractedData._metadata && (
                    <div className="mb-4 p-3 bg-white rounded border">
                      <h4 className="font-semibold text-gray-700 mb-2">Informations du fichier</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Nom:</span>
                          <div className="font-medium text-xs">{extractedData._metadata.fileName}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Taille:</span>
                          <div className="font-medium">{extractedData._metadata.fileSize}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Confiance:</span>
                          <div className="font-medium text-green-600">{extractedData._metadata.confidence}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <div className="font-medium text-xs">{extractedData._metadata.fileType}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Coordonnées de la parcelle */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Coordonnées de la parcelle</h4>
                    <div className="bg-white p-3 rounded border">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        {extractedData.coordonnees_parcelle.map((coord, index) => (
                          <div key={index} className="text-center">
                            <div className="text-gray-600 text-xs">Point {index + 1}</div>
                            <div className="font-medium">
                              X: {coord.x.toFixed(2)}
                            </div>
                            <div className="font-medium">
                              Y: {coord.y.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Géométrie */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Géométrie de l'union des intersections</h4>
                    <div className="bg-gray-100 p-3 rounded border">
                      <code className="text-xs text-gray-700 break-all">
                        {extractedData.union_intersections}
                      </code>
                    </div>
                  </div>

                  {/* Résumé de l'analyse */}
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <h4 className="font-semibold text-gray-700 mb-2">📋 Résumé de l'analyse</h4>
                    <div className="text-sm text-gray-700">
                      {extractedData.empietement ? (
                        <p className="text-red-700">
                          ⚠️ <strong>Empiètement détecté:</strong> La parcelle présente des conflits avec les couches réglementaires. 
                          La parcelle libre finale est vide.
                        </p>
                      ) : (
                        <p className="text-green-700">
                          ✅ <strong>Aucun empiètement:</strong> La parcelle est conforme aux réglementations. 
                          Une parcelle libre est disponible.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Canvas caché pour la capture */}
        <canvas ref={cameraCanvasRef} className="hidden" />
      </div>
    </div>
  );
}
