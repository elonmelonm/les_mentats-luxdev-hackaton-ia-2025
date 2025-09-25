import React from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/solid';
import Logo from '../assets/logo-andf-nobackground.png';

const Footer = () => {
  return (
    <footer className="bg-[#273344] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img src={Logo} alt="ANDF Logo" className="h-14 w-auto mr-3" />
              <div>
                <h2 className="text-xl font-bold">ANDF</h2>
                <p className="text-sm text-gray-200">Agence Nationale du Domaine et du Foncier</p>
              </div>
            </div>
            <p className="text-gray-200 text-sm max-w-md">
              L'ANDF accompagne les citoyens dans la sécurisation de leurs droits fonciers et la protection de leur patrimoine.
            </p>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Utiles</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-200 hover:text-white hover:underline">Accueil</Link></li>
              <li><Link to="/cadastre" className="text-gray-200 hover:text-white hover:underline">Cadastre</Link></li>
              <li><Link to="/topographie" className="text-gray-200 hover:text-white hover:underline">Topographie</Link></li>
              <li><a href="#" className="text-gray-200 hover:text-white hover:underline">Mentions Légales</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contactez-nous</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-200">Cotonou, Haie Vive, Rue de l'hôtel du Port</span>
              </li>
              <li className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-3" />
                <a href="mailto:contact@andf.bj" className="text-gray-200 hover:text-white hover:underline">contact@andf.bj</a>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-3" />
                <a href="tel:+22921313131" className="text-gray-200 hover:text-white hover:underline">+229 21 31 31 31</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="my-8 flex justify-center">
          <div className="w-full md:w-3/4 lg:w-1/2 h-1.5 flex">
            <div className="w-1/3 h-full bg-[#008751]"></div> {/* Green */}
            <div className="w-1/3 h-full bg-[#FCDD09]"></div> {/* Yellow */}
            <div className="w-1/3 h-full bg-[#E8112D]"></div> {/* Red */}
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <div className="flex items-center text-gray-300 mb-4 sm:mb-0">
            <svg width="20" height="15" viewBox="0 0 3 2" className="mr-2 flex-shrink-0">
              <rect width="1" height="2" fill="#008751"/>
              <rect x="1" width="2" height="1" fill="#FCDD09"/>
              <rect x="1" y="1" width="2" height="1" fill="#E8112D"/>
            </svg>
            <span>&copy; {new Date().getFullYear()} ANDF. Tous droits réservés.</span>
          </div>
          <div className="flex space-x-4">
            {/* Vous pouvez ajouter ici vos icônes de réseaux sociaux, par exemple avec FontAwesome */}
            {/* <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-white"><i className="fab fa-facebook-f"></i></a> */}
            {/* <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-white"><i className="fab fa-twitter"></i></a> */}
            {/* <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-white"><i className="fab fa-linkedin-in"></i></a> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
