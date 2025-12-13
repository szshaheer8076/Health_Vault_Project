import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your computer's IP address when testing on device
const API_URL = 'http://192.168.1.10:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('sessionToken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (email, password, fullName) => {
  return api.post('/auth/register', { email, password, fullName });
};

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const logout = () => {
  return api.post('/auth/logout');
};

// Profile APIs
export const getProfile = () => {
  return api.get('/profile');
};

export const updateProfile = (profileData) => {
  return api.put('/profile', profileData);
};

// Medication APIs
export const getMedications = () => {
  return api.get('/medications');
};

export const addMedication = (medicationData) => {
  return api.post('/medications', medicationData);
};

export const updateMedication = (id, medicationData) => {
  return api.put(`/medications/${id}`, medicationData);
};

export const deleteMedication = (id) => {
  return api.delete(`/medications/${id}`);
};

// Document APIs
export const getDocuments = () => {
  return api.get('/documents');
};

export const uploadDocument = async (title, fileUri) => {
  const formData = new FormData();
  formData.append('title', title);
  
  const filename = fileUri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image';

  formData.append('file', {
    uri: fileUri,
    name: filename,
    type
  });

  return api.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteDocument = (id) => {
  return api.delete(`/documents/${id}`);
};

export default api;