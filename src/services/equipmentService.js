// src/services/equipmentService.js
import apiClient from './apiClient';

export const equipmentService = {
  getAll: () => apiClient.get('/api/equipments'),
  create: (data) => apiClient.post('/api/equipments', data),
  update: (id, data) => apiClient.put(`/api/equipments/${id}`, data), // ← 必须有这行
  delete: (id) => apiClient.delete(`/api/equipments/${id}`)
};