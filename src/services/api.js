// src/services/api.js
import axios from "axios";

// Configuração automática
const getBaseURL = () => {
  if (typeof window === 'undefined') {
    return '/api'; // Para SSR
  }

  const currentHost = window.location.hostname;
  const currentPort = window.location.port;
  
  // Verificar se estamos em Docker
  if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
    // Docker ou produção - usar caminho relativo
    return '/api';
  } else {
    // Desenvolvimento local
    if (currentPort === '3000') {
      // Frontend dev server na porta 3000
      return 'http://localhost:5000/api';
    } else {
      // Produção local (mesma porta)
      return '/api';
    }
  }
};

// Criar instância do axios
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // Aumentado para operações lentas
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para debug no navegador
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    console.log(`🌐 [API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (typeof window !== 'undefined') {
      console.log(`✅ [API] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (typeof window !== 'undefined') {
      console.error(`❌ [API] ${error.message}`);
      
      if (!navigator.onLine) {
        alert('⚠️ Sem conexão com a internet. Verifique sua conexão.');
      } else if (error.code === 'ECONNABORTED') {
        alert('⏱️  Timeout: O servidor está demorando para responder.');
      } else if (error.response?.status === 404) {
        alert('🔍 Rota não encontrada no servidor.');
      } else if (error.response?.status === 500) {
        alert('🚨 Erro interno no servidor. Tente novamente mais tarde.');
      }
    }
    return Promise.reject(error);
  }
);

// Função auxiliar para testar conexão
export const testConnection = async () => {
  try {
    const response = await api.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      config: { baseURL: api.defaults.baseURL }
    };
  }
};

export default api;