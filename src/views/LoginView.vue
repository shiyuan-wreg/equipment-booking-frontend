<!-- src/views/LoginView.vue -->
<template>
  <div class="login-container">
    <el-card class="login-box">
      <template #header>
        <div class="card-header">
          <span>用户登录</span>
        </div>
      </template>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading">登录</el-button>
          <!-- 可以添加一个“重置”按钮 -->
          <!-- <el-button @click="resetForm(loginFormRef)">重置</el-button> -->
        </el-form-item>
      </el-form>
      <!-- 可以添加一个“去注册”链接，如果未来有注册功能 -->
      <!-- <p>还没有账号？<el-link type="primary" @click="$router.push('/register')">立即注册</el-link></p> -->
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user' // 引入我们刚创建的 Store

// 获取 Store 和 Router 实例
const userStore = useUserStore()
const router = useRouter()

// 控制登录按钮加载状态
const loading = ref(false)

// 表单引用，用于调用表单方法（如验证）
const loginFormRef = ref()

// 表单数据模型
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
    // 可以添加更多规则，如最小长度
    // { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

// 处理登录逻辑
const handleLogin = async () => {
  // 确保表单引用存在
  if (!loginFormRef.value) return

  // 触发表单验证
  await loginFormRef.value.validate((valid) => {
    if (valid) {
      // 验证通过，开始登录流程
      loading.value = true

      // 模拟 API 调用（实际项目中这里会发送 HTTP 请求）
      setTimeout(() => {
        // 假设登录成功，后端返回用户信息
        // 这里我们做一个简单的角色判断模拟
        const mockUserInfo = {
          id: 1,
          username: loginForm.username,
          role: loginForm.username.toLowerCase() === 'admin' ? 'admin' : 'user' // 简单模拟区分角色
        }

        // 调用 Store 的 login action
        userStore.login(mockUserInfo)

        // 显示成功消息
        ElMessage.success('登录成功!')

        // 登录成功后跳转到首页
        router.push('/')

        // 结束加载状态
        loading.value = false
      }, 1000) // 模拟网络延迟

    } else {
      // 验证失败
      console.log('表单验证失败!')
      return false
    }
  })
}

// 重置表单函数（如果需要）
// const resetForm = (formEl) => {
//   if (!formEl) return
//   formEl.resetFields()
// }
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 占满整个视口高度 */
  background-color: #f5f5f5; /* 背景色 */
}

.login-box {
  width: 400px;
  max-width: 90%; /* 在小屏幕上自适应 */
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
</style>