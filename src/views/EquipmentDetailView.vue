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
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useEquipmentStore } from '@/stores/equipment';
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';

const route = useRoute();
const equipmentStore = useEquipmentStore();
const userStore = useUserStore();

const equipmentId = parseInt(route.params.id);
const equipment = ref(null);
const bookingForm = ref({
  equipment_id: equipmentId,
  booking_date: '',
  user_id: userStore.userInfo?.id
});

// 从 store 的完整列表中查找设备
const findEquipment = () => {
  const found = equipmentStore.equipments.find(eq => eq.id === equipmentId);
  if (found) {
    equipment.value = found;
  } else {
    ElMessage.error('无法查看设备详情');
  }
};

// 确保设备列表已加载
const ensureEquipmentsLoaded = async () => {
  if (equipmentStore.equipments.length === 0) {
    await equipmentStore.fetchEquipments(); // 触发加载
  }
  findEquipment();
};

onMounted(() => {
  ensureEquipmentsLoaded();
});

// 如果用户手动刷新详情页，store 可能为空，所以监听列表变化
watch(
  () => equipmentStore.equipments,
  () => {
    if (!equipment.value && equipmentStore.equipments.length > 0) {
      findEquipment();
    }
  }
);

const getStatusText = (status) => {
  switch (status) {
    case 'available': return { type: 'success', label: '可预约' };
    case 'booked': return { type: 'warning', label: '已预约' };
    default: return { type: 'info', label: '未知' };
  }
};

const handleBooking = async () => {
  if (!bookingForm.value.booking_date) {
    ElMessage.warning('请选择预约日期');
    return;
  }

  try {
    await equipmentStore.createBooking(bookingForm.value);
    ElMessage.success('预约成功');
    // 可选：刷新设备状态（因为预订后设备可能变为 booked）
    await equipmentStore.fetchEquipments();
    findEquipment(); // 更新当前设备状态
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