<!-- src/views/EquipmentManagement.vue -->
<template>
  <div class="equipment-management">
    <h2 class="title">设备管理</h2>

    <!-- 添加设备表单 -->
    <el-card class="add-form">
      <template #header>
        <span>添加新设备</span>
      </template>
      <el-form :model="newEquipment" label-width="80px" @submit.prevent="handleAdd">
        <el-form-item label="设备名称" required>
          <el-input v-model="newEquipment.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newEquipment.description" type="textarea" placeholder="请输入设备描述" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="adding">添加设备</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 设备列表 -->
    <el-card class="list-card" style="margin-top: 20px;">
      <template #header>
        <span>设备列表 (共 {{ equipmentStore.equipments.length }} 项)</span>
      </template>

      <el-table :data="equipmentStore.equipments" v-loading="equipmentStore.loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'available' ? 'success' : row.status === 'booked' ? 'warning' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑设备" @close="resetEditForm">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="设备名称" required>
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status" placeholder="选择状态">
            <el-option label="可用" value="available" />
            <el-option label="已预订" value="booked" />
            <el-option label="维修中" value="maintenance" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="updating" @click="confirmEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useEquipmentStore } from '@/stores/equipment';

const equipmentStore = useEquipmentStore();

// 添加设备
const newEquipment = reactive({ name: '', description: '' });
const adding = ref(false);

const handleAdd = async () => {
  if (!newEquipment.name.trim()) {
    ElMessage.warning('请输入设备名称');
    return;
  }
  adding.value = true;
  const result = await equipmentStore.addEquipment({ ...newEquipment });
  adding.value = false;
  if (result.success) {
    ElMessage.success('设备添加成功');
    newEquipment.name = '';
    newEquipment.description = '';
  } else {
    ElMessage.error(result.message);
  }
};

// 删除设备
const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除此设备吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const result = await equipmentStore.deleteEquipment(id);
    if (result.success) {
      ElMessage.success('设备删除成功');
    } else {
      ElMessage.error(result.message);
    }
  }).catch(() => {});
};

// 编辑设备
const editDialogVisible = ref(false);
const editForm = reactive({ id: null, name: '', description: '', status: 'available' });
const updating = ref(false);

const handleEdit = (row) => {
  editForm.id = row.id;
  editForm.name = row.name;
  editForm.description = row.description;
  editForm.status = row.status;
  editDialogVisible.value = true;
};

const resetEditForm = () => {
  editForm.id = null;
  editForm.name = '';
  editForm.description = '';
  editForm.status = 'available';
};

const confirmEdit = async () => {
  if (!editForm.name.trim()) {
    ElMessage.warning('请输入设备名称');
    return;
  }
  updating.value = true;
  const result = await equipmentStore.updateEquipment(editForm.id, {
    name: editForm.name,
    description: editForm.description,
    status: editForm.status
  });
  updating.value = false;
  if (result.success) {
    ElMessage.success('设备更新成功');
    editDialogVisible.value = false;
  } else {
    ElMessage.error(result.message);
  }
};

// 初始化加载
equipmentStore.fetchEquipments();
</script>

<style scoped>
.equipment-management {
  padding: 20px;
}
.title {
  margin-bottom: 20px;
}
.add-form {
  max-width: 600px;
}
</style>