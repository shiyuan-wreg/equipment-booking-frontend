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
        this.equipments = response.data;
      } catch (error) {
        console.error('获取设备列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // ✅ 修复：使用 equipmentService
    async fetchEquipmentById(id) {
      try {
        const response = await equipmentService.getById(id); // ← 改为 service 方法
        return response.data;
      } catch (error) {
        console.error(`获取设备 ${id} 失败:`, error);
        throw error;
      }
    },

    // ✅ 修复：使用 equipmentService
    async createBooking(bookingData) {
      try {
        await equipmentService.createBooking(bookingData); // ← 改为 service 方法
        await this.fetchEquipments(); // 刷新设备状态
      } catch (error) {
        console.error('创建预约失败:', error);
        throw error;
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

    async updateEquipment(id, data) {
      try {
        await equipmentService.update(id, data);
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