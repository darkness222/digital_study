<template>
  <div class="search-container">
    <coming-soon
      title="资源搜索"
      message="高级资源搜索功能正在开发中，将支持多条件搜索和全文检索。"
      icon="Search"
    />
  </div>
</template>

<script setup lang="ts">
import ComingSoon from '@/components/common/ComingSoon.vue'
</script>

<style scoped>
.search-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
