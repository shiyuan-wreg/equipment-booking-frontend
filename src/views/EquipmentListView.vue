<!-- src/views/EquipmentListView.vue -->
<template>
  <div class="equipment-list">
    <h1>设备列表</h1>
    
    <!-- 设备搜索和筛选区域 (暂时留空，后续添加) -->
    <!-- <div class="filters">
      ...
    </div> -->

    <!-- 设备列表 -->
    <div class="list">
      <el-row :gutter="20">
        <el-col
          v-for="equipment in equipmentList"
          :key="equipment.id"
          :span="24"
          :md="12"
          :lg="8"
        >
          <el-card class="equipment-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>{{ equipment.name }}</span>
                <el-tag :type="equipment.status === 'available' ? 'success' : 'warning'">{{ getStatusText(equipment.status) }}</el-tag>
              </div>
            </template>
            <div class="card-body">
              <p><strong>型号:</strong> {{ equipment.model }}</p>
              <p><strong>描述:</strong> {{ equipment.description }}</p>
              <p><strong>位置:</strong> {{ equipment.location }}</p>
              <!-- 可以添加图片 <img :src="equipment.image" alt="设备图片" class="equipment-image"> -->
            </div>
            <div class="card-actions">
              <el-button
                type="primary"
                size="small"
                :disabled="equipment.status !== 'available'"
                @click="viewDetails(equipment.id)"
              >
                查看详情 / 预约
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 (暂时留空，后续添加) -->
    <!-- <div class="pagination">
       ...
    </div> -->

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEquipmentStore } from '@/stores/equipment'

const router = useRouter()
const equipmentStore = useEquipmentStore()

// 不再定义 equipmentList！直接用 store 的数据
const equipmentList = computed(() => equipmentStore.equipments)

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'available': return '可预约'
    case 'booked': return '已预约'     // 注意：后端用的是 'booked'，不是 'unavailable'
    case 'maintenance': return '维护中'
    default: return '未知'
  }
}

const viewDetails = (id) => {
  router.push(`/equipment/${id}`)
}

onMounted(() => {
  equipmentStore.fetchEquipments() // ← 关键：加载真实数据
})
</script>

<style scoped>
.equipment-list {
  padding: 20px;
}

.list {
  margin-top: 20px;
}

.equipment-card {
  margin-bottom: 20px;
  height: 100%; /* 使卡片等高 */
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  flex-grow: 1; /* 内容区域填充剩余空间 */
  margin-bottom: 10px;
}

.card-actions {
  text-align: right;
}

/* .equipment-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  margin-top: 10px;
} */
</style>