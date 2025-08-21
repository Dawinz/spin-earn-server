import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { configApi } from '../services/api';

export default function Config() {
  const [config, setConfig] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    'spin-config',
    () => configApi.getConfig('spin_earn_policy'),
    {
      onSuccess: (data) => {
        setConfig(JSON.stringify(data, null, 2));
      },
    }
  );

  const updateMutation = useMutation(
    (newConfig: any) => configApi.updateConfig('spin_earn_policy', newConfig),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['spin-config']);
        alert('Configuration updated successfully!');
      },
    }
  );

  const handleSave = () => {
    try {
      const parsedConfig = JSON.parse(config);
      updateMutation.mutate(parsedConfig);
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage app settings and policies
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Spin & Earn Policy
          </h3>
          <textarea
            value={config}
            onChange={(e) => setConfig(e.target.value)}
            className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter JSON configuration..."
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={updateMutation.isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {updateMutation.isLoading ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
