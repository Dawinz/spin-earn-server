import axios from 'axios';

// API Base URL - will use production URL in production, localhost in development
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-backend.onrender.com/api/v1'
    : 'http://localhost:8080/api/v1');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { 
      email, 
      password,
      deviceInfo: {
        fingerprintHash: 'admin-dashboard-' + Date.now(),
        model: 'Admin Dashboard',
        os: 'Web',
        emulator: false,
        rooted: false,
        ipAddress: '127.0.0.1'
      }
    });
    return response.data.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },
};

// Users API
export const usersApi = {
  getUsers: async (page = 1, limit = 20) => {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  blockUser: async (userId: string) => {
    const response = await api.post(`/admin/users/${userId}/block`);
    return response.data.data;
  },

  unblockUser: async (userId: string) => {
    const response = await api.post(`/admin/users/${userId}/unblock`);
    return response.data.data;
  },
};

// Withdrawals API
export const withdrawalsApi = {
  getWithdrawals: async (page = 1, limit = 20) => {
    const response = await api.get(`/admin/withdrawals?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  approveWithdrawal: async (withdrawalId: string) => {
    const response = await api.post(`/admin/withdrawals/${withdrawalId}/approve`);
    return response.data.data;
  },

  rejectWithdrawal: async (withdrawalId: string, reason: string) => {
    const response = await api.post(`/admin/withdrawals/${withdrawalId}/reject`, { reason });
    return response.data.data;
  },
};

// Config API
export const configApi = {
  getConfig: async (key: string) => {
    const response = await api.get(`/admin/config/${key}`);
    return response.data.data;
  },

  updateConfig: async (key: string, config: any) => {
    const response = await api.put(`/admin/config/${key}`, { json: config });
    return response.data.data;
  },
};

// Analytics API
export const analyticsApi = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/analytics/dashboard');
    return response.data.data;
  },

  getDailyStats: async (days = 7) => {
    const response = await api.get(`/admin/analytics/daily?days=${days}`);
    return response.data.data;
  },
};

export default api;
