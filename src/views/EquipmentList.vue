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
          <!-- 这里可以添加“预约”按钮 -->
        </li>
      </ul>
      <p v-else>暂无可用设备。</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useEquipmentStore } from '@/stores/equipment'; // 确保路径正确

// 引入 store 实例
const equipmentStore = useEquipmentStore();

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
</style>