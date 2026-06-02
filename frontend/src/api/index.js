import axios from 'axios';
import { mockApi } from './mockData';

const BASE_URL = 'http://localhost:5050/api/admin';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use((config) => {
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
  if (adminInfo && adminInfo.token) {
    config.headers.Authorization = `Bearer ${adminInfo.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper to determine if we should use mock API
export const getApiMode = () => {
  const savedMode = localStorage.getItem('api_mode');
  if (!savedMode) {
    // If not set, default to 'mock' as local DB is not seeded/configured yet
    localStorage.setItem('api_mode', 'mock');
    return 'mock';
  }
  return savedMode;
};

export const setApiMode = (mode) => {
  localStorage.setItem('api_mode', mode);
};

// Safe API call wrapper that falls back to mock if backend is down
const callApi = async (serverCall, mockCall) => {
  const mode = getApiMode();
  if (mode === 'mock') {
    return await mockCall();
  }

  try {
    const response = await serverCall();
    return response.data;
  } catch (error) {
    console.warn('Backend server failed or offline, falling back to mock database:', error);
    // If it's a network/connection error, auto-fallback to mock for smooth demonstration
    if (!error.response || error.code === 'ERR_NETWORK') {
      setApiMode('mock');
      // Trigger a window event so components can update status badges
      window.dispatchEvent(new Event('api_mode_changed'));
      return await mockCall();
    }
    throw error;
  }
};

export const api = {
  // Customer Auth
  customerRegister: async (customerData) => {
    const response = await axios.post('http://localhost:5050/api/customers/register', customerData);
    return response.data;
  },
  customerLogin: async (email, password) => {
    const response = await axios.post('http://localhost:5050/api/customers/login', { email, password });
    return response.data;
  },
  updateCustomerProfile: async (profileData) => {
    const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
    const response = await axios.put('http://localhost:5050/api/customers/profile', profileData, {
      headers: { Authorization: `Bearer ${customerInfo?.token}` }
    });
    return response.data;
  },
  deleteCustomerProfile: async () => {
    const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
    const response = await axios.delete('http://localhost:5050/api/customers/profile', {
      headers: { Authorization: `Bearer ${customerInfo?.token}` }
    });
    return response.data;
  },

  // Admin Auth
  login: async (email, password) => {
    return callApi(
      () => axios.post('http://localhost:5050/api/admin/login', { email, password }),
      () => mockApi.login(email, password)
    );
  },

  getStats: async () => {
    return callApi(
      () => axiosInstance.get('/dashboard/stats'),
      () => mockApi.getStats()
    );
  },

  getRegistrations: async () => {
    return callApi(
      () => axiosInstance.get('/registrations'),
      () => mockApi.getRegistrations()
    );
  },

  approveRegistration: async (type, id) => {
    return callApi(
      () => axiosInstance.put(`/registrations/${type}/${id}`, { status: 'approved' }),
      () => mockApi.updateRegistration(type, id, 'approved')
    );
  },

  rejectRegistration: async (type, id, rejectionReason) => {
    return callApi(
      () => axiosInstance.put(`/registrations/${type}/${id}`, { status: 'rejected', rejectionReason }),
      () => mockApi.updateRegistration(type, id, 'rejected', rejectionReason)
    );
  },

  getCategories: async () => {
    return callApi(
      () => axiosInstance.get('/categories'),
      () => mockApi.getCategories()
    );
  },

  createCategory: async (category) => {
    return callApi(
      () => axiosInstance.post('/categories', category),
      () => mockApi.createCategory(category)
    );
  },

  updateCategory: async (id, updatedFields) => {
    return callApi(
      () => axiosInstance.put(`/categories/${id}`, updatedFields),
      () => mockApi.updateCategory(id, updatedFields)
    );
  },

  deleteCategory: async (id) => {
    return callApi(
      () => axiosInstance.delete(`/categories/${id}`),
      () => mockApi.deleteCategory(id)
    );
  },

  getSubscriptions: async () => {
    return callApi(
      () => axiosInstance.get('/subscriptions'),
      () => mockApi.getSubscriptions()
    );
  },

  suspendVendor: async (type, id) => {
    return callApi(
      () => axiosInstance.put(`/subscriptions/suspend/${type}/${id}`),
      () => mockApi.suspendVendor(type, id)
    );
  },

  getTickets: async () => {
    return callApi(
      () => axiosInstance.get('/tickets'),
      () => mockApi.getTickets()
    );
  },

  getTicketById: async (id) => {
    return callApi(
      () => axiosInstance.get(`/tickets/${id}`),
      () => mockApi.getTicketById(id)
    );
  },

  replyToTicket: async (id, message, adminName) => {
    return callApi(
      () => axiosInstance.post(`/tickets/${id}`, { message }),
      () => mockApi.replyToTicket(id, message, adminName)
    );
  },

  updateTicketStatus: async (id, status) => {
    return callApi(
      () => axiosInstance.put(`/tickets/${id}/status`, { status }),
      () => mockApi.updateTicketStatus(id, status)
    );
  },

  getReviews: async () => {
    return callApi(
      () => axiosInstance.get('/reviews'),
      () => mockApi.getReviews()
    );
  },

  deleteReview: async (id) => {
    return callApi(
      () => axiosInstance.delete(`/reviews/${id}`),
      () => mockApi.deleteReview(id)
    );
  }
};
