import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://54.207.182.74:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviços da API
export const authService = {
  // Verificar se admin foi configurado
  checkSetupStatus: async () => {
    const response = await api.get('/setup-status');
    return response.data;
  },

  // Configurar administrador inicial
  setupAdmin: async (email, password) => {
    const response = await api.post('/setup-admin', { email, password });
    return response.data;
  },

  // Fazer login
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  // Verificar token
  verifyToken: async () => {
    const response = await api.get('/verify-token');
    return response.data;
  },
};

export default api;
