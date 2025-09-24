import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: 'Tableau de bord',
      icon: '📊',
      path: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    {
      name: 'Mes demandes',
      icon: '📋',
      path: '/dashboard/requests',
      active: location.pathname === '/dashboard/requests'
    },
    {
      name: 'Documents',
      icon: '📁',
      path: '/dashboard/documents',
      active: location.pathname === '/dashboard/documents'
    },
    {
      name: 'Profil',
      icon: '👤',
      path: '/dashboard/profile',
      active: location.pathname === '/dashboard/profile'
    },
    {
      name: 'Paramètres',
      icon: '⚙️',
      path: '/dashboard/settings',
      active: location.pathname === '/dashboard/settings'
    }
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">Cadastre</h2>
              <p className="text-xs text-gray-500">Tableau de bord</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">JD</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                John Doe
              </p>
              <p className="text-xs text-gray-500 truncate">
                john.doe@example.com
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <span className="text-gray-500 text-xs">
          {isCollapsed ? '→' : '←'}
        </span>
      </button>
    </div>
  );
};

export default Sidebar;
