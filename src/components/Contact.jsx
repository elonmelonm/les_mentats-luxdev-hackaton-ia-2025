
import React, { useState } from 'react';
import { 
  ArrowRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Fonctions de validation
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'nom':
        if (!value.trim()) {
          error = 'Le nom est obligatoire';
        } else if (value.trim().length < 2) {
          error = 'Le nom doit contenir au moins 2 caractères';
        } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value.trim())) {
          error = 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'L\'email est obligatoire';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Veuillez saisir un email valide';
        }
        break;

      case 'telephone':
        if (value.trim() && !/^(\+229|229)?[\s-]?[0-9]{2}[\s-]?[0-9]{2}[\s-]?[0-9]{2}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/.test(value.replace(/\s/g, ''))) {
          error = 'Format de téléphone invalide (ex: +229 XX XX XX XX XX)';
        }
        break;

      case 'sujet':
        if (!value) {
          error = 'Veuillez sélectionner un sujet';
        }
        break;

      case 'message':
        if (!value.trim()) {
          error = 'Le message est obligatoire';
        } else if (value.trim().length < 10) {
          error = 'Le message doit contenir au moins 10 caractères';
        } else if (value.trim().length > 1000) {
          error = 'Le message ne peut pas dépasser 1000 caractères';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Validation en temps réel après que l'utilisateur ait tapé
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });

    const error = validateField(name, formData[name]);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Marquer tous les champs comme touchés
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      alert('Message envoyé avec succès !');
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      });
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className=" lg:px-8  xl:px-16 py-16 min-h-screen flex flex-col items-center justify-center gap-12">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center gap-4">
        <span className="text-4xl font-bold">Contact</span>
        <span className="flex flex-row items-center justify-center gap-2">
          <span className="w-16 h-1 bg-[#367C55] rounded-full"></span>
          <span><EnvelopeIcon className="w-6 h-6 text-[#367C55]" /></span>
          <span className="w-16 h-1 bg-[#367C55] rounded-full"></span>
        </span>
        <span className="flex justify-center items-center gap-2 text-[18px] text-[#367C55] font-medium">
          <span className="font-semibold">
            Nous Contacter
          </span>
          <ArrowRightIcon className="w-4 h-4 mt-0.5" />
        </span>
      </div>

      <div className="grid grid-cols-1    gap-12 w-full max-w-6xl">
        {/* Formulaire de Contact */}
        <div className="bg-white  rounded-t-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-[#367C55] mb-6">Envoyez-nous un message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Indicateur d'erreurs globales */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <h4 className="text-red-800 font-semibold">Veuillez corriger les erreurs suivantes :</h4>
                </div>
                <ul className="mt-2 text-red-700 text-sm list-disc list-inside">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Nom et Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#367C55] focus:border-transparent transition-all duration-200 ${
                    errors.nom ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Votre nom"
                />
                {errors.nom && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.nom}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#367C55] focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#367C55] focus:border-transparent transition-all duration-200 ${
                  errors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="+229 XX XX XX XX XX"
              />
              {errors.telephone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.telephone}
                </p>
              )}
            </div>

            {/* Sujet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sujet *
              </label>
              <select
                name="sujet"
                value={formData.sujet}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#367C55] focus:border-transparent transition-all duration-200 ${
                  errors.sujet ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="cadastre">Demande de cadastre</option>
                <option value="topographie">Services de topographie</option>
                <option value="titre-foncier">Titre foncier</option>
                <option value="bornage">Bornage de terrain</option>
                <option value="information">Demande d'information</option>
                <option value="autre">Autre</option>
              </select>
              {errors.sujet && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.sujet}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message * ({formData.message.length}/1000)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                rows={5}
                maxLength={1000}
                className={`w-full px-4 py-3 border rounded-t-lg focus:ring-2 focus:ring-[#367C55] focus:border-transparent transition-all duration-200 resize-none ${
                  errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Décrivez votre demande en détail..."
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.message}
                </p>
              )}
            </div>

            {/* Bouton d'envoi */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-4 px-6 font-semibold transition-all duration-200 cursor-pointer ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#367C55] hover:bg-[#2d5f44] hover:shadow-lg transform hover:-translate-y-1'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Envoyer le message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Informations de Contact */}
        <div className="space-y-8">
          {/* Carte d'urgence */}
          <div className="bg-gradient-to-r from-[#367C55] to-[#2d5f44] rounded-t-lg shadow-lg p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Besoin d'aide urgente ?</h3>
            <p className="text-green-100 mb-4">
              Pour les demandes urgentes de cadastre ou de topographie, contactez-nous directement.
            </p>
            <button className="bg-white text-[#367C55] px-6 py-3 font-semibold hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
              Appeler maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
