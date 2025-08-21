import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { analyticsApi } from '../services/api';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  gradient: string;
}

function StatCard({ title, value, change, changeType = 'neutral', icon, gradient }: StatCardProps) {
  return (
    <div className={`${gradient} rounded-2xl p-6 text-white card-hover`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                changeType === 'positive' ? 'text-green-200' : 
                changeType === 'negative' ? 'text-red-200' : 'text-white/80'
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading, error } = useQuery('dashboardStats', analyticsApi.getDashboardStats, {
    staleTime: 30000,
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your Spin & Earn admin dashboard</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your Spin & Earn admin dashboard</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading dashboard data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                Please try refreshing the page.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use real data from API
  const dashboardStats = stats || {
    totalUsers: 0,
    totalSpins: 0,
    activeUsers: 0,
    pendingWithdrawals: 0,
    totalCoins: 0,
    blockedUsers: 0,
    totalWithdrawals: 0,
    avgSpinsPerUser: 0,
    recentActivity: { spins: 0, withdrawals: 0 }
  };

  const recentActivity = [
    { id: 1, user: 'john@example.com', action: 'Won 50 coins', time: '2 minutes ago', type: 'win' },
    { id: 2, user: 'sarah@example.com', action: 'Requested withdrawal', time: '5 minutes ago', type: 'withdrawal' },
    { id: 3, user: 'mike@example.com', action: 'Completed streak', time: '10 minutes ago', type: 'streak' },
    { id: 4, user: 'lisa@example.com', action: 'Won jackpot!', time: '15 minutes ago', type: 'jackpot' },
    { id: 5, user: 'alex@example.com', action: 'Referred friend', time: '20 minutes ago', type: 'referral' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your Spin & Earn admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={dashboardStats.totalUsers.toLocaleString()}
          change="+12% from last week"
          changeType="positive"
          icon="👥"
          gradient="gradient-primary"
        />
        <StatCard
          title="Total Spins"
          value={dashboardStats.totalSpins.toLocaleString()}
          change="+8% from last week"
          changeType="positive"
          icon="🎰"
          gradient="gradient-success"
        />
        <StatCard
          title="Active Users"
          value={dashboardStats.activeUsers.toLocaleString()}
          change="+5% from last week"
          changeType="positive"
          icon="🔥"
          gradient="gradient-warning"
        />
        <StatCard
          title="Pending Withdrawals"
          value={dashboardStats.pendingWithdrawals}
          change="3 new requests"
          changeType="neutral"
          icon="⏳"
          gradient="gradient-danger"
        />
        <StatCard
          title="Total Coins"
          value={dashboardStats.totalCoins.toLocaleString()}
          change="+2.3M today"
          changeType="positive"
          icon="🪙"
          gradient="bg-gradient-to-br from-yellow-500 to-orange-500"
        />
        <StatCard
          title="Blocked Users"
          value={dashboardStats.blockedUsers}
          change="1 new block"
          changeType="neutral"
          icon="🚫"
          gradient="bg-gradient-to-br from-red-500 to-pink-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-lg">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          </div>
          <p className="text-gray-600 mb-4">Manage user accounts, view profiles, and handle user-related issues.</p>
          <button 
            onClick={() => navigate('/users')}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Manage Users
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Withdrawals</h3>
          </div>
          <p className="text-gray-600 mb-4">Review and approve withdrawal requests from users.</p>
          <button 
            onClick={() => navigate('/withdrawals')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Review Requests
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">⚙️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
          </div>
          <p className="text-gray-600 mb-4">Update app settings, game rules, and system configuration.</p>
          <button 
            onClick={() => navigate('/config')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Update Settings
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <button 
            onClick={() => navigate('/analytics')}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline"
          >
            View all
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                activity.type === 'win' ? 'bg-green-500' :
                activity.type === 'withdrawal' ? 'bg-blue-500' :
                activity.type === 'streak' ? 'bg-purple-500' :
                activity.type === 'jackpot' ? 'bg-yellow-500' :
                'bg-indigo-500'
              }`}>
                {activity.type === 'win' ? '🎉' :
                 activity.type === 'withdrawal' ? '💳' :
                 activity.type === 'streak' ? '🔥' :
                 activity.type === 'jackpot' ? '🏆' :
                 '👥'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-600">{activity.action}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
