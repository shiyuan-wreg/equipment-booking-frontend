// src/stores/equipment.js
import { defineStore } from 'pinia';

// --- 关键：引入你的后端基础 URL ---
// 请确保这个文件存在并且 VITE_API_BASE_URL 指向了你的 Railway 后端
import { VITE_API_BASE_URL } from '@/config';

// 定义 Store
export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipments: [], // 存储设备列表
    loading: false, // 是否正在加载
    error: null,    // 错误信息
  }),

  actions: {

    // --- 修改点 1：获取设备列表 (调用真实 API) ---
    async fetchEquipments() {
      this.loading = true;
      this.error = null;
      console.log(`[Store] 开始请求设备列表: ${VITE_API_BASE_URL}/api/equipments`);

      try {
        // 1. 发起 GET 请求到后端 /api/equipments
        const response = await fetch(`${VITE_API_BASE_URL}/api/equipments`);

        // 2. 检查响应状态
        if (!response.ok) {
          // 如果 HTTP 状态码不是 2xx，抛出错误
          const errorText = await response.text();
          throw new Error(`获取设备失败 (${response.status}): ${errorText}`);
        }

        // 3. 解析 JSON 数据
        const data = await response.json();
        console.log('[Store] 设备列表获取成功:', data);

        // 4. 更新 Store 状态
        this.equipments = data;
      } catch (err) {
        // 5. 捕获并处理错误
        console.error('[Store] 获取设备列表时出错:', err);
        this.error = err.message; // 将错误信息存入 state
      } finally {
        // 6. 无论成功与否，都将 loading 状态设为 false
        this.loading = false;
      }
    },

    // --- 修改点 2：创建预订 (调用真实 API) ---
    async createBooking(bookingData) {
      console.log('[Store] 开始创建预订:', bookingData);

      try {
        // 1. 发起 POST 请求到后端 /api/bookings
        //    注意：后端 API 期望的字段是 equipment_id, user_name, booking_date
        //    你需要确保传入的 bookingData 符合这个格式
        const requestBody = {
          equipment_id: bookingData.equipment_id,
          user_name: bookingData.user_name || '匿名用户', // 临时默认值，应由前端提供
          booking_date: bookingData.booking_date || new Date().toISOString().split('T')[0], // 默认今天，格式 YYYY-MM-DD
          // 如果你的后端 API 需要 start_time, end_time, purpose，请相应调整
        };

        const response = await fetch(`${VITE_API_BASE_URL}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        // 2. 检查响应状态
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // 尝试解析错误信息
          throw new Error(errorData.message || `预订失败 (${response.status})`);
        }

        // 3. 解析成功响应
        const result = await response.json();
        console.log('[Store] 预订创建成功:', result);

        // 4. 可选：立即刷新设备列表，以显示状态更新
        // await this.fetchEquipments(); 
        // 或者，前端可以选择只更新特定设备的状态，但这需要更复杂的逻辑
        
        // 5. 返回成功结果
        return { success: true, data: result };
      } catch (err) {
        // 6. 捕获并处理错误
        console.error('[Store] 创建预订时出错:', err);
        // 7. 返回失败结果
        return { success: false, error: err.message };
      }
    },
  },
});