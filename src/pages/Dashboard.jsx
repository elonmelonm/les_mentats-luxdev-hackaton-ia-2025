import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/DashboardHeader';
import StatsCards from '../components/dashboard/StatsCards';
import RecentRequests from '../components/dashboard/RecentRequests';
import Charts from '../components/dashboard/Charts';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />
          
          {/* Dashboard Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Page Title */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-gray-600 mt-2">Vue d'ensemble de vos demandes de cadastre</p>
              </div>

              {/* Stats Cards */}
              <StatsCards />

              {/* Charts and Recent Requests */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Charts */}
                <div className="lg:col-span-2">
                  <Charts />
                </div>
                
                {/* Recent Requests */}
                <div className="lg:col-span-1">
                  <RecentRequests />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
