import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo-andf.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="ANDF Logo" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
                isActive('/') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/cadastre"
              className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
                isActive('/cadastre') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Cadastre
            </Link>
            <Link
              to="/topographie"
              className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
                isActive('/topographie') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Topographie
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
                  isActive('/') ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                Accueil
              </Link>
              <Link
                to="/cadastre"
                onClick={() => setIsMenuOpen(false)}
                className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
                  isActive('/cadastre') ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                Cadastre
              </Link>
              <Link
                to="/topographie"
                onClick={() => setIsMenuOpen(false)}
                className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
                  isActive('/topographie') ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                Topographie
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
