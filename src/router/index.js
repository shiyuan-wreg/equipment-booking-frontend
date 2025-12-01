// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue' // 假设你已有登录页
import EquipmentListView from '../views/EquipmentList.vue' // 新增导入

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
    // --- 新增的管理员路由 ---
    {
      path: '/admin/equipments',
      name: 'admin-equipments',
      component: () => import('../views/AdminEquipmentsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true } // 需要认证且需要管理员权限
    },
    {
      path: '/admin/bookings',
      name: 'admin-bookings',
      component: () => import('../views/AdminBookingsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true } // 需要认证且需要管理员权限
    }
    // ------------------------
  ]
})
import { useUserStore } from '@/stores/user'

// 全局前置守卫 - 更新逻辑
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
        // 检查用户角色
        if (userStore.userInfo?.role === 'admin') {
          // 是管理员，允许访问
          next()
        } else {
          // 不是管理员，可以重定向到无权限页面或首页
          // 这里我们简单地重定向到首页并给出提示
          ElMessage.error('您没有权限访问此页面')
          next('/')
        }
      } else {
        // 不需要管理员权限，允许访问
        next()
      }
    }
  } else {
    // 不需要认证，直接访问
    next()
  }
})

export default router