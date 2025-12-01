// src/stores/user.js
import { defineStore } from 'pinia';
// 1. 引入你之前配置好的 axios 实例
import apiClient from '@/api'; // 确保路径正确

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false,
    userInfo: null // 存储用户信息，如 { id, username, role }
  }),

  actions: {
    async login(userData) {
      // ---- 新增：测试前后端连接 ----
      try {
        console.log('[STORE] 尝试调用后端 /api/test...');
        // 2. 使用 apiClient 发送 GET 请求到 /api/test
        const response = await apiClient.get('/test'); // apiClient 的 baseURL 是 /api，所以这里请求的是 http://localhost:3000/api/test
        console.log('[STORE] 后端测试 API 响应:', response.data); // 3. 打印响应数据
      } catch (error) {
        // 4. 捕获并打印错误
        console.error('[STORE] 调用后端测试 API 失败:', error.message || error);
        // 如果是网络错误或 CORS 错误，通常会在这里看到
      }
      // ---- 测试代码结束 ----

      // 原有的模拟登录逻辑保持不变 (暂时)
      this.isAuthenticated = true;
      this.userInfo = userData;
      console.log('User logged in (mock):', userData);
      // 注意：这里没有返回任何值，可以根据需要调整
    },
    logout() {
      this.isAuthenticated = false;
      this.userInfo = null;
      console.log('User logged out');
    }
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    userRole: (state) => state.userInfo?.role || 'guest'
  }
});