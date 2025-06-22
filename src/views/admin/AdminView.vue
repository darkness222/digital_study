<template>
  <div class="admin-container">
    <coming-soon
      title="系统管理"
      message="系统管理功能正在开发中，将支持用户管理、权限设置和系统配置。"
      icon="Setting"
    />
  </div>
</template>

<script setup lang="ts">
import ComingSoon from '@/components/common/ComingSoon.vue'
</script>

<style scoped>
.admin-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
