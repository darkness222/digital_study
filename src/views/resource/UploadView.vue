<template>
  <div class="upload-container">
    <div class="page-header">
      <h2 class="page-title">上传资源</h2>
      <div class="page-actions">
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>

    <el-card class="upload-card">
      <el-upload
        class="upload-area"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :file-list="fileList"
        multiple
      >
        <el-icon class="upload-icon"><Upload /></el-icon>
        <div class="upload-text"><em>点击上传</em> 或将文件拖拽到此处</div>
        <template #tip>
          <div class="upload-tip">支持上传各种类型的教学资源文件，单个文件不超过500MB</div>
        </template>
      </el-upload>
    </el-card>

    <el-card v-if="fileList.length > 0" class="file-list-card">
      <template #header>
        <div class="card-header">
          <span>待上传文件 ({{ fileList.length }})</span>
          <div class="header-actions">
            <el-button type="primary" size="small" @click="uploadFiles" :loading="uploading">
              开始上传
            </el-button>
            <el-button size="small" @click="clearFiles">清空</el-button>
          </div>
        </div>
      </template>

      <el-table :data="fileList" style="width: 100%">
        <el-table-column prop="name" label="文件名" min-width="200" />
        <el-table-column label="文件类型" width="120">
          <template #default="{ row }">
            {{ getFileType(row.name) }}
          </template>
        </el-table-column>
        <el-table-column label="文件大小" width="120">
          <template #default="{ row }">
            {{ formatFileSize(row.size) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'success'" type="success">上传成功</el-tag>
            <el-tag v-else-if="row.status === 'fail'" type="danger">上传失败</el-tag>
            <el-tag v-else type="info">待上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row, $index }">
            <el-button size="small" type="danger" @click="removeFile($index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const router = useRouter()
const fileList = ref<any[]>([])
const uploading = ref(false)

// 返回上一页
const goBack = () => {
  if (fileList.value.length > 0) {
    ElMessageBox.confirm('您有未上传的文件，确定要离开吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        router.back()
      })
      .catch(() => {
        // 取消离开
      })
  } else {
    router.back()
  }
}

// 处理文件变化
const handleFileChange = (file: any, files: any[]) => {
  fileList.value = files
}

// 上传文件
const uploadFiles = () => {
  if (fileList.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请先选择要上传的文件',
    })
    return
  }

  uploading.value = true

  // 模拟上传过程
  setTimeout(() => {
    // 这里应该调用API上传文件
    fileList.value.forEach((file) => {
      file.status = Math.random() > 0.2 ? 'success' : 'fail'
    })

    const successCount = fileList.value.filter((file) => file.status === 'success').length

    ElMessage({
      type: 'success',
      message: `上传完成，成功${successCount}个，失败${fileList.value.length - successCount}个`,
    })

    uploading.value = false
  }, 2000)
}

// 清空文件列表
const clearFiles = () => {
  if (fileList.value.length === 0) return

  ElMessageBox.confirm('确定要清空所有待上传文件吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      fileList.value = []
    })
    .catch(() => {
      // 取消清空
    })
}

// 移除文件
const removeFile = (index: number) => {
  fileList.value.splice(index, 1)
}

// 获取文件类型
const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  const typeMap: Record<string, string> = {
    doc: '文档',
    docx: '文档',
    pdf: '文档',
    txt: '文档',
    ppt: '课件',
    pptx: '课件',
    xls: '文档',
    xlsx: '文档',
    jpg: '图片',
    jpeg: '图片',
    png: '图片',
    gif: '图片',
    mp4: '视频',
    avi: '视频',
    mov: '视频',
    mp3: '音频',
    wav: '音频',
  }

  return typeMap[extension] || '其他'
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
</script>

<style scoped>
.upload-container {
  padding: 0;
  width: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.page-title {
  margin: 0;
  font-size: 22px;
  color: #303133;
}

.upload-card {
  margin-bottom: 20px;
  width: 100%;
  border-radius: 0;
}

.upload-area {
  width: 100%;
}

.upload-icon {
  font-size: 64px;
  color: #c0c4cc;
  margin-bottom: 10px;
}

.upload-text {
  color: #606266;
  font-size: 16px;
  margin-bottom: 10px;
}

.upload-text em {
  color: var(--primary-color);
  font-style: normal;
}

.upload-tip {
  color: #909399;
  font-size: 14px;
}

.file-list-card {
  margin-bottom: 20px;
  width: 100%;
  border-radius: 0;
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

:deep(.el-card__body) {
  padding: 20px;
  width: 100%;
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
}

:deep(.el-table) {
  width: 100% !important;
  min-width: 100% !important;
}

:deep(.el-table__inner-wrapper) {
  width: 100% !important;
}

:deep(.el-card) {
  border-radius: 0;
  margin: 0;
  border: none;
}
</style>
