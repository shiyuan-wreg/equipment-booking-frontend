// src/api/index.js
import axios from 'axios';

// 使用环境变量或默认值
const apiClient = axios.create({
  // VITE_ 前缀是 Vite 识别环境变量的要求
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 token (如果存在)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理通用错误 (例如 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token 无效或过期，清空本地存储');
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userInfo');
      // 注意：这里无法直接访问 Vue Router。通常的做法是在调用 API 的地方处理跳转，
      // 或者发送一个全局事件让 App.vue 或 Pinia Store 来监听并处理跳转。
      // window.location.href = '/login'; // 一种简单粗暴的方式
    }
    return Promise.reject(error);
  }
);

export default apiClient;