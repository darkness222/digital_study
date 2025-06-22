<template>
  <div class="template-container">
    <div class="page-header">
      <h2 class="page-title">模板库</h2>
      <div class="page-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索模板"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch"></el-button>
          </template>
        </el-input>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="template-tabs">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="文档" name="document"></el-tab-pane>
      <el-tab-pane label="课件" name="courseware"></el-tab-pane>
      <el-tab-pane label="习题" name="exercise"></el-tab-pane>
      <el-tab-pane label="视频" name="video"></el-tab-pane>
      <el-tab-pane label="音频" name="audio"></el-tab-pane>
    </el-tabs>

    <div class="template-grid">
      <el-row :gutter="24">
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          v-for="(template, index) in filteredTemplates"
          :key="index"
          class="template-col"
        >
          <el-card class="template-card" shadow="hover">
            <div class="template-header">
              <el-tag :type="getTypeTagType(template.type)" size="small">{{
                getTypeLabel(template.type)
              }}</el-tag>
              <span class="template-usage">使用次数: {{ template.usageCount }}</span>
            </div>
            <h3 class="template-title">{{ template.name }}</h3>
            <p class="template-desc">{{ template.description }}</p>
            <div class="template-footer">
              <el-button type="primary" size="small" @click="useTemplate(template)"
                >使用模板</el-button
              >
              <el-button plain size="small" @click="previewTemplate(template)">预览</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-pagination
      v-if="totalTemplates > 0"
      class="pagination"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[12, 24, 36, 48]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalTemplates"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-empty v-else description="暂无模板数据" />

    <!-- 模板预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      :title="currentTemplate.name"
      width="70%"
      destroy-on-close
    >
      <div class="template-preview-content">
        <div v-html="currentTemplate.content"></div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="useTemplate(currentTemplate)">使用模板</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

// 定义模板接口
interface Template {
  id: string
  name: string
  type: string
  description: string
  usageCount: number
  content: string
}

const router = useRouter()
const activeTab = ref('all')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const totalTemplates = ref(0)
const previewDialogVisible = ref(false)
const currentTemplate = ref<Template>({} as Template)

// 模板数据
const templates = ref<Template[]>([
  {
    id: '1',
    name: '教学课件模板',
    type: 'courseware',
    description: '适用于各学科的通用教学课件模板，包含封面、目录、内容页等',
    usageCount: 256,
    content: '<h3>教学课件模板</h3><p>这是一个教学课件模板的预览内容...</p>',
  },
  {
    id: '2',
    name: '单元测试试卷',
    type: 'exercise',
    description: '包含选择题、填空题、解答题等多种题型的单元测试试卷模板',
    usageCount: 189,
    content: '<h3>单元测试试卷</h3><p>这是一个单元测试试卷模板的预览内容...</p>',
  },
  {
    id: '3',
    name: '知识点总结文档',
    type: 'document',
    description: '用于总结教学重点、难点的知识点总结文档模板',
    usageCount: 312,
    content: '<h3>知识点总结文档</h3><p>这是一个知识点总结文档模板的预览内容...</p>',
  },
  {
    id: '4',
    name: '实验报告模板',
    type: 'document',
    description: '适用于物理、化学、生物等学科的实验报告模板',
    usageCount: 145,
    content: '<h3>实验报告模板</h3><p>这是一个实验报告模板的预览内容...</p>',
  },
  {
    id: '5',
    name: '教学视频模板',
    type: 'video',
    description: '包含片头、正文、片尾的教学视频模板',
    usageCount: 98,
    content: '<h3>教学视频模板</h3><p>这是一个教学视频模板的预览内容...</p>',
  },
  {
    id: '6',
    name: '听力练习模板',
    type: 'audio',
    description: '英语听力练习的标准模板，包含听力原文和习题',
    usageCount: 76,
    content: '<h3>听力练习模板</h3><p>这是一个听力练习模板的预览内容...</p>',
  },
])

// 根据当前tab和搜索关键词过滤模板
const filteredTemplates = computed(() => {
  let result = templates.value

  // 根据tab筛选
  if (activeTab.value !== 'all') {
    result = result.filter((item) => item.type === activeTab.value)
  }

  // 根据关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword),
    )
  }

  totalTemplates.value = result.length
  return result
})

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

// 搜索模板
const handleSearch = () => {
  currentPage.value = 1
  // 过滤逻辑已在计算属性中实现
}

// 使用模板
const useTemplate = (template: Template) => {
  previewDialogVisible.value = false

  ElMessage({
    type: 'success',
    message: `已选择模板: ${template.name}`,
  })

  // 跳转到创建资源页面，并传递模板ID
  router.push({
    path: '/resource/create',
    query: { templateId: template.id },
  })
}

// 预览模板
const previewTemplate = (template: Template) => {
  currentTemplate.value = template
  previewDialogVisible.value = true
}

// 页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 每页条数变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

onMounted(() => {
  // 这里可以加载模板数据
})
</script>

<style scoped>
.template-container {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  flex-wrap: wrap;
}

.page-title {
  margin: 0;
  font-size: 22px;
  color: #303133;
}

.search-input {
  width: 300px;
  max-width: 100%;
}

.template-tabs {
  margin-bottom: 20px;
  width: 100%;
}

.template-grid {
  width: 100%;
  margin-bottom: 20px;
}

.template-col {
  margin-bottom: 24px;
}

.template-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  border-radius: 8px;
  overflow: hidden;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.template-usage {
  font-size: 12px;
  color: #909399;
}

.template-title {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #303133;
}

.template-desc {
  flex: 1;
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #606266;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.template-footer {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.template-preview-content {
  padding: 20px;
  min-height: 300px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .template-container {
    padding: 10px;
  }

  .template-footer {
    flex-direction: column;
    gap: 10px;
  }

  .template-footer .el-button {
    width: 100%;
  }
}

/* 添加深度选择器，确保内部元素样式正确 */
:deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
}

:deep(.el-tabs__item) {
  flex-grow: 1;
  text-align: center;
}

:deep(.el-card__body) {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-row) {
  width: 100%;
}

:deep(.el-card) {
  height: 100%;
}
</style>
