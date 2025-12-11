// src/stores/equipment.js
import { defineStore } from 'pinia';
import { equipmentService } from '@/services/equipmentService';

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipments: [],
    loading: false
  }),

  actions: {
    // 获取设备列表
    async fetchEquipments() {
      this.loading = true;
      try {
        const response = await equipmentService.getAll();
        this.equipments = response.data;
      } catch (error) {
        console.error('获取设备列表失败:', error);
        // 可选：显示 ElMessage.error
      } finally {
        this.loading = false;
      }
    },

    // 添加设备
    async addEquipment(equipmentData) {
      try {
        await equipmentService.create(equipmentData);
        await this.fetchEquipments(); // 自动刷新列表
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.message || '添加设备失败';
        console.error(message, error);
        return { success: false, message };
      }
    },

    // 更新设备
    async updateEquipment(id, equipmentData) {
      try {
        await equipmentService.update(id, equipmentData);
        await this.fetchEquipments();
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.message || '更新设备失败';
        console.error(message, error);
        return { success: false, message };
      }
    },

    // 删除设备
    async deleteEquipment(id) {
      try {
        await equipmentService.delete(id);
        await this.fetchEquipments();
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.message || '删除设备失败';
        console.error(message, error);
        return { success: false, message };
      }
    }
  }
});