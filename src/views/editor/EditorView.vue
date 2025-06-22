<template>
  <div class="editor-container">
    <coming-soon
      title="多模态编辑器"
      message="多模态编辑器功能正在开发中，将支持文本、图片、音频、视频等多种媒体类型的编辑。"
      icon="Edit"
    />
  </div>
</template>

<script setup lang="ts">
import ComingSoon from '@/components/common/ComingSoon.vue'
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
