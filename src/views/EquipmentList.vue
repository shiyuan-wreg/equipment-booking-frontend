<!-- src/views/EquipmentList.vue -->
<template>
  <div class="equipment-list">
    <h1>可预约设备</h1>

    <!-- 加载指示器 -->
    <div v-if="equipmentStore.loading">加载中...</div>

    <!-- 错误信息 -->
    <div v-else-if="equipmentStore.error" class="error">
      错误: {{ equipmentStore.error }}
    </div>

    <!-- 设备列表 -->
    <div v-else>
      <!-- 检查 equipments 数组是否有内容 -->
      <ul v-if="equipmentStore.equipments && equipmentStore.equipments.length > 0">
        <li v-for="equipment in equipmentStore.equipments" :key="equipment.id">
          <h3>{{ equipment.name }}</h3>
          <p><strong>ID:</strong> {{ equipment.id }}</p>
          <p><strong>描述:</strong> {{ equipment.description }}</p>
          <p><strong>状态:</strong> {{ equipment.status }}</p>
          <p><strong>创建时间:</strong> {{ formatDate(equipment.created_at) }}</p>
          
          <!-- --- 新增：预约按钮 --- -->
          <button @click="handleBook(equipment.id)" :disabled="isBooking">预约此设备</button>
          <!-- 显示预约过程中的状态 -->
          <span v-if="bookingStatus[equipment.id]">{{ bookingStatus[equipment.id] }}</span>
        </li>
      </ul>
      <p v-else>暂无可用设备。</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'; // 引入 ref 用于局部状态管理
import { onMounted } from 'vue';
import { useEquipmentStore } from '@/stores/equipment'; // 确保路径正确

// 引入 store 实例
const equipmentStore = useEquipmentStore();

// --- 新增：用于跟踪预约状态的局部响应式对象 ---
// key: equipment.id, value: '预约中...' | '成功' | '失败: ...'
const bookingStatus = ref({});
const isBooking = ref(false); // 防止重复点击的全局标志（可以根据需要细化）

// 格式化日期的辅助函数 (可选)
const formatDate = (dateString) => {
  const options = {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// 当组件挂载时，自动调用 store 的 action 获取数据
onMounted(() => {
  equipmentStore.fetchEquipments();
});

// --- 新增：处理预约按钮点击事件 ---
const handleBook = async (equipmentId) => {
  // 1. 设置按钮为禁用状态和加载文本
  isBooking.value = true;
  bookingStatus.value[equipmentId] = '预约中...';

  // 2. 构造预约数据 (这里简化了，实际应用中可能需要用户输入更多信息，或从登录信息中获取 user_id)
  // TODO: 你需要获取真实的 user_id，这里暂时用 1 作为示例
  const mockUserId = 1; 
  const bookingData = {
    user_id: mockUserId, // *** 必须替换为真实用户ID ***
    equipment_id: equipmentId,
    // 这里缺少 start_time, end_time, purpose
    // 为了演示，我们用固定值或简单计算
    start_time: new Date().toISOString(), // 当前时间作为开始时间 (仅作示例!)
    end_time: new Date(Date.now() + 3600000).toISOString(), // 一小时后作为结束时间 (仅作示例!)
    purpose: '测试预约功能' // 固定用途 (仅作示例!)
  };

  try {
    // 3. 调用 store 中的 createBooking action
    const result = await equipmentStore.createBooking(bookingData);

    // 4. 根据结果更新 UI 状态
    if (result.success) {
      bookingStatus.value[equipmentId] = '预约成功!';
      // 可选：几秒后清除状态
      setTimeout(() => {
        delete bookingStatus.value[equipmentId];
      }, 3000);
    } else {
      bookingStatus.value[equipmentId] = `预约失败: ${result.error}`;
    }
  } catch (error) {
    console.error("预约过程中发生意外错误:", error);
    bookingStatus.value[equipmentId] = '预约失败: 发生未知错误';
  } finally {
    // 5. 重置按钮状态
    isBooking.value = false;
    // bookingStatus.value[equipmentId] 的状态保留，让用户看到结果
  }
};
</script>

<style scoped>
.error {
  color: red;
}
li {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}
/* --- 新增：按钮样式 --- */
button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>