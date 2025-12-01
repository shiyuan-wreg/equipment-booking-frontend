<!-- src/views/AdminBookingsView.vue -->
<template>
  <div class="admin-bookings">
    <h1>预约审核</h1>

    <div class="filters">
      <el-select v-model="filterStatus" placeholder="筛选状态" clearable @change="applyFilters">
        <el-option label="全部" value="" />
        <el-option label="待审核" value="pending" />
        <el-option label="已批准" value="approved" />
        <el-option label="已拒绝" value="rejected" />
        <el-option label="已取消" value="cancelled" />
        <el-option label="已完成" value="completed" />
      </el-select>
      <!-- 可以添加更多筛选器，如按设备、用户等 -->
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">
      <el-skeleton animated />
    </div>

    <!-- 预约列表 -->
    <div v-else class="bookings-list">
      <el-table :data="filteredBookings" style="width: 100%" stripe>
        <el-table-column prop="id" label="预约ID" width="100" />
        <el-table-column prop="userName" label="申请人" width="120" />
        <el-table-column prop="equipmentName" label="设备名称" />
        <el-table-column prop="date" label="预约日期" width="120" />
        <el-table-column prop="timeSlotLabel" label="预约时段" width="180" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" type="primary" @click="viewBookingDetails(scope.row)">查看详情</el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              size="small"
              type="success"
              @click="approveBooking(scope.row)"
              style="margin-left: 5px;"
            >
              批准
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              size="small"
              type="warning"
              @click="rejectBooking(scope.row)"
              style="margin-left: 5px;"
            >
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="totalBookings"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div> -->
    </div>

    <!-- 预约详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="预约详情" width="500px">
      <el-descriptions v-if="selectedBooking" :column="1" border>
        <el-descriptions-item label="预约ID">{{ selectedBooking.id }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ selectedBooking.userName }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ selectedBooking.equipmentName }}</el-descriptions-item>
        <el-descriptions-item label="预约日期">{{ selectedBooking.date }}</el-descriptions-item>
        <el-descriptions-item label="预约时段">{{ selectedBooking.timeSlotLabel }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusTagType(selectedBooking.status)">
            {{ getStatusText(selectedBooking.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注">{{ selectedBooking.note || '-' }}</el-descriptions-item>
        <!-- 可以添加更多详情字段 -->
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import axios from 'axios' // 如果连接后端 API

const isLoading = ref(false)
const allBookings = ref([]) // 存储所有预约
const filterStatus = ref('') // 筛选状态

// 对话框相关
const detailDialogVisible = ref(false)
const selectedBooking = ref(null)

// --- 模拟数据 ---
const mockAllBookings = [
  { id: 101, userId: 2, userName: '张三', equipmentId: 1, equipmentName: '高性能显微镜', date: '2023-10-27', timeSlot: 'morning', timeSlotLabel: '上午 (9:00 - 12:00)', status: 'pending', note: '用于观察细胞分裂过程' },
  { id: 102, userId: 3, userName: '李四', equipmentId: 3, equipmentName: 'PCR仪', date: '2023-10-30', timeSlot: 'afternoon', timeSlotLabel: '下午 (13:00 - 17:00)', status: 'approved', note: '' },
  { id: 103, userId: 1, userName: '王五', equipmentId: 2, equipmentName: '离心机', date: '2023-11-05', timeSlot: 'evening', timeSlotLabel: '晚上 (18:00 - 21:00)', status: 'completed', note: '分离蛋白样本' },
  { id: 104, userId: 4, userName: '赵六', equipmentId: 4, equipmentName: '液相色谱仪', date: '2023-11-10', timeSlot: 'morning', timeSlotLabel: '上午 (9:00 - 12:00)', status: 'rejected', note: '实验紧急' },
  { id: 105, userId: 5, userName: '孙七', equipmentId: 1, equipmentName: '高性能显微镜', date: '2023-11-15', timeSlot: 'afternoon', timeSlotLabel: '下午 (13:00 - 17:00)', status: 'pending', note: '研究生课题' }
]

// --- Computed: 过滤后的预约列表 ---
const filteredBookings = computed(() => {
  if (!filterStatus.value) {
    return allBookings.value
  }
  return allBookings.value.filter(booking => booking.status === filterStatus.value)
})

// --- 方法 ---

// 获取所有预约列表
const fetchAllBookings = async () => {
  isLoading.value = true
  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    // 模拟从 API 获取数据
    // const response = await axios.get('/api/admin/bookings')
    // allBookings.value = response.data
    allBookings.value = [...mockAllBookings] // 使用模拟数据
  } catch (error) {
    console.error('获取预约列表失败:', error)
    ElMessage.error('获取预约列表失败')
  } finally {
    isLoading.value = false
  }
}

// 应用筛选器 (此处逻辑简单，因为是 computed)
const applyFilters = () => {
  // 因为使用了 computed 属性 filteredBookings，
  // 改变 filterStatus.value 会自动触发重新计算
  // 这里可以留空，或者做其他额外的筛选逻辑
}

// 查看预约详情
const viewBookingDetails = (booking) => {
  selectedBooking.value = booking
  detailDialogVisible.value = true
}

// 批准预约
const approveBooking = async (booking) => {
  try {
    // await axios.put(`/api/admin/bookings/${booking.id}/approve`)
    // 更新本地数据
    const index = allBookings.value.findIndex(b => b.id === booking.id)
    if (index !== -1) {
       allBookings.value[index].status = 'approved'
    }
    if (selectedBooking.value && selectedBooking.value.id === booking.id) {
       selectedBooking.value.status = 'approved'
    }
    ElMessage.success('预约已批准')
    // fetchAllBookings() // 如果是真实 API，重新获取列表更保险
  } catch (error) {
    console.error('批准预约失败:', error)
    ElMessage.error('批准预约失败')
  }
}

// 拒绝预约
const rejectBooking = async (booking) => {
  ElMessageBox.prompt('请输入拒绝理由', '拒绝预约', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /\S/, // 至少包含一个非空白字符
    inputErrorMessage: '理由不能为空'
  }).then(async ({ value }) => {
    try {
      // await axios.put(`/api/admin/bookings/${booking.id}/reject`, { reason: value })
      // 更新本地数据
      const index = allBookings.value.findIndex(b => b.id === booking.id)
      if (index !== -1) {
         allBookings.value[index].status = 'rejected'
         // 可以选择性地存储拒绝理由 allBookings.value[index].rejectReason = value
      }
      if (selectedBooking.value && selectedBooking.value.id === booking.id) {
         selectedBooking.value.status = 'rejected'
         // selectedBooking.value.rejectReason = value
      }
      ElMessage.success('预约已拒绝')
      // fetchAllBookings() // 如果是真实 API，重新获取列表更保险
    } catch (error) {
      console.error('拒绝预约失败:', error)
      ElMessage.error('拒绝预约失败')
    }
  }).catch(() => {
    // 用户取消输入
  })
}

// 辅助函数：获取状态文本和 Tag 类型 (可复用或提取到 utils)
const getStatusText = (status) => {
  switch (status) {
    case 'pending': return '待审核'
    case 'approved': return '已批准'
    case 'rejected': return '已拒绝'
    case 'cancelled': return '已取消'
    case 'completed': return '已完成'
    default: return '未知'
  }
}

const getStatusTagType = (status) => {
  switch (status) {
    case 'pending': return 'info'
    case 'approved': return 'success'
    case 'rejected': return 'danger'
    case 'cancelled': return 'warning'
    case 'completed': return '' // 默认灰色
    default: return ''
  }
}

// 组件挂载
onMounted(() => {
  fetchAllBookings()
})
</script>

<style scoped>
.admin-bookings {
  padding: 20px;
}

.filters {
  margin-bottom: 20px;
  text-align: left;
}

.loading {
  padding: 20px;
  text-align: center;
}

.dialog-footer {
  text-align: right;
}
</style>