// src/stores/equipment.js
import { defineStore } from 'pinia';
import { equipmentService } from '@/services/equipmentService'; // ✅ 已导入

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipments: [],
    loading: false
  }),

  actions: {
    async fetchEquipments() {
      this.loading = true;
      try {
        const response = await equipmentService.getAll();
        this.equipments = response.data; // ✅ 正确
      } catch (error) {
        console.error('获取设备列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async addEquipment(data) {
      try {
        await equipmentService.create(data);
        await this.fetchEquipments();
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || '添加失败' };
      }
    },

    // ✅ 修复：统一使用 equipmentService
    async updateEquipment(id, data) {
      try {
        await equipmentService.update(id, data); // ← 改为调用 service
        await this.fetchEquipments();
        return { success: true };
      } catch (error) {
        const msg = error.response?.data?.message || '更新失败';
        return { success: false, message: msg };
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