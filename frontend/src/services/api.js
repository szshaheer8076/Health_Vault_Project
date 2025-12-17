import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your computer's IP address when testing
const API_URL = 'http://192.168.1.23:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
export const register = (email, password, name) => {
  return api.post('/auth/register', { email, password, name });
};

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const logout = () => {
  return api.post('/auth/logout');
};

// Patient APIs
export const getPatients = () => {
  return api.get('/patients');
};

export const getPatient = (id) => {
  return api.get(`/patients/${id}`);
};

export const addPatient = (patientData) => {
  return api.post('/patients', patientData);
};

export const updatePatient = (id, patientData) => {
  return api.put(`/patients/${id}`, patientData);
};

export const deletePatient = (id) => {
  return api.delete(`/patients/${id}`);
};

export const searchPatients = (query) => {
  return api.get(`/patients/search?query=${query}`);
};

// Medication APIs
export const getMedications = (patientId) => {
  return api.get(`/medications/${patientId}`);
};

export const addMedication = (patientId, medicationData) => {
  return api.post(`/medications/${patientId}`, medicationData);
};

export const deleteMedication = (id) => {
  return api.delete(`/medications/${id}`);
};

// Document APIs
export const getDocuments = (patientId) => {
  return api.get(`/documents/${patientId}`);
};

export const uploadDocument = async (patientId, title, fileUri) => {
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

  return api.post(`/documents/${patientId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteDocument = (id) => {
  return api.delete(`/documents/${id}`);
};

export default api;