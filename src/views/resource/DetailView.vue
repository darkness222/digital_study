<template>
  <div class="resource-detail-container">
    <div class="page-header">
      <h2 class="page-title">资源详情</h2>
      <div class="page-actions">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="editResource">编辑</el-button>
        <el-button type="success" @click="downloadResource">下载</el-button>
        <el-button type="danger" @click="deleteResource">删除</el-button>
      </div>
    </div>

    <el-card v-loading="loading" class="resource-info-card">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="资源名称">{{ resource.name }}</el-descriptions-item>
        <el-descriptions-item label="资源类型">
          <el-tag :type="getTypeTagType(resource.type)">{{ getTypeLabel(resource.type) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ resource.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ resource.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="文件大小">{{
          formatFileSize(resource.size)
        }}</el-descriptions-item>
        <el-descriptions-item label="创建者">{{ resource.creator }}</el-descriptions-item>
        <el-descriptions-item label="资源描述" :span="2">{{
          resource.description
        }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="resource-content-card">
      <template #header>
        <div class="card-header">
          <span>资源内容</span>
          <div class="header-actions">
            <el-button type="primary" plain size="small" icon="FullScreen" @click="toggleFullscreen"
              >全屏预览</el-button
            >
          </div>
        </div>
      </template>

      <!-- 根据资源类型显示不同的预览组件 -->
      <div class="resource-content">
        <template v-if="resource.type === 'document'">
          <div class="document-preview" v-html="resource.content"></div>
        </template>

        <template v-else-if="resource.type === 'courseware'">
          <div class="courseware-preview">
            <el-empty description="课件预览功能开发中..." />
          </div>
        </template>

        <template v-else-if="resource.type === 'exercise'">
          <div class="exercise-preview">
            <el-empty description="习题预览功能开发中..." />
          </div>
        </template>

        <template v-else-if="resource.type === 'video'">
          <div class="video-preview">
            <el-empty description="视频预览功能开发中..." />
          </div>
        </template>

        <template v-else-if="resource.type === 'audio'">
          <div class="audio-preview">
            <el-empty description="音频预览功能开发中..." />
          </div>
        </template>

        <template v-else>
          <el-empty description="暂不支持该类型资源的预览" />
        </template>
      </div>
    </el-card>

    <el-card class="resource-related-card">
      <template #header>
        <div class="card-header">
          <span>相关资源</span>
        </div>
      </template>

      <div class="related-resources">
        <el-empty v-if="relatedResources.length === 0" description="暂无相关资源" />
        <el-row v-else :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" v-for="(item, index) in relatedResources" :key="index">
            <el-card class="related-resource-item" shadow="hover" @click="viewResource(item.id)">
              <div class="related-resource-info">
                <el-icon :size="24" class="resource-icon">
                  <Document v-if="item.type === 'document'" />
                  <Picture v-else-if="item.type === 'courseware'" />
                  <Notebook v-else-if="item.type === 'exercise'" />
                  <VideoPlay v-else-if="item.type === 'video'" />
                  <Headset v-else-if="item.type === 'audio'" />
                </el-icon>
                <div class="related-resource-details">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.updateTime }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Picture, Notebook, VideoPlay, Headset } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

// 获取资源ID
const resourceId = route.params.id as string

// 资源数据
const resource = reactive({
  id: '',
  name: '',
  type: '',
  description: '',
  content: '',
  size: 0,
  createTime: '',
  updateTime: '',
  creator: '',
})

// 相关资源
const relatedResources = ref([
  {
    id: '2',
    name: '初中数学函数图像教学课件',
    type: 'courseware',
    updateTime: '2025-06-19 10:15:36',
  },
  {
    id: '3',
    name: '英语语法练习题',
    type: 'exercise',
    updateTime: '2025-06-18 14:22:51',
  },
])

// 获取资源类型标签类型
const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    document: '',
    courseware: 'success',
    exercise: 'warning',
    video: 'danger',
    audio: 'info',
  }
  return typeMap[type] || ''
}

// 获取资源类型标签文本
const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    document: '文档',
    courseware: '课件',
    exercise: '习题',
    video: '视频',
    audio: '音频',
  }
  return typeMap[type] || type
}

// 格式化文件大小
const formatFileSize = (size: number) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }
}

// 获取资源详情
const fetchResourceDetail = () => {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    // 这里应该调用API获取资源详情
    resource.id = resourceId
    resource.name = '高中物理力学知识点总结'
    resource.type = 'document'
    resource.description = '本资源包含高中物理力学部分的重要知识点总结，适合高中生复习使用。'
    resource.content = `
      <h3>牛顿运动定律</h3>
      <p>牛顿第一定律：任何物体都要保持匀速直线运动状态或静止状态，直到外力迫使它改变这种状态为止。</p>
      <p>牛顿第二定律：物体加速度的大小跟作用力成正比，跟物体的质量成反比，加速度的方向跟作用力的方向相同。</p>
      <p>牛顿第三定律：两个物体之间的作用力和反作用力总是大小相等，方向相反，作用在同一直线上。</p>
    `
    resource.size = 1024 * 1024 * 2.5 // 2.5MB
    resource.createTime = '2025-06-20 15:30:22'
    resource.updateTime = '2025-06-20 15:30:22'
    resource.creator = '张老师'

    loading.value = false
  }, 1000)
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 编辑资源
const editResource = () => {
  router.push(`/resource/edit/${resourceId}`)
}

// 下载资源
const downloadResource = () => {
  ElMessage({
    type: 'success',
    message: '资源下载中...',
  })
  // 这里应该调用API下载资源
}

// 删除资源
const deleteResource = () => {
  ElMessageBox.confirm(`确定要删除资源"${resource.name}"吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 这里应该调用API删除资源
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      router.push('/resource/list')
    })
    .catch(() => {
      // 取消删除
    })
}

// 查看相关资源
const viewResource = (id: string) => {
  router.push(`/resource/view/${id}`)
}

// 切换全屏预览
const toggleFullscreen = () => {
  ElMessage({
    type: 'info',
    message: '全屏预览功能开发中...',
  })
}

onMounted(() => {
  fetchResourceDetail()
})
</script>

<style scoped>
.resource-detail-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 22px;
  color: #303133;
}

.page-actions {
  display: flex;
  gap: 10px;
}

.resource-info-card,
.resource-content-card,
.resource-related-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.resource-content {
  min-height: 300px;
}

.document-preview {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.related-resource-item {
  cursor: pointer;
  margin-bottom: 10px;
}

.related-resource-info {
  display: flex;
  align-items: center;
}

.resource-icon {
  color: var(--primary-color);
  margin-right: 10px;
}

.related-resource-details h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #303133;
}

.related-resource-details p {
  margin: 0;
  font-size: 12px;
  color: #909399;
}
</style>
