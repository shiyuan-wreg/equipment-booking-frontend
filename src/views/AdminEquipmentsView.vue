<!-- src/views/AdminEquipmentsView.vue -->
<template>
  <div class="admin-equipments">
    <h2>设备管理</h2>

    <!-- 添加设备表单 -->
    <el-card style="max-width: 600px; margin-bottom: 20px;">
      <el-form :model="newEquipment" label-width="80px" @submit.prevent="handleAdd">
        <el-form-item label="设备名称" required>
          <el-input v-model="newEquipment.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="newEquipment.description"
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">添加设备</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 设备列表 -->
    <el-table :data="equipmentStore.equipments" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'available' ? 'success' : 'warning'">
            {{ row.status === 'available' ? '可用' : '已预订' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="openEditDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 编辑设备弹窗 -->
  <el-dialog v-model="editDialogVisible" title="编辑设备" width="500px" @close="resetEditForm">
    <el-form :model="editingEquipment" label-width="80px">
      <el-form-item label="名称" required>
        <el-input v-model="editingEquipment.name" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="editingEquipment.description" type="textarea" />
      </el-form-item>
      <el-form-item label="状态" required>
        <el-select v-model="editingEquipment.status" style="width: 100%">
          <el-option value="available" label="可用" />
          <el-option value="booked" label="已预订" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { useEquipmentStore } from '@/stores/equipment';
import { ref, reactive, onMounted } from 'vue';
const equipmentStore = useEquipmentStore();

// --- 添加设备 ---
const newEquipment = reactive({ name: '', description: '' });

const handleAdd = async () => {
  if (!newEquipment.name.trim()) {
    ElMessage.warning('请输入设备名称');
    return;
  }
  const result = await equipmentStore.addEquipment(newEquipment);
  if (result.success) {
    ElMessage.success('设备添加成功');
    newEquipment.name = '';
    newEquipment.description = '';
  } else {
    ElMessage.error(result.message);
  }
};

// --- 删除设备 ---
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除此设备吗？\n有预订记录的设备无法删除。', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const result = await equipmentStore.deleteEquipment(id);
    if (result.success) {
      ElMessage.success('删除成功');
    } else {
      ElMessage.error(result.message);
    }
  } catch (err) {
    // 用户取消
  }
};

// --- 编辑设备 ---
const editDialogVisible = ref(false);
const editingEquipment = reactive({
  id: null,
  name: '',
  description: '',
  status: 'available'
});

const openEditDialog = (row) => {
  editingEquipment.id = row.id;
  editingEquipment.name = row.name;
  editingEquipment.description = row.description || '';
  editingEquipment.status = row.status;
  editDialogVisible.value = true;
};

const saveEdit = async () => {
  if (!editingEquipment.name.trim()) {
    ElMessage.warning('设备名称不能为空');
    return;
  }

  const result = await equipmentStore.updateEquipment(editingEquipment.id, {
    name: editingEquipment.name,
    description: editingEquipment.description,
    status: editingEquipment.status
  });

  if (result.success) {
    ElMessage.success('设备更新成功');
    editDialogVisible.value = false;
    // 不需要手动刷新，updateEquipment 内部已调用 fetchEquipments()
  } else {
    ElMessage.error(result.message);
  }
};

const resetEditForm = () => {
  editingEquipment.id = null;
  editingEquipment.name = '';
  editingEquipment.description = '';
  editingEquipment.status = 'available';
};
onMounted(() => {
  equipmentStore.fetchEquipments();
});
</script>

<style scoped>
.admin-equipments {
  padding: 20px;
}
</style>