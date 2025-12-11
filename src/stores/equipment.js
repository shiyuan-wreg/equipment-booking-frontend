// src/stores/equipment.js
import { defineStore } from 'pinia';
import apiClient from '@/api'; // 确保路径正确

// --- 关键：使用 import.meta.env 获取环境变量 ---
// 这会自动从 .env 文件中读取 VITE_API_BASE_URL

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;出于更改需求，该行注释

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipments: [],
    loading: false,
    error: null,
  }),

  actions: {

    // --- 修改点 2：使用 apiClient 重构 fetchEquipments ---
    async fetchEquipments() {
      this.loading = true;
      this.error = null;
      console.log(`[Store] 开始请求设备列表...`);

      try {
        // 直接使用 apiClient，它会自动使用 baseURL
        const response = await apiClient.get('/equipments'); // 请求 /api/equipments

        console.log('[Store] 设备列表获取成功:', response.data);

        this.equipments = response.data;
      } catch (err) {
        console.error('[Store] 获取设备列表时出错:', err);
        // Axios 错误对象结构略有不同
        this.error = err.response?.data?.message || err.message || '未知错误';
      } finally {
        this.loading = false;
      }
    },

    // --- 修改点 3：使用 apiClient 重构 createBooking ---
    async createBooking(bookingData) {
      console.log('[Store] 开始创建预订:', bookingData);

      try {
        // 构造符合后端 API 的请求体
        const requestBody = {
          equipment_id: bookingData.equipment_id,
          user_name: bookingData.user_name || '匿名用户',
          booking_date: bookingData.booking_date || new Date().toISOString().split('T')[0],
        };

        // 使用 apiClient 发送 POST 请求
        const response = await apiClient.post('/bookings', requestBody); // 请求 /api/bookings

        console.log('[Store] 预订创建成功:', response.data);

        return { success: true, data: response.data };
      } catch (err) {
        console.error('[Store] 创建预订时出错:', err);
         // Axios 错误对象结构略有不同
        const errorMessage = err.response?.data?.message || err.message || '预订失败';
        return { success: false, error: errorMessage };
      }
    },
    async addEquipment(equipmentData) {
      await apiClient.post('/api/equipments', equipmentData);
      this.fetchEquipments(); // 自动刷新
    },

    async updateEquipment(id, equipmentData) {
      await apiClient.put(`/api/equipments/${id}`, equipmentData);
      this.fetchEquipments();
    },

    async deleteEquipment(id) {
      await apiClient.delete(`/api/equipments/${id}`);
      this.fetchEquipments();
    }
    
  },
});
