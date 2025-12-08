<!-- src/views/LoginView.vue -->
<template>
  <div class="login-container">
    <el-card class="login-box">
      <template #header>
        <div class="card-header">
          <span>用户登录</span>
        </div>
      </template>
      <!-- 
        关键修改：移除了 @submit.prevent="handleLogin"，因为 el-form-item 内的 button 
        类型为 submit 时，默认就会触发表单提交。我们直接在 button 上绑定 click 事件更清晰。
        或者保留，但 handleLogin 必须是 async 函数来处理 Promise。
      -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
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
          <!-- 关键修改：绑定 click 事件，并传递表单数据 -->
          <el-button 
            type="primary" 
            @click="handleLogin" 
            :loading="loading"
            native-type="submit" 
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

const loading = ref(false)
const loginFormRef = ref()

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 关键修改：将 handleLogin 改为 async 函数
const handleLogin = async () => {
  if (!loginFormRef.value) return

  // 使用 Element Plus 表单的 validate 方法，它返回一个 Promise
  try {
    // await loginFormRef.value.validate(); // 这种方式也可以，但我们用回调
    await new Promise((resolve, reject) => {
       loginFormRef.value.validate((valid) => {
         if (valid) {
           resolve();
         } else {
           reject(new Error('表单验证失败'));
         }
       });
    });

    loading.value = true

    // 调用 Store 的 login action，传入真实的表单数据
    const result = await userStore.login({
      username: loginForm.username,
      password: loginForm.password
    })

    loading.value = false

    if (result.success) {
      ElMessage.success(result.message || '登录成功!')
      // 登录成功后跳转到首页
      router.push('/')
    } else {
      // 登录失败，显示错误信息
      ElMessage.error(result.message || '登录失败')
    }
  } catch (err) {
    // 这里捕获的是表单验证失败或 login action 抛出的错误
    loading.value = false
    if (err.message !== '表单验证失败') {
        // 如果是 login action 内部未捕获的错误，也应该提示
        ElMessage.error('登录过程中发生未知错误')
        console.error('Unexpected error during login:', err)
    }
    // 表单验证失败的情况，Element Plus 通常会自己显示错误提示，这里可以不做额外处理
    console.log('Login process cancelled or validation failed.')
  }
}
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