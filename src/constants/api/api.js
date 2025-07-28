import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const API_URL = 'https://mecalinkapi-3dmdr00n.b4a.run/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 
    'Accept': 'application/json',
    'Content-Type': 'application/json', 
 },
});

// Ajouter le token à chaque requête si présent
api.interceptors.request.use(config => {
  const token = secureLocalStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
