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
    // 调试：看 response 到底是什么
    console.log('API Response:', response);

    // 关键修复：判断 response 是数组还是包装对象
    if (Array.isArray(response)) {
      this.equipments = response;
    } else if (Array.isArray(response.data)) {
      this.equipments = response.data;
    } else {
      this.equipments = [];
    }
  } catch (error) {
    console.error('获取设备列表失败:', error);
    this.equipments = [];
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