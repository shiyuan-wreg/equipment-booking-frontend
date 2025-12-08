// src/stores/user.js
import { defineStore } from 'pinia'
// 1. 引入刚刚创建的 axios 实例
import apiClient from '@/services/apiClient' // 确保路径正确

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false,
    userInfo: null, // 存储用户信息，如 { id, username, role }
    token: null // 存储认证 token
  }),

  actions: {
    // 修改 login action 为真实的 API 调用
    async login(credentials) {
      // credentials 应该是 { username, password }
      const { username, password } = credentials
      console.log('[STORE] login action called with:', { username }) // 不要打印密码

      try {
        // 2. 使用 apiClient 发送 POST 请求到后端登录接口
        const response = await apiClient.post('/api/auth/login', {
          username,
          password
        })

        console.log('[STORE] login API response:', response.data)

        // 3. 假设后端返回 { message, user, token }
        const { user, token } = response.data

        // 4. 更新 Store 状态
        this.isAuthenticated = true
        this.userInfo = user
        this.token = token // 存储 token

        // 5. (可选) 将 token 存储到 localStorage，以便页面刷新后保持登录状态
        localStorage.setItem('authToken', token)
        // 如果需要，也可以存储 userInfo
        // localStorage.setItem('userInfo', JSON.stringify(user));

        console.log('[STORE] User logged in successfully')
        // 6. 可以返回一些信息给调用者
        return { success: true, message: response.data.message }
      } catch (error) {
        // 7. 捕获并处理错误
        console.error('[STORE] login API call failed:', error)

        // 8. 清理状态 (以防万一)
        this.logout()

        // 9. 提取后端返回的错误信息或使用默认信息
        let errorMessage = '登录失败'
        if (error.response) {
          // 服务器返回了错误状态码 (4xx, 5xx)
          errorMessage = error.response.data.message || errorMessage
        } else if (error.request) {
          // 请求已发出但没有收到响应
          errorMessage = '网络错误或服务器无响应'
        } else {
          // 其他错误
          errorMessage = error.message || errorMessage
        }

        // 10. 将错误信息返回给调用者
        return { success: false, message: errorMessage }
      }
    },
    logout() {
      this.isAuthenticated = false
      this.userInfo = null
      this.token = null
      console.log('[STORE] User logged out')
      // 11. (可选) 清除 localStorage 中的 token
      localStorage.removeItem('authToken')
      // localStorage.removeItem('userInfo');
    }
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    userRole: (state) => state.userInfo?.role || 'guest',
    username: (state) => state.userInfo?.username || ''
  }
})