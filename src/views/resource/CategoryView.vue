<template>
  <div class="category-container">
    <coming-soon
      title="资源分类管理"
      message="资源分类管理功能正在开发中，将支持自定义分类和层级管理。"
      icon="FolderOpened"
    />
  </div>
</template>

<script setup lang="ts">
import ComingSoon from '@/components/common/ComingSoon.vue'
</script>

<style scoped>
.category-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
