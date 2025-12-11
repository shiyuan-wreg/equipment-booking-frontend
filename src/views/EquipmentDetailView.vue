<!-- src/views/EquipmentDetailView.vue -->
<template>
  <div class="equipment-detail">
    <h1>{{ equipment.name }}</h1>

    <!-- 设备详情 -->
    <el-card shadow="hover">
      <template #header>
        <span>设备详情</span>
      </template>
      <div class="card-body">
        <p><strong>描述:</strong> {{ equipment.description || '暂无描述' }}</p>
        <p><strong>状态:</strong> <el-tag :type="getStatusText(equipment.status).type">{{ getStatusText(equipment.status).label }}</el-tag></p>
      </div>
    </el-card>

    <!-- 预约表单 -->
    <el-card v-if="equipment.status === 'available'" shadow="hover" style="margin-top: 20px;">
      <template #header>
        <span>预约此设备</span>
      </template>
      <el-form :model="bookingForm" label-width="80px" @submit.prevent="handleBooking">
        <el-form-item label="预约日期" required>
          <el-date-picker
            v-model="bookingForm.booking_date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">提交预约</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-alert v-else type="warning" show-icon>该设备当前不可预约。</el-alert>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useEquipmentStore } from '@/stores/equipment';
import { useUserStore } from '@/stores/user'; // 假设你有 user store 来获取当前用户 ID
import { ElMessage } from 'element-plus';

const route = useRoute();
const equipmentStore = useEquipmentStore();
const userStore = useUserStore();

const equipmentId = parseInt(route.params.id); // 从 URL 参数获取设备 ID
const equipment = ref(null);
const bookingForm = ref({
  equipment_id: equipmentId,
  booking_date: '',
  user_id: userStore.userInfo?.id // 使用当前登录用户的 ID
});

// 获取设备详情
const loadEquipment = async () => {
  try {
    equipment.value = await equipmentStore.fetchEquipmentById(equipmentId);
  } catch (error) {
    ElMessage.error('无法加载设备详情');
  }
};

onMounted(() => {
  loadEquipment();
});

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'available': return { type: 'success', label: '可预约' };
    case 'booked': return { type: 'warning', label: '已预约' };
    default: return { type: 'info', label: '未知' };
  }
};

// 提交预约
const handleBooking = async () => {
  if (!bookingForm.value.booking_date) {
    ElMessage.warning('请选择预约日期');
    return;
  }

  try {
    await equipmentStore.createBooking(bookingForm.value);
    ElMessage.success('预约成功');
  } catch (error) {
    ElMessage.error('预约失败');
  }
};
</script>

<style scoped>
.equipment-detail {
  padding: 20px;
}

.card-body {
  line-height: 1.6;
}
</style>