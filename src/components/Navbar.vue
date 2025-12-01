<!-- src/components/Navbar.vue -->
<template>
  <div class="navbar">
    <!-- Logo 或系统名称 -->
    <div class="logo">
      <strong>LabReserve</strong>
    </div>

    <!-- 导航链接 -->
    <div class="nav-links">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
        background-color="#409eff"
        text-color="white"
        active-text-color="#ffd04b"
        router
      >
        <!-- 首页链接 -->
        <el-menu-item index="/">首页</el-menu-item>

        <!-- 需要登录后才显示的链接 -->
        <el-menu-item v-if="isLoggedIn" index="/equipments">设备浏览</el-menu-item>
        <!-- --- 新增的菜单项 --- -->
        <el-menu-item v-if="isLoggedIn" index="/my-bookings">我的预约</el-menu-item>
        
        <!-- 管理员专属菜单 -->
        <el-sub-menu v-if="isAdmin" index="admin">
          <template #title>管理</template>
          <el-menu-item index="/admin/equipments">设备管理</el-menu-item>
          <el-menu-item index="/admin/bookings">预约审核</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>

    <!-- 用户信息区域 -->
    <div class="user-info">
      <span v-if="isLoggedIn">你好, {{ userInfo?.username }}</span>
      <el-button v-if="!isLoggedIn" link @click="$router.push('/login')">登录</el-button>
      <el-button v-else link @click="logout">退出</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 获取 Store, Router 和 Route 实例
const userStore = useUserStore()
const router = useRouter()
const route = useRoute() // 获取当前路由信息

// 计算属性：用户是否已登录
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 计算属性：用户信息
const userInfo = computed(() => userStore.userInfo)

// 计算属性：用户是否是管理员
const isAdmin = computed(() => userStore.userRole === 'admin')

// 计算属性：当前激活的菜单项索引 (根据当前路由路径)
const activeIndex = computed(() => route.path)

// 处理菜单项被选中事件 (Element Plus Menu 的 select 事件)
const handleSelect = (key) => {
  // Element Plus 的 menu 组件如果设置了 router 属性，
  // 会自动根据 index 进行路由跳转，所以我们通常不需要在这里手动 push
  // 但如果需要特殊处理，可以在这里写逻辑
  console.log('Selected menu item key:', key)
}

// 处理退出登录
const logout = () => {
  userStore.logout() // 调用 Store 的 logout action
  router.push('/login') // 跳转到登录页
}
</script>

<style scoped>
/* 导航栏整体样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* Logo 样式 */
.logo {
  font-size: 20px;
  font-weight: bold;
  margin-right: 20px; /* 与菜单之间留点距离 */
}

/* 导航链接区域样式 */
.nav-links {
  flex-grow: 1; /* 占据剩余空间 */
}

/* 用户信息区域样式 */
.user-info {
  margin-left: auto; /* 推到最右边 */
  display: flex;
  align-items: center;
  gap: 10px; /* 按钮和文字之间的间距 */
}
</style>