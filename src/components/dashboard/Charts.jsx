import React from 'react';

const Charts = () => {
  // Données simulées pour les graphiques
  const monthlyData = [
    { month: 'Jan', requests: 45, approved: 38, rejected: 7 },
    { month: 'Fév', requests: 52, approved: 44, rejected: 8 },
    { month: 'Mar', requests: 48, approved: 41, rejected: 7 },
    { month: 'Avr', requests: 61, approved: 52, rejected: 9 },
    { month: 'Mai', requests: 55, approved: 47, rejected: 8 },
    { month: 'Jun', requests: 67, approved: 58, rejected: 9 }
  ];

  const statusDistribution = [
    { status: 'Approuvées', count: 89, percentage: 72, color: 'bg-green-500' },
    { status: 'En cours', count: 28, percentage: 23, color: 'bg-yellow-500' },
    { status: 'Rejetées', count: 7, percentage: 5, color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Graphique des demandes mensuelles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Demandes mensuelles</h3>
        <div className="h-64">
          {/* Graphique en barres simplifié */}
          <div className="flex items-end justify-between h-full space-x-2">
            {monthlyData.map((data, index) => {
              const maxValue = Math.max(...monthlyData.map(d => d.requests));
              const height = (data.requests / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col justify-end h-40 mb-2">
                    {/* Barre totale */}
                    <div className="relative w-full bg-gray-100 rounded-t" style={{ height: `${height}%` }}>
                      {/* Barre des approuvées */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-green-500 rounded-t"
                        style={{ height: `${(data.approved / data.requests) * 100}%` }}
                      ></div>
                      {/* Barre des rejetées */}
                      <div 
                        className="absolute top-0 left-0 right-0 bg-red-500 rounded-t"
                        style={{ height: `${(data.rejected / data.requests) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{data.month}</span>
                  <span className="text-xs text-gray-500">{data.requests}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Légende */}
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Approuvées</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Rejetées</span>
          </div>
        </div>
      </div>

      {/* Graphique en camembert des statuts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribution des statuts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Camembert simplifié */}
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Cercle de base */}
              <div className="absolute inset-0 rounded-full bg-gray-200"></div>
              
              {/* Segments du camembert */}
              <div className="absolute inset-0 rounded-full" style={{
                background: `conic-gradient(
                  #10b981 0deg 259deg,
                  #f59e0b 259deg 331deg,
                  #ef4444 331deg 360deg
                )`
              }}></div>
              
              {/* Cercle central */}
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">124</span>
              </div>
            </div>
          </div>
          
          {/* Légende */}
          <div className="space-y-3">
            {statusDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${item.color}`}></div>
                  <span className="text-sm text-gray-700">{item.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                  <span className="text-xs text-gray-500 ml-1">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
