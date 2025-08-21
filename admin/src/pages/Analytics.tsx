import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { analyticsApi } from '../services/api';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  const { data, isLoading, error } = useQuery(
    ['analytics-daily', timeRange],
    () => analyticsApi.getDailyStats(timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90),
    {
      refetchInterval: 300000, // Refetch every 5 minutes
      staleTime: 300000, // Consider data stale after 5 minutes
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">User activity and system performance insights</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">User activity and system performance insights</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading analytics data
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

  // Mock data for demo - focused on user management metrics
  const mockData = {
    dailyStats: [
      { date: '2024-01-14', newUsers: 12, activeUsers: 45, totalSpins: 234, withdrawals: 3, blockedUsers: 1 },
      { date: '2024-01-15', newUsers: 15, activeUsers: 52, totalSpins: 289, withdrawals: 5, blockedUsers: 0 },
      { date: '2024-01-16', newUsers: 8, activeUsers: 48, totalSpins: 267, withdrawals: 4, blockedUsers: 2 },
      { date: '2024-01-17', newUsers: 22, activeUsers: 61, totalSpins: 345, withdrawals: 7, blockedUsers: 1 },
      { date: '2024-01-18', newUsers: 18, activeUsers: 58, totalSpins: 312, withdrawals: 6, blockedUsers: 0 },
      { date: '2024-01-19', newUsers: 25, activeUsers: 67, totalSpins: 378, withdrawals: 8, blockedUsers: 1 },
      { date: '2024-01-20', newUsers: 31, activeUsers: 73, totalSpins: 412, withdrawals: 9, blockedUsers: 0 },
    ],
  };

  const stats = mockData.dailyStats;
  const totalNewUsers = stats.reduce((sum, day) => sum + day.newUsers, 0);
  const totalActiveUsers = stats.reduce((sum, day) => sum + day.activeUsers, 0);
  const totalSpins = stats.reduce((sum, day) => sum + day.totalSpins, 0);
  const totalWithdrawals = stats.reduce((sum, day) => sum + day.withdrawals, 0);
  const totalBlockedUsers = stats.reduce((sum, day) => sum + day.blockedUsers, 0);

  return (
    <div className="space-y-6">
      <div className="fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">User activity and system performance insights</p>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Time Range</h3>
          <div className="flex space-x-2">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value as '7d' | '30d' | '90d')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeRange === range.value
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalNewUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalActiveUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-purple-600 text-xl">🎰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Spins</p>
              <p className="text-2xl font-bold text-gray-900">{totalSpins.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-yellow-600 text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Withdrawals</p>
              <p className="text-2xl font-bold text-gray-900">{totalWithdrawals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-red-600 text-xl">🚫</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Blocked Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalBlockedUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Performance Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daily Performance Overview</h3>
          <p className="text-sm text-gray-500 mt-1">Detailed breakdown of daily metrics</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spins
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Withdrawals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blocked Users
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.map((day) => (
                <tr key={day.date} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      +{day.newUsers}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.activeUsers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.totalSpins.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {day.withdrawals}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.blockedUsers > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {day.blockedUsers}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trends</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average daily new users</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(totalNewUsers / stats.length)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">User retention rate</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round((totalActiveUsers / (totalActiveUsers + totalNewUsers)) * 100)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Spins per active user</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(totalSpins / totalActiveUsers)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdrawal Management</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total withdrawal requests</span>
              <span className="text-sm font-medium text-gray-900">{totalWithdrawals}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average daily withdrawals</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(totalWithdrawals / stats.length)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Blocked users</span>
              <span className="text-sm font-medium text-gray-900">{totalBlockedUsers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
