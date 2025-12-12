// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/equipments',
      name: 'equipments',
      component: () => import('../views/EquipmentListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/equipment/:id',
      name: 'equipment-detail',
      component: () => import('../views/EquipmentDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/my-bookings',
      name: 'my-bookings',
      component: () => import('../views/MyBookingsView.vue'),
      meta: { requiresAuth: true }
    },
    // --- 管理员路由 ---
    {
      path: '/admin/equipments',
      name: 'AdminEquipmentsView',
      component: () => import('../views/AdminEquipmentsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true } // ← 修正拼写：去掉多余的 'r'
    },
    {
      path: '/admin/bookings',
      name: 'admin-bookings',
      component: () => import('../views/AdminBookingsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
     { path: '/register', component: RegisterView },
  { path: '/login', component: LoginView }
  ]
})

import { useUserStore } from '@/stores/user'

// 全局前置守卫 - 修正版（不使用 ElMessage）
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 如果目标路由需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!userStore.isLoggedIn) {
      // 未登录，重定向到登录页
      next('/login')
    } else {
      // 已登录，检查是否需要管理员权限
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (userStore.userRole === 'admin') {
          next()
        } else {
          // ❌ 不要在这里用 ElMessage！
          // 改为跳转到无权限页面，或首页
          next('/') // 跳回首页，由 HomeView 提示（可选）
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router