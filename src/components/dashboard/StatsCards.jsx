import React from 'react';

const StatsCards = () => {
  const stats = [
    {
      title: 'Demandes totales',
      value: '124',
      change: '+12%',
      changeType: 'increase',
      icon: '📋',
      color: 'blue'
    },
    {
      title: 'En cours',
      value: '28',
      change: '+5%',
      changeType: 'increase',
      icon: '⏳',
      color: 'yellow'
    },
    {
      title: 'Approuvées',
      value: '89',
      change: '+18%',
      changeType: 'increase',
      icon: '✅',
      color: 'green'
    },
    {
      title: 'Rejetées',
      value: '7',
      change: '-2%',
      changeType: 'decrease',
      icon: '❌',
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      red: 'bg-red-50 text-red-600 border-red-200'
    };
    return colors[color] || colors.blue;
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'increase' ? (
      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <div className="flex items-center mt-2">
                {getChangeIcon(stat.changeType)}
                <span className={`text-sm font-medium ml-1 ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl ${getColorClasses(stat.color)}`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
