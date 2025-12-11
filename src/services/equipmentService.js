// src/services/equipmentService.js
import apiClient from '@/services/apiClient';

export const equipmentService = {
  // 获取所有设备
  getAll() {
    return apiClient.get('/api/equipments');
  },

  // 创建设备
  create(equipmentData) {
    return apiClient.post('/api/equipments', equipmentData);
  },

  // 更新设备
  update(id, equipmentData) {
    return apiClient.put(`/api/equipments/${id}`, equipmentData);
  },

  // 删除设备
  delete(id) {
    return apiClient.delete(`/api/equipments/${id}`);
  }
};