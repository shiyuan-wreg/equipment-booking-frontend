<!-- src/views/EquipmentDetailView.vue -->
<template>
  <div class="equipment-detail" v-if="equipment">
    <el-page-header @back="$router.go(-1)" title="返回">
      <template #content>
        <span>{{ equipment.name }}</span>
      </template>
    </el-page-header>

    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span>{{ equipment.name }}</span>
          <el-tag :type="getStatusTagType(equipment.status)">
            {{ getStatusText(equipment.status) }}
          </el-tag>
        </div>
      </template>
      
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ equipment.id }}</el-descriptions-item>
        <el-descriptions-item label="型号">{{ equipment.model }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ equipment.description }}</el-descriptions-item>
        <el-descriptions-item label="位置">{{ equipment.location }}</el-descriptions-item>
        <!-- 可以添加更多字段 -->
      </el-descriptions>
      
      <!-- 图片区域 (如果有的话) -->
      <!-- <div class="image-section" v-if="equipment.image">
        <img :src="equipment.image" :alt="equipment.name" class="equipment-image">
      </div> -->

      <div class="actions" style="margin-top: 20px; text-align: right;">
        <el-button
          v-if="equipment.status === 'available'"
          type="primary"
          @click="openBookingDialog"
        >
          预约此设备
        </el-button>
        <el-button v-else disabled>
          当前不可预约
        </el-button>
      </div>
    </el-card>

    <!-- 预约对话框 -->
    <el-dialog v-model="bookingDialogVisible" title="预约设备" width="500px" :before-close="handleClose">
      <el-form
        ref="bookingFormRef"
        :model="bookingForm"
        :rules="bookingRules"
        label-width="100px"
      >
        <el-form-item label="预约日期" prop="date">
          <el-date-picker
            v-model="bookingForm.date"
            type="date"
            placeholder="选择预约日期"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        
        <el-form-item label="预约时段" prop="timeSlot">
          <el-select v-model="bookingForm.timeSlot" placeholder="请选择时段">
            <el-option
              v-for="slot in timeSlots"
              :key="slot.value"
              :label="slot.label"
              :value="slot.value"
              :disabled="isTimeSlotBooked(slot.value)"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="备注" prop="note">
          <el-input
            v-model="bookingForm.note"
            type="textarea"
            placeholder="请输入预约备注 (可选)"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeBookingDialog">取消</el-button>
          <el-button type="primary" @click="submitBooking">确认预约</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

  <!-- 如果设备未找到 -->
  <div class="equipment-not-found" v-else>
    <el-result icon="error" title="设备未找到" sub-title="抱歉，您查找的设备不存在或已被删除。">
      <template #extra>
        <el-button type="primary" @click="$router.push('/equipments')">返回设备列表</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useEquipmentStore } from '@/stores/equipment'

const route = useRoute()
const router = useRouter()
const equipmentStore = useEquipmentStore()

// 获取设备 ID
const equipmentId = computed(() => parseInt(route.params.id))



// 当前设备数据
const equipment = computed(() => {
  return equipmentStore.equipments.find(eq => eq.id === equipmentId.value) || null
})

// 查找并设置当前设备
const findEquipment = () => {
  const found = allEquipments.find(eq => eq.id == equipmentId.value)
  if (found) {
    equipment.value = found
  } else {
    equipment.value = null // 设备未找到
  }
}

// --- 预约功能 ---

// 控制预约对话框显示
const bookingDialogVisible = ref(false)

// 表单引用
const bookingFormRef = ref()

// 预约表单数据
const bookingForm = reactive({
  date: '',
  timeSlot: '',
  note: ''
})

// 时间段选项
const timeSlots = [
  { value: 'morning', label: '上午 (9:00 - 12:00)' },
  { value: 'afternoon', label: '下午 (13:00 - 17:00)' },
  { value: 'evening', label: '晚上 (18:00 - 21:00)' }
]

// 模拟已预约的时间段 (实际项目应从 API 获取)
const bookedSlots = ref([]) // 例如: ['morning']

// 检查时间段是否已被预约
const isTimeSlotBooked = (slotValue) => {
  return bookedSlots.value.includes(slotValue)
}

// 禁用过去日期
const disabledDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // 设置时间为当天凌晨
  return date.getTime() < today.getTime()
}

// 表单验证规则
const bookingRules = {
  date: [{ required: true, message: '请选择预约日期', trigger: 'change' }],
  timeSlot: [{ required: true, message: '请选择预约时段', trigger: 'change' }]
}

// 打开预约对话框
const openBookingDialog = () => {
  if (!equipment.value || equipment.value.status !== 'available') {
    ElMessage.warning('设备当前不可预约')
    return
  }
  bookingDialogVisible.value = true
}

// 关闭预约对话框
const closeBookingDialog = () => {
  bookingDialogVisible.value = false
  // 重置表单
  if (bookingFormRef.value) {
    bookingFormRef.value.resetFields()
  }
}

// 处理对话框关闭前的回调
const handleClose = (done) => {
  ElMessageBox.confirm('确认要关闭预约窗口吗？')
    .then(() => {
      done()
      closeBookingDialog()
    })
    .catch(() => {
      // 取消关闭
    })
}

// 提交预约
const submitBooking = async () => {
  if (!bookingFormRef.value) return
  
  await bookingFormRef.value.validate(async (valid) => {
    if (valid) {
      // 模拟 API 调用
      console.log('Submitting booking:', {
        equipmentId: equipment.value.id,
        ...bookingForm
      })
      
      // 模拟异步请求
      try {
        // const response = await axios.post(`/api/bookings`, {
        //   equipmentId: equipment.value.id,
        //   ...bookingForm
        // })
        
        // 模拟成功
        ElMessage.success('预约成功！')
        closeBookingDialog()
        
        // 可以在这里更新设备状态或刷新列表
        
      } catch (error) {
        console.error('预约失败:', error)
        ElMessage.error('预约失败，请稍后再试')
      }
    } else {
      console.log('表单验证失败!')
      return false
    }
  })
}

// 辅助函数：获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'available': return '可预约'
    case 'unavailable': return '已预约'
    case 'maintenance': return '维护中'
    default: return '未知'
  }
}

// 辅助函数：获取 Tag 类型
const getStatusTagType = (status) => {
  switch (status) {
    case 'available': return 'success'
    case 'unavailable': return 'warning'
    case 'maintenance': return 'danger'
    default: return ''
  }
}

// 组件挂载时查找设备
onMounted(() => {
  if (equipmentStore.equipments.length === 0) {
    equipmentStore.fetchEquipments() // 如果还没加载，就加载
  }
})
</script>

<style scoped>
.detail-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* .image-section {
  margin-top: 20px;
  text-align: center;
}

.equipment-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
} */

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>