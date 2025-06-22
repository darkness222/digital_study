<template>
  <div class="user-container">
    <coming-soon
      title="个人中心"
      message="个人中心功能正在开发中，将支持个人信息管理、密码修改和操作记录查看。"
      icon="User"
    />
  </div>
</template>

<script setup lang="ts">
import ComingSoon from '@/components/common/ComingSoon.vue'
</script>

<style scoped>
.user-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
