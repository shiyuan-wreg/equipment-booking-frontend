<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="common-layout">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <Navbar />
      </el-header>

      <!-- 主体内容区域 -->
      <el-main>
        <!-- 子路由的内容将在这里显示 -->
         <router-link to="/equipments">设备列表</router-link>
        <slot />
      </el-main>

      <!-- 底部区域 -->
      <el-footer style="text-align: center; padding: 20px;">
        &copy; {{ new Date().getFullYear() }} 实验室设备预约系统
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
// 导入导航栏组件
import Navbar from '@/components/Navbar.vue'
</script>

<style scoped>
/* 设置布局容器占满视口高度 */
.common-layout {
  min-height: 100vh;
}

/* 自定义 Header 样式 */
.el-header {
  background-color: #409eff; /* Element Plus 的主题色 */
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加一点阴影 */
}

/* 自定义 Main 样式 */
.el-main {
  background-color: #f5f5f5; /* 背景色与登录页一致 */
  padding: 20px;
}

/* 自定义 Footer 样式 */
.el-footer {
  background-color: #e4e7ed;
  color: #606266;
  font-size: 14px;
}
</style>