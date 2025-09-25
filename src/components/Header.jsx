import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/logo-andf.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white text-[#367C55] shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <div className="flex items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={Logo}
              alt="ANDF Logo" 
              className="h-16 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center h-full">
          <Link 
            to="/" 
            className={`px-4 h-full flex items-center font-semibold tracking-wide transition-all duration-300 ${
              isActive('/') 
                ? 'bg-[#367C55] text-white' 
                : 'text-[#367C55] hover:bg-gray-300 hover:text-gray-700'
            }`}
          >
            Accueil
          </Link>
          <Link 
            to="/cadastre" 
            className={`px-4 h-full flex items-center font-semibold tracking-wide transition-all duration-300 ${
              isActive('/cadastre') 
                ? 'bg-[#367C55] text-white' 
                : 'text-[#367C55] hover:bg-gray-300 hover:text-gray-700'
            }`}
          >
            Cadastre
          </Link>
          <Link 
            to="/topographie" 
            className={`px-4 h-full flex items-center font-semibold tracking-wide transition-all duration-300 ${
              isActive('/topographie') 
                ? 'bg-[#367C55] text-white' 
                : 'text-[#367C55] hover:bg-gray-300 hover:text-gray-700'
            }`}
          >
            Topographie
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-[#367C55] hover:text-green-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Mobile Navigation Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white/5 backdrop-blur-sm shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="py-5">
          <div className="flex justify-end mb-4 px-5">
            <button onClick={toggleMenu} className="p-2 rounded-md text-[#367C55] hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col">
            <Link 
              to="/" 
              className={`block px-5 py-3 text-base font-medium ${
                isActive('/') 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-[#367C55] hover:bg-gray-50 hover:text-green-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/cadastre" 
              className={`block px-5 py-3 text-base font-medium ${
                isActive('/cadastre') 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-[#367C55] hover:bg-gray-50 hover:text-green-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Cadastre
            </Link>
            <Link 
              to="/topographie" 
              className={`block px-5 py-3 text-base font-medium ${
                isActive('/topographie') 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-[#367C55] hover:bg-gray-50 hover:text-green-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Topographie
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
