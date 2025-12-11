<!-- src/views/EquipmentList.vue -->
<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useEquipmentStore } from '@/stores/equipment';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const equipmentStore = useEquipmentStore();

// 用于跟踪每个设备的预约状态
const bookingStatus = ref({});
// 全局禁用按钮，防止重复提交
const isBooking = ref(false);

// 格式化日期的辅助函数
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(() => {
  equipmentStore.fetchEquipments();
});

// --- 修改点：调整 handleBook 函数以符合后端 API ---
const handleBook = async (equipmentId) => {
  // 1. 设置按钮为禁用状态和加载文本
  isBooking.value = true;
  bookingStatus.value[equipmentId] = '预约中...';
  
  // 2. 构造符合后端 API 期望的预约数据
  // 注意：后端需要 equipment_id, user_name, booking_date
  // 这里的 user_name 和 booking_date 是示例，你需要根据实际情况获取或让用户输入
  const bookingPayload = {
  equipment_id: equipmentId,
  user_name: userStore.userInfo?.username || '匿名用户', // ← 关键修改
  booking_date: selectedDate.value || new Date().toISOString().split('T')[0],
};

  try {
    // 3. 调用 store 中修改过的 createBooking action
    const result = await equipmentStore.createBooking(bookingPayload);

    // 4. 根据结果更新 UI 状态
    if (result.success) {
      bookingStatus.value[equipmentId] = '预约成功!';
      // 可选：几秒后清除状态
      setTimeout(() => {
        delete bookingStatus.value[equipmentId];
        // 预订成功后，重新获取设备列表以更新状态
        equipmentStore.fetchEquipments(); 
      }, 2000);
    } else {
      bookingStatus.value[equipmentId] = `预约失败: ${result.error}`;
      // 失败后也刷新列表，以防状态不同步
      setTimeout(() => {
         equipmentStore.fetchEquipments();
      }, 2000);
    }
  } catch (error) {
    console.error("预约过程中发生意外错误:", error);
    bookingStatus.value[equipmentId] = '预约失败: 发生未知错误';
    setTimeout(() => {
         equipmentStore.fetchEquipments();
    }, 2000);
  } finally {
    // 5. 重置按钮状态
    isBooking.value = false;
  }
};
</script>