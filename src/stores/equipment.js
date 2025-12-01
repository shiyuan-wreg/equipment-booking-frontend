// src/stores/equipment.js (请确认内容与此类似)
import { defineStore } from 'pinia';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipments: [],
    loading: false,
    error: null,
  }),

  actions: {
    // --- 3. 获取设备列表的 Action ---
    async fetchEquipments() {
      this.loading = true;
      this.error = null;
      try {
        console.log(`[Pinia Store] 正在请求设备列表: ${VITE_API_BASE_URL}/equipments`);
        const response = await axios.get(`${VITE_API_BASE_URL}/equipments`);
        console.log('[Pinia Store] 收到设备列表响应:', response.data);
        this.equipments = response.data;
      } catch (err) {
        console.error('[Pinia Store] 获取设备列表失败:', err);
        if (err.response) {
          this.error = `获取失败 (${err.response.status}): ${err.response.data?.error || '未知错误'}`;
        } else if (err.request) {
          this.error = '网络错误或服务器无响应';
        } else {
          this.error = `请求配置错误: ${err.message}`;
        }
        // 可选：抛出错误以便调用者处理
        // throw err;
      } finally {
        this.loading = false;
      }
    },

    // --- 4. 新增：创建预约的 Action ---
    /**
     * 创建一个新的设备预约
     * @param {Object} bookingData - 预约信息对象
     * @param {number} bookingData.user_id - 用户ID
     * @param {number} bookingData.equipment_id - 设备ID
     * @param {string} bookingData.start_time - 预约开始时间 (ISO 8601 格式)
     * @param {string} bookingData.end_time - 预约结束时间 (ISO 8601 格式)
     * @param {string} bookingData.purpose - 预约用途
     * @returns {Promise<Object>} - 返回后端响应的数据或错误信息
     */
    async createBooking(bookingData) {
      try {
        console.log(`[Pinia Store] 正在创建预约:`, bookingData);
        // 假设后端创建预约的 API 是 POST /api/bookings
        const response = await axios.post(`${VITE_API_BASE_URL}/bookings`, bookingData);
        console.log('[Pinia Store] 预约创建成功:', response.data);
        // 可以选择在这里做一些操作，比如弹出成功消息，或者刷新预约列表（如果有的话）
        return { success: true, data: response.data };
      } catch (err) {
        console.error('[Pinia Store] 创建预约失败:', err);
        let errorMessage = '创建预约失败';
        if (err.response) {
          errorMessage = `(${err.response.status}): ${err.response.data?.error || '未知错误'}`;
        } else if (err.request) {
          errorMessage = '网络错误或服务器无响应';
        } else {
          errorMessage = err.message;
        }
        // 返回错误信息，方便调用者处理
        return { success: false, error: errorMessage };
      }
    }
    // --- 可以在这里添加更多与设备相关的 Action，例如 fetchEquipmentById, updateEquipment, deleteEquipment 等 ---
  },
});