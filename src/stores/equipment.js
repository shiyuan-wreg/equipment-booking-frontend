// src/stores/equipment.js
import { defineStore } from 'pinia';
import { equipmentService } from '@/services/equipmentService';

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipments: [],
    loading: false
  }),

  actions: {
   async fetchEquipments() {
      this.loading = true;
      try {
        const response = await apiClient.get('/api/equipments'); // ← 调用真实接口
        this.equipments = response.data; // ← 覆盖本地数据
      } catch (error) {
        console.error('获取设备列表失败:', error);
      } finally {
        this.loading = false;
      }
    },


    async addEquipment(data) {
      try {
        await apiClient.post('/api/equipments', data); // ← 发送创建请求
        await this.fetchEquipments(); // ← 重新拉取最新数据
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || '添加失败' };
      }
    },

    async updateEquipment(id, equipmentData) {
      try {
        await equipmentService.update(id, equipmentData);
        await this.fetchEquipments();
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.message || '更新失败';
        console.error(message, error);
        return { success: false, message };
      }
    },

    async deleteEquipment(id) {
      try {
        await equipmentService.delete(id);
        await this.fetchEquipments();
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.message || '删除失败';
        console.error(message, error);
        return { success: false, message };
      }
    }
  }
});