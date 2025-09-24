import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#273344] px-32 text-white">
      <div className="container flex flex-col mx-auto px-4 py-12 gap-9">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 uppercase">L'ANDF</h3>
            {/* <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/src/assets/logo-andf.png" 
                alt="ANDF Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold">ANDF</span>
            </div> */}
            <p className="text-gray-300 mb-4 max-w-md">
              L'Agence Nationale de Développement et de Financement accompagne les citoyens 
              dans la sécurisation de leurs droits fonciers et la protection de leur patrimoine.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4 uppercase">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  to="/chatbots" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Cadastre
                </Link>
              </li>
              <li>
                <Link 
                  to="/chatbots" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Topographie
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 uppercase">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="font-medium">Adresse:</span><br />
                Cotonou, Immeuble Golden House, Face Église Sainte Rita
              </p>
              <p>
                <span className="font-medium">Téléphone:</span><br />
                +229 01 97 43 42 93
              </p>
              <p>
                <span className="font-medium">Email:</span><br />
                andf@finances.bj
              </p>
            </div>
          </div>
        </div>

        {/* <div className="flex flex-row"> */}
          <div className="grid grid-cols-3 w-full">
            <div className="h-2 bg-[#00965E] "></div>
            <div className="h-2 bg-[#FFCC00]"></div>
            <div className="h-2 bg-[#ED1C24]"></div>
          </div>
        {/* </div> */}

        {/* Copyright */}
        <div className="border-t border-gray-500 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; Agence Nationale du Domaine et du Foncier -  2025 ANDF. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
