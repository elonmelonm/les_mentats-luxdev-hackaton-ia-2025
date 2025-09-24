import React from 'react';

const RecentRequests = () => {
  const requests = [
    {
      id: 'REQ-2024-001',
      title: 'Demande titre foncier - Parcelle 123',
      status: 'En cours',
      statusColor: 'yellow',
      date: '2024-01-15',
      progress: 65
    },
    {
      id: 'REQ-2024-002',
      title: 'Demande titre foncier - Parcelle 456',
      status: 'Approuvée',
      statusColor: 'green',
      date: '2024-01-12',
      progress: 100
    },
    {
      id: 'REQ-2024-003',
      title: 'Demande titre foncier - Parcelle 789',
      status: 'En attente',
      statusColor: 'blue',
      date: '2024-01-10',
      progress: 30
    },
    {
      id: 'REQ-2024-004',
      title: 'Demande titre foncier - Parcelle 321',
      status: 'Rejetée',
      statusColor: 'red',
      date: '2024-01-08',
      progress: 0
    },
    {
      id: 'REQ-2024-005',
      title: 'Demande titre foncier - Parcelle 654',
      status: 'En cours',
      statusColor: 'yellow',
      date: '2024-01-05',
      progress: 45
    }
  ];

  const getStatusColor = (statusColor) => {
    const colors = {
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      red: 'bg-red-100 text-red-800'
    };
    return colors[statusColor] || colors.blue;
  };

  const getProgressBarColor = (statusColor) => {
    const colors = {
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      red: 'bg-red-500'
    };
    return colors[statusColor] || colors.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Demandes récentes</h3>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
            Voir tout
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{request.title}</h4>
                  <p className="text-xs text-gray-500">ID: {request.id}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.statusColor)}`}>
                  {request.status}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progression</span>
                  <span>{request.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressBarColor(request.statusColor)}`}
                    style={{ width: `${request.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{request.date}</span>
                <button className="text-blue-600 text-xs font-medium hover:text-blue-700">
                  Voir détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentRequests;
