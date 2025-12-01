<!-- src/App.vue -->
<template>
  <!-- 使用我们创建的布局组件包裹 RouterView -->
  <MainLayout>
    <RouterView />
  </MainLayout>
</template>

<script setup>
// 导入布局组件
import MainLayout from './layouts/MainLayout.vue'

</script>

<style>
/* App.vue 的全局样式可以放在这里，scoped 通常为空 */
/* 例如，可以重置一些浏览器默认样式 */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>