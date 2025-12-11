// src/services/equipmentService.js
import apiClient from './apiClient';

export const equipmentService = {
  getAll: () => apiClient.get('/api/equipments'),
  getById: (id) => apiClient.get(`/api/equipments/${id}`),
  create: (data) => apiClient.post('/api/equipments', data),
  update: (id, data) => apiClient.put(`/api/equipments/${id}`, data),
  delete: (id) => apiClient.delete(`/api/equipments/${id}`),

  // 新增：创建预约
  createBooking: (bookingData) => apiClient.post('/api/bookings', bookingData)
};