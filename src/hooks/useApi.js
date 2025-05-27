// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import api from '../services/api';

export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const request = useCallback(async (endpoint, method = 'get', data = null, headers = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const config = {
        method,
        url: endpoint,
        headers,
        data: method !== 'get' ? data : null,
        params: method === 'get' ? data : null
      };
      
      const response = await api(config);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Ocorreu um erro na requisição');
      setLoading(false);
      throw err;
    }
  }, []);
  
  return {
    loading,
    error,
    request
  };
}