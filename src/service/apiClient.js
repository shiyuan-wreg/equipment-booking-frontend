// src/services/apiClient.js
import axios from 'axios'

// 1. 从环境变量中读取后端 API 的基础 URL
// Vite 在构建时会将 VITE_ 前缀的变量暴露给客户端代码
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

console.log('[API Client] Base URL set to:', API_BASE_URL) // 调试日志

// 2. 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL, // 所有请求的基础路径
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
    // 可以在这里设置通用的 headers
  }
})

// 3. (可选) 添加请求拦截器，例如在请求头中加入 token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken'); // 假设 token 存在 localStorage
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 4. (可选) 添加响应拦截器，统一处理错误或 token 过期
// apiClient.interceptors.response.use(
//   (response) => response, // 直接返回成功的响应
//   (error) => {
//     if (error.response?.status === 401) {
//        // 401 Unauthorized, 可能是 token 过期或无效
//        console.warn('[API Client] 401 Unauthorized, redirecting to login...');
//        localStorage.removeItem('authToken');
//        window.location.href = '/login'; // 或者使用 router.push
//     }
//     return Promise.reject(error); // 将错误继续抛出，让调用者处理
//   }
// );

export default apiClient