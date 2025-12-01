// src/stores/equipment.js (请确认内容与此类似)
import { defineStore } from 'pinia';

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipments: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchEquipments() {
      this.loading = true;
      this.error = null;
      try {
        // --- 关键：检查这个 URL 是否正确 ---
        const response = await fetch('http://localhost:3000/api/equipments'); 
        const data = await response.json();
        
        if (response.ok) {
          this.equipments = data.data; // 假设后端返回 { data: [...] }
          console.log('[STORE] 设备列表获取成功:', this.equipments);
        } else {
          throw new Error(data.message || '获取设备列表失败');
        }
      } catch (err) {
        console.error('[STORE] 获取设备列表时出错:', err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
});