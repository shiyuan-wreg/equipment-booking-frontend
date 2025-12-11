<!-- src/views/AdminEquipmentsView.vue -->
<template>
  <div class="admin-equipments">
    <h2>设备管理</h2>

    <!-- 添加设备表单 -->
    <el-form :model="newEquipment" @submit.prevent="handleAdd" label-width="80px">
      <el-form-item label="名称" required>
        <el-input v-model="newEquipment.name" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="newEquipment.description" type="textarea" placeholder="请输入设备描述" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">添加设备</el-button>
      </el-form-item>
    </el-form>

    <!-- 设备列表 -->
    <el-table :data="equipmentStore.equipments" v-loading="equipmentStore.loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'available' ? 'success' : 'warning'">
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useEquipmentStore } from '@/stores/equipment';

const equipmentStore = useEquipmentStore();

// 添加设备
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

// 删除设备
const handleDelete = async (id) => {
  if (await ElMessageBox.confirm('确定要删除此设备吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })) {
    const result = await equipmentStore.deleteEquipment(id);
    if (result.success) {
      ElMessage.success('删除成功');
    } else {
      ElMessage.error(result.message);
    }
  }
};

// 编辑设备（可选）
const handleEdit = async (row) => {
  ElMessage.info('编辑功能待实现');
  // 可扩展为弹窗编辑
};

// 初始化加载数据
equipmentStore.fetchEquipments();
</script>

<style scoped>
.admin-equipments {
  padding: 20px;
}
</style>