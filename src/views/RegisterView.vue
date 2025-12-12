<!-- src/views/RegisterView.vue -->
<template>
  <div class="register-container">
    <el-card style="max-width: 400px; margin: 50px auto;">
      <template #header>
        <h2 style="text-align: center;">用户注册</h2>
      </template>

      <el-form :model="form" :rules="rules" ref="registerForm" @submit.prevent="handleRegister">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名（3-30字符）" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            show-password
          />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading" style="width: 100%;">
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <div style="text-align: center; margin-top: 15px;">
        已有账号？<router-link to="/login">立即登录</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import apiClient from '@/services/apiClient';
import { useUserStore } from '@/stores/user';
const router = useRouter();
const registerForm = ref(null);
const loading = ref(false);

const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 30, message: '用户名长度需在 3-30 个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

const handleRegister = async () => {
  await registerForm.value.validate();

  loading.value = true;
  try {
    const response = await apiClient.post('/api/auth/register', {
      username: form.username,
      password: form.password
    });

    ElMessage.success('注册成功！');
    
    // 方式1：注册后自动登录（推荐）
    const { user } = response.data;
    const userStore = useUserStore();
    userStore.setUserInfo(user); // 更新 Pinia 状态
    
    // 跳转到首页或设备列表
    router.push('/equipments');

    // 方式2：注册后跳转到登录页（可选）
    // router.push('/login');
  } catch (error) {
    const msg = error.response?.data?.message || '注册失败，请稍后重试';
    ElMessage.error(msg);
  } finally {
    loading.value = false;
  }
};
// 如果选择“注册后跳转登录”，可注释掉上面的 userStore 相关代码

</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}
</style>