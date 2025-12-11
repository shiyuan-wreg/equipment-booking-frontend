// src/services/equipmentService.js
import apiClient from '@/services/apiClient';

export const equipmentService = {
  getAll() {
    return apiClient.get('/api/equipments');
  },
  create(equipmentData) {
    return apiClient.post('/api/equipments', equipmentData);
  },
  update(id, equipmentData) {
    return apiClient.put(`/api/equipments/${id}`, equipmentData);
  },
  delete(id) {
    return apiClient.delete(`/api/equipments/${id}`);
  }
};