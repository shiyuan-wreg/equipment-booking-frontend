<!-- src/views/EquipmentManagement.vue -->
<template>
  <div>
    <h2>设备管理</h2>
    
    <!-- 添加设备表单 -->
    <el-form @submit.prevent="addEquipment">
      <el-input v-model="newEquipment.name" placeholder="设备名称" />
      <el-input v-model="newEquipment.description" placeholder="描述" />
      <el-button type="primary" native-type="submit">添加设备</el-button>
    </el-form>

    <!-- 设备列表（可编辑/删除） -->
    <el-table :data="equipmentStore.equipments">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="editEquipment(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteEquipment(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useEquipmentStore } from '@/stores/equipment';

const equipmentStore = useEquipmentStore();
const newEquipment = ref({ name: '', description: '' });

const addEquipment = async () => {
  if (!newEquipment.value.name.trim()) return;
  await equipmentStore.addEquipment(newEquipment.value);
  newEquipment.value = { name: '', description: '' };
};

const deleteEquipment = async (id) => {
  await equipmentStore.deleteEquipment(id);
};
</script>