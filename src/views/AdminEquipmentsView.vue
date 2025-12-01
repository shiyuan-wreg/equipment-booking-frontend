<!-- src/views/AdminEquipmentsView.vue -->
<template>
  <div class="admin-equipments">
    <h1>设备管理</h1>

    <div class="toolbar">
      <el-button type="primary" @click="openAddDialog">添加设备</el-button>
      <!-- 可以添加搜索框 -->
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">
      <el-skeleton animated />
    </div>

    <!-- 设备列表 -->
    <div v-else class="equipments-list">
      <el-table :data="equipments" style="width: 100%" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="model" label="型号" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-popconfirm
              title="确定要删除这个设备吗？此操作不可逆。"
              @confirm="deleteEquipment(scope.row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="totalEquipments"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div> -->
    </div>

    <!-- 添加/编辑设备对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" :before-close="handleDialogClose">
      <el-form
        ref="equipmentFormRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="form.model" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="可预约" value="available" />
            <el-option label="已预约" value="unavailable" />
            <el-option label="维护中" value="maintenance" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// import axios from 'axios' // 如果连接后端 API

const isLoading = ref(false)
const equipments = ref([])

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEditMode = ref(false)
const editingEquipmentId = ref(null)
const equipmentFormRef = ref()

// 表单数据
const form = reactive({
  name: '',
  model: '',
  description: '',
  location: '',
  status: 'available'
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  model: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
  status: [{ required: true, message: '请选择设备状态', trigger: 'change' }]
}

// --- 模拟数据 ---
const mockEquipments = [
  { id: 1, name: '高性能显微镜', model: 'XYZ-1000', description: '具备高分辨率成像能力...', location: 'A栋101室', status: 'available' },
  { id: 2, name: '离心机', model: 'ABC-200', description: '最大转速可达15000 rpm...', location: 'B栋205室', status: 'unavailable' },
  { id: 3, name: 'PCR仪', model: 'DEF-50', description: '用于DNA扩增...', location: 'C栋303室', status: 'available' },
  { id: 4, name: '液相色谱仪', model: 'GHI-300', description: '用于分离、鉴定和定量...', location: 'A栋105室', status: 'maintenance' }
]

// --- 方法 ---

// 获取设备列表
const fetchEquipments = async () => {
  isLoading.value = true
  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    // 模拟从 API 获取数据
    // const response = await axios.get('/api/admin/equipments')
    // equipments.value = response.data
    equipments.value = [...mockEquipments] // 使用模拟数据
  } catch (error) {
    console.error('获取设备列表失败:', error)
    ElMessage.error('获取设备列表失败')
  } finally {
    isLoading.value = false
  }
}

// 打开添加对话框
const openAddDialog = () => {
  dialogTitle.value = '添加设备'
  isEditMode.value = false
  editingEquipmentId.value = null
  resetForm()
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (equipment) => {
  dialogTitle.value = '编辑设备'
  isEditMode.value = true
  editingEquipmentId.value = equipment.id
  // 填充表单
  Object.assign(form, equipment)
  dialogVisible.value = true
}

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false
  resetForm()
}

// 处理对话框关闭
const handleDialogClose = (done) => {
  resetForm()
  done()
}

// 重置表单
const resetForm = () => {
  if (equipmentFormRef.value) {
    equipmentFormRef.value.resetFields()
  }
  Object.assign(form, {
    name: '',
    model: '',
    description: '',
    location: '',
    status: 'available'
  })
}

// 提交表单 (添加或编辑)
const submitForm = async () => {
  if (!equipmentFormRef.value) return
  await equipmentFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEditMode.value) {
          // 编辑设备
          // await axios.put(`/api/admin/equipments/${editingEquipmentId.value}`, form)
          // 更新本地数据
          const index = equipments.value.findIndex(e => e.id === editingEquipmentId.value)
          if (index !== -1) {
             equipments.value[index] = { ...form, id: editingEquipmentId.value }
          }
          ElMessage.success('设备更新成功')
        } else {
          // 添加设备
          // const response = await axios.post('/api/admin/equipments', form)
          // 添加到本地数据 (模拟新ID)
          const newId = Math.max(...equipments.value.map(e => e.id), 0) + 1
          equipments.value.push({ ...form, id: newId })
          ElMessage.success('设备添加成功')
        }
        closeDialog()
        // fetchEquipments() // 如果是真实 API，重新获取列表更保险
      } catch (error) {
        console.error(isEditMode.value ? '更新设备失败:' : '添加设备失败:', error)
        ElMessage.error(isEditMode.value ? '设备更新失败' : '设备添加失败')
      }
    } else {
      console.log('表单验证失败!')
      return false
    }
  })
}

// 删除设备
const deleteEquipment = async (id) => {
  try {
    // await axios.delete(`/api/admin/equipments/${id}`)
    // 更新本地数据
    equipments.value = equipments.value.filter(e => e.id !== id)
    ElMessage.success('设备删除成功')
    // fetchEquipments() // 如果是真实 API，重新获取列表更保险
  } catch (error) {
    console.error('删除设备失败:', error)
    ElMessage.error('设备删除失败')
  }
}

// 辅助函数：获取状态文本和 Tag 类型 (可复用或提取到 utils)
const getStatusText = (status) => {
  switch (status) {
    case 'available': return '可预约'
    case 'unavailable': return '已预约'
    case 'maintenance': return '维护中'
    default: return '未知'
  }
}

const getStatusTagType = (status) => {
  switch (status) {
    case 'available': return 'success'
    case 'unavailable': return 'warning'
    case 'maintenance': return 'danger'
    default: return ''
  }
}

// 组件挂载
onMounted(() => {
  fetchEquipments()
})
</script>

<style scoped>
.admin-equipments {
  padding: 20px;
}

.toolbar {
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