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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import axios from 'axios' // 如果连接后端 API

const router = useRouter()

// 模拟设备数据
const equipmentList = ref([
  {
    id: 1,
    name: '高性能显微镜',
    model: 'XYZ-1000',
    description: '具备高分辨率成像能力，适用于细胞观察。',
    location: 'A栋101室',
    status: 'available' // available, unavailable, maintenance
  },
  {
    id: 2,
    name: '离心机',
    model: 'ABC-200',
    description: '最大转速可达15000 rpm，用于分离液体混合物。',
    location: 'B栋205室',
    status: 'unavailable'
  },
  {
    id: 3,
    name: 'PCR仪',
    model: 'DEF-50',
    description: '用于DNA扩增，具有精确的温度控制系统。',
    location: 'C栋303室',
    status: 'available'
  },
  {
    id: 4,
    name: '液相色谱仪',
    model: 'GHI-300',
    description: '用于分离、鉴定和定量混合物中的化合物。',
    location: 'A栋105室',
    status: 'maintenance'
  }
])

// 根据状态码获取中文描述
const getStatusText = (status) => {
  switch (status) {
    case 'available':
      return '可预约'
    case 'unavailable':
      return '已预约'
    case 'maintenance':
      return '维护中'
    default:
      return '未知'
  }
}

// 查看设备详情
const viewDetails = (id) => {
  // 跳转到设备详情页，传递设备ID
  router.push(`/equipment/${id}`)
}

// 模拟从 API 获取数据 (如果连接后端)
// const fetchEquipmentList = async () => {
//   try {
//     // const response = await axios.get('/api/equipments')
//     // equipmentList.value = response.data
//   } catch (error) {
//     console.error('获取设备列表失败:', error)
//   }
// }

// 组件挂载时获取数据
onMounted(() => {
  // fetchEquipmentList()
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