// src/stores/equipment.js
import { defineStore } from 'pinia';

// --- 关键：使用 import.meta.env 获取环境变量 ---
// 这会自动从 .env 文件中读取 VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipments: [],
    loading: false,
    error: null,
  }),

  actions: {

    // --- 修改点 1：获取设备列表 ---
    async fetchEquipments() {
      this.loading = true;
      this.error = null;
      console.log(`[Store] 开始请求设备列表: ${API_BASE_URL}/api/equipments`);

      try {
        const response = await fetch(`${API_BASE_URL}/api/equipments`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`获取设备失败 (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        console.log('[Store] 设备列表获取成功:', data);

        this.equipments = data;
      } catch (err) {
        console.error('[Store] 获取设备列表时出错:', err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // --- 修改点 2：创建预订 ---
    async createBooking(bookingData) {
      console.log('[Store] 开始创建预订:', bookingData);

      try {
        const requestBody = {
          equipment_id: bookingData.equipment_id,
          user_name: bookingData.user_name || '匿名用户',
          booking_date: bookingData.booking_date || new Date().toISOString().split('T')[0],
        };

        const response = await fetch(`${API_BASE_URL}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `预订失败 (${response.status})`);
        }

        const result = await response.json();
        console.log('[Store] 预订创建成功:', result);

        return { success: true, data: result };
      } catch (err) {
        console.error('[Store] 创建预订时出错:', err);
        return { success: false, error: err.message };
      }
    },
  },
});