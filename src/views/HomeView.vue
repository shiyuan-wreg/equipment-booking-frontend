<template>
  <div class="home">
    <el-row :gutter="20" justify="center">
      <el-col :span="24" :md="16">
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <span>欢迎</span>
            </div>
          </template>
          <div class="content">
            <h2 v-if="isLoggedIn">欢迎来到实验室设备预约系统, {{ displayName }}!</h2>
            <h2 v-else>欢迎来到实验室设备预约系统</h2>
            <p v-if="isLoggedIn">在这里，您可以方便地浏览和预约所需的实验室设备。</p>
            <p v-else>请登录以开始使用我们的服务。</p>
            <el-button v-if="isLoggedIn" type="primary" @click="$router.push('/equipments')">开始浏览设备</el-button>
            <el-button v-else type="primary" @click="$router.push('/login')">立即登录</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 计算属性：用户是否已登录
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 计算属性：显示用户名或默认称呼
const displayName = computed(() => {
  return userStore.userInfo?.username ? userStore.userInfo.username : '访客'
})
</script>

<style scoped>
/* ... 保持原来的样式不变 ... */
</style>