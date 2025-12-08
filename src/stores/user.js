// src/stores/user.js
import { defineStore } from 'pinia';
import apiClient from '@/services/apiClient'; // ← 修正路径

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false,
    userInfo: null
  }),

  actions: {
    async login(credentials) {
      const { username, password } = credentials;
      try {
        // 调用真实的后端登录接口
        const response = await apiClient.post('/api/auth/login', { username, password });
        
        this.isAuthenticated = true;
        this.userInfo = response.data.user;
        
        // 可选：存入 localStorage 实现刷新保持登录
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return { success: true };
      } catch (error) {
        console.error('Login failed:', error);
        let message = '登录失败';
        if (error.response?.status === 401) {
          message = '用户名或密码错误';
        } else if (error.response?.status >= 500) {
          message = '服务器错误，请稍后再试';
        }
        return { success: false, message };
      }
    },

    logout() {
      this.isAuthenticated = false;
      this.userInfo = null;
      localStorage.removeItem('user');
    },

    // 页面刷新时恢复登录状态
    initializeFromStorage() {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.userInfo = JSON.parse(savedUser);
        this.isAuthenticated = true;
      }
    }
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    userRole: (state) => state.userInfo?.role || 'guest'
  }
});