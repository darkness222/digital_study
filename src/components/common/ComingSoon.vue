<template>
  <div class="coming-soon-container">
    <el-card class="coming-soon-card">
      <div class="coming-soon-content">
        <el-icon :size="64" class="coming-soon-icon">
          <component :is="icon"></component>
        </el-icon>
        <h2 class="coming-soon-title">{{ title }}</h2>
        <p class="coming-soon-message">{{ message || '该功能正在开发中，敬请期待...' }}</p>
        <el-button type="primary" @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Tools } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: '功能开发中',
  },
  message: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'Tools',
  },
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.coming-soon-container {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  width: 100%;
}

.coming-soon-card {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.coming-soon-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
}

.coming-soon-icon {
  color: var(--primary-color);
  margin-bottom: 20px;
}

.coming-soon-title {
  font-size: 24px;
  color: #303133;
  margin: 0 0 10px 0;
}

.coming-soon-message {
  font-size: 16px;
  color: #606266;
  margin: 0 0 30px 0;
  max-width: 500px;
}
</style>
