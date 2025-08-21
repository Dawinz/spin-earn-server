import React, { useState, useEffect } from 'react';
import { configApi } from '../services/api';

interface ConfigSection {
  key: string;
  title: string;
  description: string;
  isPublic: boolean;
  fields: ConfigField[];
}

interface ConfigField {
  key: string;
  label: string;
  type: 'number' | 'text' | 'boolean' | 'array' | 'object';
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: any;
  required?: boolean;
  warning?: string;
}

const CONFIG_SECTIONS: ConfigSection[] = [
  {
    key: 'rewards',
    title: 'Rewards Configuration',
    description: 'Configure game rewards, jackpots, and bonuses',
    isPublic: true,
    fields: [
      { 
        key: 'spin.base', 
        label: 'Base Spin Reward', 
        type: 'number', 
        description: 'Base coins per spin', 
        min: 1, 
        max: 100, 
        defaultValue: 1,
        required: true,
        warning: 'Higher values increase user satisfaction but reduce profitability'
      },
      { 
        key: 'spin.min', 
        label: 'Minimum Spin Reward', 
        type: 'number', 
        description: 'Minimum coins per spin', 
        min: 1, 
        max: 50, 
        defaultValue: 1,
        required: true,
        warning: 'Should be lower than or equal to base reward'
      },
      { 
        key: 'spin.max', 
        label: 'Maximum Spin Reward', 
        type: 'number', 
        description: 'Maximum coins per spin', 
        min: 10, 
        max: 1000, 
        defaultValue: 100,
        required: true,
        warning: 'Higher values increase excitement but reduce profitability'
      },
      { 
        key: 'jackpot', 
        label: 'Jackpot Reward', 
        type: 'number', 
        description: 'Jackpot coins amount', 
        min: 100, 
        max: 10000, 
        defaultValue: 100,
        required: true,
        warning: 'Very high values can be expensive but increase user engagement'
      },
      { 
        key: 'referral.inviter', 
        label: 'Referrer Bonus', 
        type: 'number', 
        description: 'Coins for referring someone', 
        min: 10, 
        max: 500, 
        defaultValue: 50,
        required: true,
        warning: 'Encourages user referrals'
      },
      { 
        key: 'referral.invitee', 
        label: 'Invitee Bonus', 
        type: 'number', 
        description: 'Coins for being referred', 
        min: 10, 
        max: 500, 
        defaultValue: 25,
        required: true,
        warning: 'Encourages new user signups'
      },
      { 
        key: 'referral.qualifyAfterCoins', 
        label: 'Qualify After Coins', 
        type: 'number', 
        description: 'Coins needed to qualify for referrals', 
        min: 50, 
        max: 1000, 
        defaultValue: 100,
        required: true,
        warning: 'Prevents abuse of referral system'
      }
    ]
  },
  {
    key: 'streaks',
    title: 'Streak Bonuses',
    description: 'Configure daily streak rewards and multipliers',
    isPublic: true,
    fields: [
      { 
        key: 'bonusMultiplier', 
        label: 'Streak Bonus Multiplier', 
        type: 'number', 
        description: 'Multiplier for streak bonuses', 
        min: 1, 
        max: 5, 
        step: 0.1,
        defaultValue: 1.5,
        required: true,
        warning: 'Higher values encourage daily engagement'
      },
      { 
        key: 'maxStreakDays', 
        label: 'Maximum Streak Days', 
        type: 'number', 
        description: 'Maximum days for streak bonus', 
        min: 7, 
        max: 365, 
        defaultValue: 7,
        required: true,
        warning: 'Longer streaks increase retention but cost more'
      },
      { 
        key: 'day1Bonus', 
        label: 'Day 1 Bonus', 
        type: 'number', 
        description: 'Bonus coins for 1 day streak', 
        min: 0, 
        max: 100, 
        defaultValue: 10,
        required: true
      },
      { 
        key: 'day3Bonus', 
        label: 'Day 3 Bonus', 
        type: 'number', 
        description: 'Bonus coins for 3 day streak', 
        min: 0, 
        max: 200, 
        defaultValue: 25,
        required: true
      },
      { 
        key: 'day7Bonus', 
        label: 'Day 7 Bonus', 
        type: 'number', 
        description: 'Bonus coins for 7 day streak', 
        min: 0, 
        max: 500, 
        defaultValue: 100,
        required: true
      },
      { 
        key: 'day30Bonus', 
        label: 'Day 30 Bonus', 
        type: 'number', 
        description: 'Bonus coins for 30 day streak', 
        min: 0, 
        max: 2000, 
        defaultValue: 500,
        required: true,
        warning: 'High value - consider carefully'
      }
    ]
  },
  {
    key: 'caps',
    title: 'Daily Limits & Caps',
    description: 'Configure daily limits and restrictions',
    isPublic: true,
    fields: [
      { 
        key: 'maxSpinsPerDay', 
        label: 'Max Spins Per Day', 
        type: 'number', 
        description: 'Maximum spins allowed per day', 
        min: 5, 
        max: 200, 
        defaultValue: 50,
        required: true,
        warning: 'Lower values reduce costs but may frustrate users'
      },
      { 
        key: 'minSecondsBetweenSpins', 
        label: 'Min Seconds Between Spins', 
        type: 'number', 
        description: 'Minimum time between spins', 
        min: 5, 
        max: 300, 
        defaultValue: 30,
        required: true,
        warning: 'Prevents rapid spinning abuse'
      },
      { 
        key: 'maxRewardedPerDay', 
        label: 'Max Rewarded Spins Per Day', 
        type: 'number', 
        description: 'Maximum rewarded spins per day', 
        min: 5, 
        max: 100, 
        defaultValue: 20,
        required: true,
        warning: 'Controls daily reward costs'
      },
      { 
        key: 'dailyCoinCap', 
        label: 'Daily Coin Cap', 
        type: 'number', 
        description: 'Maximum coins earned per day', 
        min: 100, 
        max: 5000, 
        defaultValue: 500,
        required: true,
        warning: 'Major cost control - set carefully'
      }
    ]
  },
  {
    key: 'wheelWeights',
    title: 'Spin Wheel Weights',
    description: 'Configure probability weights for spin wheel outcomes',
    isPublic: false,
    fields: [
      { 
        key: '2', 
        label: '2 Coins Weight', 
        type: 'number', 
        description: 'Probability weight for 2 coins', 
        min: 1, 
        max: 100, 
        defaultValue: 30,
        required: true,
        warning: 'Higher weight = more frequent occurrence'
      },
      { 
        key: '5', 
        label: '5 Coins Weight', 
        type: 'number', 
        description: 'Probability weight for 5 coins', 
        min: 1, 
        max: 100, 
        defaultValue: 25,
        required: true
      },
      { 
        key: '10', 
        label: '10 Coins Weight', 
        type: 'number', 
        description: 'Probability weight for 10 coins', 
        min: 1, 
        max: 100, 
        defaultValue: 20,
        required: true
      },
      { 
        key: '20', 
        label: '20 Coins Weight', 
        type: 'number', 
        description: 'Probability weight for 20 coins', 
        min: 1, 
        max: 100, 
        defaultValue: 15,
        required: true
      },
      { 
        key: '50', 
        label: '50 Coins Weight', 
        type: 'number', 
        description: 'Probability weight for 50 coins', 
        min: 1, 
        max: 100, 
        defaultValue: 7,
        required: true
      },
      { 
        key: 'jackpot', 
        label: 'Jackpot Weight', 
        type: 'number', 
        description: 'Probability weight for jackpot', 
        min: 1, 
        max: 10, 
        defaultValue: 1,
        required: true,
        warning: 'Very low weight - jackpots should be rare'
      },
      { 
        key: 'bonusSpin', 
        label: 'Bonus Spin Weight', 
        type: 'number', 
        description: 'Probability weight for bonus spin', 
        min: 1, 
        max: 10, 
        defaultValue: 1,
        required: true
      },
      { 
        key: 'tryAgain', 
        label: 'Try Again Weight', 
        type: 'number', 
        description: 'Probability weight for try again', 
        min: 1, 
        max: 10, 
        defaultValue: 1,
        required: true
      }
    ]
  },
  {
    key: 'withdrawals',
    title: 'Withdrawal Settings',
    description: 'Configure withdrawal limits and fees',
    isPublic: true,
    fields: [
      { 
        key: 'min', 
        label: 'Minimum Withdrawal', 
        type: 'number', 
        description: 'Minimum coins for withdrawal', 
        min: 100, 
        max: 10000, 
        defaultValue: 1000,
        required: true,
        warning: 'Higher values reduce processing costs but may frustrate users'
      },
      { 
        key: 'fee', 
        label: 'Withdrawal Fee (%)', 
        type: 'number', 
        description: 'Percentage fee for withdrawals', 
        min: 0, 
        max: 20, 
        step: 0.1,
        defaultValue: 5,
        required: true,
        warning: 'Higher fees increase revenue but may discourage withdrawals'
      },
      { 
        key: 'cooldownHours', 
        label: 'Cooldown Hours', 
        type: 'number', 
        description: 'Hours between withdrawals', 
        min: 0, 
        max: 168, 
        defaultValue: 24,
        required: true,
        warning: 'Prevents rapid withdrawal abuse'
      },
      { 
        key: 'maxPerDay', 
        label: 'Max Withdrawals Per Day', 
        type: 'number', 
        description: 'Maximum withdrawal requests per day', 
        min: 1, 
        max: 10, 
        defaultValue: 3,
        required: true
      },
      { 
        key: 'autoApproveLimit', 
        label: 'Auto-Approve Limit', 
        type: 'number', 
        description: 'Auto-approve withdrawals under this amount', 
        min: 0, 
        max: 1000, 
        defaultValue: 100,
        required: true,
        warning: 'Reduces admin workload but may increase fraud risk'
      }
    ]
  },
  {
    key: 'security',
    title: 'Security Settings',
    description: 'Configure anti-fraud and security measures',
    isPublic: false,
    fields: [
      { 
        key: 'allowEmulators', 
        label: 'Allow Emulators', 
        type: 'boolean', 
        description: 'Allow users on emulators', 
        defaultValue: false,
        required: true,
        warning: 'Emulators are often used for fraud'
      },
      { 
        key: 'rootedPenalty', 
        label: 'Rooted Device Penalty', 
        type: 'number', 
        description: 'Reward multiplier for rooted devices', 
        min: 0, 
        max: 1, 
        step: 0.1,
        defaultValue: 0.5,
        required: true,
        warning: 'Rooted devices are higher risk'
      },
      { 
        key: 'ipVelocityWindowSec', 
        label: 'IP Velocity Window (sec)', 
        type: 'number', 
        description: 'Time window for IP velocity checks', 
        min: 300, 
        max: 86400, 
        defaultValue: 3600,
        required: true
      },
      { 
        key: 'maxActionsPerWindow', 
        label: 'Max Actions Per Window', 
        type: 'number', 
        description: 'Maximum actions per time window', 
        min: 10, 
        max: 1000, 
        defaultValue: 100,
        required: true
      },
      { 
        key: 'maxDevicesPerUser', 
        label: 'Max Devices Per User', 
        type: 'number', 
        description: 'Maximum devices per user account', 
        min: 1, 
        max: 10, 
        defaultValue: 3,
        required: true
      },
      { 
        key: 'suspiciousIpThreshold', 
        label: 'Suspicious IP Threshold', 
        type: 'number', 
        description: 'Actions per IP before flagging', 
        min: 5, 
        max: 100, 
        defaultValue: 10,
        required: true
      }
    ]
  },
  {
    key: 'email',
    title: 'Email Settings',
    description: 'Configure email notifications and magic links',
    isPublic: false,
    fields: [
      { 
        key: 'enabled', 
        label: 'Enable Email Features', 
        type: 'boolean', 
        description: 'Enable email notifications and magic links', 
        defaultValue: false,
        required: true
      },
      { 
        key: 'smtpHost', 
        label: 'SMTP Host', 
        type: 'text', 
        description: 'SMTP server hostname', 
        defaultValue: 'smtp.gmail.com',
        required: true
      },
      { 
        key: 'smtpPort', 
        label: 'SMTP Port', 
        type: 'number', 
        description: 'SMTP server port', 
        min: 1, 
        max: 65535, 
        defaultValue: 587,
        required: true
      },
      { 
        key: 'smtpUser', 
        label: 'SMTP Username', 
        type: 'text', 
        description: 'SMTP authentication username', 
        defaultValue: '',
        required: false
      },
      { 
        key: 'smtpPass', 
        label: 'SMTP Password', 
        type: 'text', 
        description: 'SMTP authentication password', 
        defaultValue: '',
        required: false,
        warning: 'Store securely - consider using environment variables'
      },
      { 
        key: 'fromEmail', 
        label: 'From Email', 
        type: 'text', 
        description: 'Sender email address', 
        defaultValue: 'noreply@spinearn.com',
        required: true
      },
      { 
        key: 'fromName', 
        label: 'From Name', 
        type: 'text', 
        description: 'Sender display name', 
        defaultValue: 'Spin & Earn',
        required: true
      }
    ]
  },
  {
    key: 'app',
    title: 'App Settings',
    description: 'Configure app-wide settings and features',
    isPublic: true,
    fields: [
      { 
        key: 'maintenanceMode', 
        label: 'Maintenance Mode', 
        type: 'boolean', 
        description: 'Enable maintenance mode', 
        defaultValue: false,
        required: true,
        warning: 'Will disable app access for users'
      },
      { 
        key: 'maintenanceMessage', 
        label: 'Maintenance Message', 
        type: 'text', 
        description: 'Message shown during maintenance', 
        defaultValue: 'We are currently performing maintenance. Please try again later.',
        required: true
      },
      { 
        key: 'appVersion', 
        label: 'App Version', 
        type: 'text', 
        description: 'Current app version', 
        defaultValue: '1.0.0',
        required: true
      },
      { 
        key: 'minAppVersion', 
        label: 'Minimum App Version', 
        type: 'text', 
        description: 'Minimum required app version', 
        defaultValue: '1.0.0',
        required: true
      },
      { 
        key: 'forceUpdate', 
        label: 'Force Update', 
        type: 'boolean', 
        description: 'Force users to update app', 
        defaultValue: false,
        required: true,
        warning: 'Will prevent users from using older app versions'
      },
      { 
        key: 'updateMessage', 
        label: 'Update Message', 
        type: 'text', 
        description: 'Message shown for forced updates', 
        defaultValue: 'Please update to the latest version to continue using the app.',
        required: true
      }
    ]
  }
];

const Config: React.FC = () => {
  const [configs, setConfigs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, Record<string, string>>>({});
  const [warnings, setWarnings] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const configPromises = CONFIG_SECTIONS.map(section => 
        configApi.getConfig(section.key).catch(() => ({ value: {} }))
      );
      
      const results = await Promise.all(configPromises);
      const configData: Record<string, any> = {};
      
      CONFIG_SECTIONS.forEach((section, index) => {
        const result = results[index]?.value || {};
        // Merge with defaults
        const mergedConfig = { ...result };
        section.fields.forEach(field => {
          if (mergedConfig[field.key] === undefined && field.defaultValue !== undefined) {
            if (field.key.includes('.')) {
              const [parentKey, childKey] = field.key.split('.');
              if (!mergedConfig[parentKey]) mergedConfig[parentKey] = {};
              mergedConfig[parentKey][childKey] = field.defaultValue;
            } else {
              mergedConfig[field.key] = field.defaultValue;
            }
          }
        });
        configData[section.key] = mergedConfig;
      });
      
      setConfigs(configData);
    } catch (error) {
      console.error('Error loading configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (sectionKey: string, fieldKey: string, value: any, field: ConfigField): string => {
    if (field.required && (value === undefined || value === null || value === '')) {
      return 'This field is required';
    }

    if (field.type === 'number' && value !== undefined && value !== null && value !== '') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return 'Must be a valid number';
      }
      if (field.min !== undefined && numValue < field.min) {
        return `Minimum value is ${field.min}`;
      }
      if (field.max !== undefined && numValue > field.max) {
        return `Maximum value is ${field.max}`;
      }
    }

    return '';
  };

  const updateConfigValue = (sectionKey: string, fieldKey: string, value: any) => {
    // Clear field error when user starts typing
    setFieldErrors(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldKey]: ''
      }
    }));

    setConfigs(prev => {
      const currentSection = prev[sectionKey] || {};
      
      // Handle nested field keys like 'spin.base' or 'referral.inviter'
      if (fieldKey.includes('.')) {
        const [parentKey, childKey] = fieldKey.split('.');
        return {
          ...prev,
          [sectionKey]: {
            ...currentSection,
            [parentKey]: {
              ...currentSection[parentKey],
              [childKey]: value
            }
          }
        };
      } else {
        return {
          ...prev,
          [sectionKey]: {
            ...currentSection,
            [fieldKey]: value
          }
        };
      }
    });
  };

  const saveConfig = async (sectionKey: string) => {
    try {
      // Validate all fields in the section
      const section = CONFIG_SECTIONS.find(s => s.key === sectionKey);
      if (!section) return;

      const sectionErrors: Record<string, string> = {};
      let hasErrors = false;

      section.fields.forEach(field => {
        const error = validateField(sectionKey, field.key, getFieldValue(sectionKey, field.key), field);
        if (error) {
          sectionErrors[field.key] = error;
          hasErrors = true;
        }
      });

      if (hasErrors) {
        setFieldErrors(prev => ({
          ...prev,
          [sectionKey]: sectionErrors
        }));
        return;
      }

      setSaving(prev => ({ ...prev, [sectionKey]: true }));
      setErrors(prev => ({ ...prev, [sectionKey]: '' }));
      
      await configApi.updateConfig(sectionKey, configs[sectionKey]);
      
      // Show success message
      alert(`${section.title} updated successfully!`);
    } catch (error: any) {
      console.error('Error saving config:', error);
      let errorMessage = 'Failed to save configuration. Please try again.';
      
      if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setErrors(prev => ({ 
        ...prev, 
        [sectionKey]: errorMessage 
      }));
    } finally {
      setSaving(prev => ({ ...prev, [sectionKey]: false }));
    }
  };

  const getFieldValue = (sectionKey: string, fieldKey: string): any => {
    if (fieldKey.includes('.')) {
      const [parentKey, childKey] = fieldKey.split('.');
      return configs[sectionKey]?.[parentKey]?.[childKey];
    } else {
      return configs[sectionKey]?.[fieldKey];
    }
  };

  const renderField = (sectionKey: string, field: ConfigField) => {
    const value = getFieldValue(sectionKey, field.key);
    const error = fieldErrors[sectionKey]?.[field.key];
    const warning = field.warning;
    
    switch (field.type) {
      case 'number':
        return (
          <div className="space-y-1">
            <input
              type="number"
              value={value || ''}
              onChange={(e) => updateConfigValue(sectionKey, field.key, parseFloat(e.target.value) || 0)}
              min={field.min}
              max={field.max}
              step={field.step || 1}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}
            {warning && !error && (
              <p className="text-xs text-yellow-600">{warning}</p>
            )}
          </div>
        );
      
      case 'boolean':
        return (
          <div className="space-y-1">
            <select
              value={value?.toString() || 'false'}
              onChange={(e) => updateConfigValue(sectionKey, field.key, e.target.value === 'true')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}
            {warning && !error && (
              <p className="text-xs text-yellow-600">{warning}</p>
            )}
          </div>
        );
      
      default:
        return (
          <div className="space-y-1">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => updateConfigValue(sectionKey, field.key, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}
            {warning && !error && (
              <p className="text-xs text-yellow-600">{warning}</p>
            )}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuration</h1>
            <p className="text-gray-600">Manage game settings, rewards, and security configurations</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadConfigs}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reload
            </button>
            <button
              onClick={() => {
                // eslint-disable-next-line no-restricted-globals
                if (confirm('Are you sure you want to reset all configurations to default values? This action cannot be undone.')) {
                  loadConfigs();
                }
              }}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        {errors.all && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.all}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {CONFIG_SECTIONS.map((section) => (
          <div key={section.key} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                <p className="text-gray-600 text-sm">{section.description}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                  section.isPublic 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {section.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
              <button
                onClick={() => saveConfig(section.key)}
                disabled={saving[section.key]}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving[section.key] ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {errors[section.key] && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors[section.key]}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(section.key, field)}
                  {field.description && (
                    <p className="text-xs text-gray-500">{field.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Configuration Notes</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Public</strong> configurations are visible to users and affect game behavior</li>
          <li>• <strong>Private</strong> configurations are for internal use and security</li>
          <li>• Changes take effect immediately after saving</li>
          <li>• Be careful with security settings to prevent abuse</li>
          <li>• Wheel weights determine the probability of each spin outcome</li>
          <li>• Fields marked with <span className="text-red-500">*</span> are required</li>
          <li>• Yellow warnings indicate important considerations</li>
        </ul>
      </div>
    </div>
  );
};

export default Config;
