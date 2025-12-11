<!-- src/views/MyBookingsView.vue -->
<template>
  <div class="my-bookings">
    <h2>我的预约</h2>
    
    <el-empty v-if="bookings.length === 0 && !loading" description="暂无预约记录" />
    
    <el-table v-else :data="bookings" style="width: 100%" v-loading="loading">
      <el-table-column prop="equipment_name" label="设备名称" width="200" />
      <el-table-column prop="booking_date" label="预约日期" width="150">
        <template #default="{ row }">
          {{ formatDate(row.booking_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button size="small" type="danger" @click="cancelBooking(row.id)">
            取消预约
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/user';
import apiClient from '@/services/apiClient';

const userStore = useUserStore();
const bookings = ref([]);
const loading = ref(false);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0]; // "2025-12-15"
};

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  const d = new Date(dateTimeStr);
  return d.toLocaleString('zh-CN');
};

const loadMyBookings = async () => {
  const userId = userStore.userInfo?.id;
  if (!userId) {
    ElMessage.warning('请先登录');
    return;
  }

  loading.value = true;
  try {
    const response = await apiClient.get(`/api/bookings?user_id=${userId}`);
    bookings.value = response.data;
  } catch (error) {
    console.error('加载我的预约失败:', error);
    ElMessage.error('加载预约失败');
  } finally {
    loading.value = false;
  }
};

const cancelBooking = async (bookingId) => {
  try {
    await ElMessageBox.confirm('确定要取消此预约吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    // 调用删除接口
    await apiClient.delete(`/api/bookings/${bookingId}`);
    ElMessage.success('预约已取消');
    loadMyBookings(); // 刷新列表
  } catch (err) {
    if (err.response?.status === 400) {
      ElMessage.error(err.response.data.message || '无法取消预约');
    } else {
      ElMessage.error('取消失败');
    }
  }
};

onMounted(() => {
  loadMyBookings();
});
</script>

<style scoped>
.my-bookings {
  padding: 20px;
}
</style>