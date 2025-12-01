<!-- src/views/MyBookingsView.vue -->
<template>
  <div class="my-bookings">
    <h1>我的预约</h1>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">
      <el-skeleton animated />
    </div>

    <!-- 预约列表 -->
    <div v-else-if="bookings.length > 0" class="bookings-list">
      <el-table :data="bookings" style="width: 100%" stripe>
        <el-table-column prop="id" label="预约ID" width="100" />
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
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="viewBookingDetails(scope.row)"
            >
              查看详情
            </el-button>
            <el-button
              v-if="canCancel(scope.row)"
              size="small"
              type="danger"
              @click="cancelBooking(scope.row)"
              style="margin-left: 10px;"
            >
              取消预约
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 (如果数据很多) -->
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

    <!-- 无预约记录 -->
    <div v-else class="no-bookings">
      <el-empty description="暂无预约记录" />
    </div>

    <!-- 预约详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="预约详情" width="500px">
      <el-descriptions v-if="selectedBooking" :column="1" border>
        <el-descriptions-item label="预约ID">{{ selectedBooking.id }}</el-descriptions-item>
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

    <!-- 取消预约确认对话框 -->
    <el-dialog v-model="cancelDialogVisible" title="确认取消预约" width="400px">
      <span>确定要取消对 "{{ cancelTargetBooking?.equipmentName }}" 的预约吗?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmCancelBooking">确认取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import axios from 'axios' // 如果连接后端 API

// --- 数据和状态 ---
const isLoading = ref(false)
const bookings = ref([]) // 存储预约记录

// 模拟用户ID (实际项目应从 userStore 获取)
const currentUserId = 1 // 假设当前用户ID为1

// --- 对话框状态 ---
const detailDialogVisible = ref(false)
const selectedBooking = ref(null)

const cancelDialogVisible = ref(false)
const cancelTargetBooking = ref(null)

// --- 模拟数据 ---
// 注意: 在实际项目中，这些数据应该通过 API 从后端获取
const mockBookingsData = [
  {
    id: 101,
    userId: 1,
    equipmentId: 1,
    equipmentName: '高性能显微镜',
    date: '2023-10-27',
    timeSlot: 'morning',
    timeSlotLabel: '上午 (9:00 - 12:00)',
    status: 'pending', // pending, approved, rejected, cancelled, completed
    note: '用于观察细胞分裂过程'
  },
  {
    id: 102,
    userId: 1,
    equipmentId: 3,
    equipmentName: 'PCR仪',
    date: '2023-10-30',
    timeSlot: 'afternoon',
    timeSlotLabel: '下午 (13:00 - 17:00)',
    status: 'approved',
    note: ''
  },
  {
    id: 103,
    userId: 1,
    equipmentId: 2,
    equipmentName: '离心机',
    date: '2023-11-05',
    timeSlot: 'evening',
    timeSlotLabel: '晚上 (18:00 - 21:00)',
    status: 'completed',
    note: '分离蛋白样本'
  },
  {
    id: 104,
    userId: 1,
    equipmentId: 4,
    equipmentName: '液相色谱仪',
    date: '2023-11-10',
    timeSlot: 'morning',
    timeSlotLabel: '上午 (9:00 - 12:00)',
    status: 'rejected',
    note: '实验紧急'
  }
]

// --- 方法 ---

// 获取用户预约列表
const fetchUserBookings = async () => {
  isLoading.value = true
  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    // 模拟从 API 获取数据 (过滤当前用户的预约)
    // const response = await axios.get(`/api/users/${currentUserId}/bookings`)
    // bookings.value = response.data

    // 使用模拟数据
    bookings.value = mockBookingsData.filter(b => b.userId === currentUserId)
    console.log('Fetched bookings:', bookings.value)
  } catch (error) {
    console.error('获取预约列表失败:', error)
    ElMessage.error('获取预约列表失败')
  } finally {
    isLoading.value = false
  }
}

// 查看预约详情
const viewBookingDetails = (booking) => {
  selectedBooking.value = booking
  detailDialogVisible.value = true
}

// 判断是否可以取消预约 (例如，只能取消待审核或未来日期的预约)
const canCancel = (booking) => {
  // 示例逻辑：只有状态为 pending 或 approved 且日期在未来才允许取消
  const today = new Date()
  const bookingDate = new Date(booking.date)
  return (
    (booking.status === 'pending' || booking.status === 'approved') &&
    bookingDate >= today
  )
}

// 发起取消预约请求
const cancelBooking = (booking) => {
  cancelTargetBooking.value = booking
  cancelDialogVisible.value = true
}

// 确认取消预约
const confirmCancelBooking = async () => {
  if (!cancelTargetBooking.value) return

  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟向 API 发送取消请求
    // await axios.put(`/api/bookings/${cancelTargetBooking.value.id}/cancel`)

    // 模拟成功：更新本地状态
    const index = bookings.value.findIndex(
      b => b.id === cancelTargetBooking.value.id
    )
    if (index !== -1) {
      bookings.value[index].status = 'cancelled'
    }
    if (selectedBooking.value && selectedBooking.value.id === cancelTargetBooking.value.id) {
      selectedBooking.value.status = 'cancelled'
    }

    ElMessage.success('预约已取消')
    cancelDialogVisible.value = false
    cancelTargetBooking.value = null
  } catch (error) {
    console.error('取消预约失败:', error)
    ElMessage.error('取消预约失败')
  }
}

// 辅助函数：获取状态文本
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

// 辅助函数：获取 Tag 类型
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

// 组件挂载时获取数据
onMounted(() => {
  fetchUserBookings()
})
</script>

<style scoped>
.my-bookings {
  padding: 20px;
}

.loading {
  padding: 20px;
  text-align: center;
}

.bookings-list {
  margin-top: 20px;
}

.no-bookings {
  margin-top: 50px;
  text-align: center;
}

.dialog-footer {
  text-align: right;
}
</style>