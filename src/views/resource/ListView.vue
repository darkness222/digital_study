<template>
  <div class="resource-list-container">
    <div class="page-header">
      <h2 class="page-title">资源列表</h2>
      <div class="page-actions">
        <el-button type="primary" icon="Plus" @click="createResource">创建资源</el-button>
        <el-button type="success" icon="Upload" @click="uploadResource">上传资源</el-button>
      </div>
    </div>

    <el-card class="search-card">
      <el-form :model="searchForm" label-width="80px" inline>
        <el-form-item label="资源名称">
          <el-input v-model="searchForm.name" placeholder="请输入资源名称" clearable />
        </el-form-item>
        <el-form-item label="资源类型">
          <el-select v-model="searchForm.type" placeholder="请选择资源类型" clearable>
            <el-option
              v-for="(label, value) in ResourceTypeLabels"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学科">
          <el-select v-model="searchForm.subject" placeholder="请选择学科" clearable>
            <el-option
              v-for="(label, value) in SubjectLabels"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="(label, value) in ResourceStatusLabels"
              :key="value"
              :label="label"
              :value="Number(value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="resource-table-card">
      <template #header>
        <div class="card-header">
          <span>资源列表</span>
          <div class="header-actions">
            <el-button type="primary" plain size="small" icon="Refresh" @click="refreshList"
              >刷新</el-button
            >
            <el-button
              type="danger"
              plain
              size="small"
              icon="Delete"
              :disabled="!selectedResources.length"
              @click="batchDelete"
              >批量删除</el-button
            >
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="resourceList"
        @selection-change="handleSelectionChange"
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="资源名称" min-width="200">
          <template #default="{ row }">
            <div class="resource-name">
              <el-icon :size="20" class="resource-icon">
                <Document v-if="row.type === 'document'" />
                <Picture v-else-if="row.type === 'courseware'" />
                <Notebook v-else-if="row.type === 'exercise'" />
                <VideoPlay v-else-if="row.type === 'video'" />
                <Headset v-else-if="row.type === 'audio'" />
                <Files v-else />
              </el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100" header-align="center" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="subject"
          label="学科"
          width="100"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            <span>{{ SubjectLabels[row.subject] || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="ResourceStatusTagTypes[row.status]">
              {{ ResourceStatusLabels[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" width="100" header-align="center" align="center">
          <template #default="{ row }">
            {{ formatFileSize(row.size) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column label="操作" width="200" fixed="right" header-align="center">
          <template #default="{ row }">
            <el-button size="small" @click="viewResource(row)">查看</el-button>
            <el-button size="small" type="primary" @click="editResource(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteResource(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Picture, Notebook, VideoPlay, Headset, Files } from '@element-plus/icons-vue'
import { getResourceList, type ResourceQuery, type Resource } from '@/api/resource'
import {
  ResourceTypeLabels,
  ResourceTypeTagTypes,
  ResourceStatusLabels,
  ResourceStatusTagTypes,
  SubjectLabels,
  ResourceStatus,
} from '@/types/resource'

const router = useRouter()
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedResources = ref<Resource[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
  subject: '',
  status: undefined as number | undefined,
  dateRange: [],
})

// 资源列表数据
const resourceList = ref<Resource[]>([])

// 获取资源类型标签类型
const getTypeTagType = (type: string) => {
  return ResourceTypeTagTypes[type as keyof typeof ResourceTypeTagTypes] || ''
}

// 获取资源类型标签文本
const getTypeLabel = (type: string) => {
  return ResourceTypeLabels[type as keyof typeof ResourceTypeLabels] || type
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

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchResourceList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.type = ''
  searchForm.subject = ''
  searchForm.status = undefined
  searchForm.dateRange = []
  handleSearch()
}

// 刷新列表
const refreshList = () => {
  fetchResourceList()
}

// 创建资源
const createResource = () => {
  router.push('/dashboard/resource/create')
}

// 上传资源
const uploadResource = () => {
  router.push('/dashboard/resource/upload')
}

// 查看资源
const viewResource = (resource: Resource) => {
  router.push(`/dashboard/resource/view/${resource.id}`)
}

// 编辑资源
const editResource = (resource: Resource) => {
  router.push(`/dashboard/resource/edit/${resource.id}`)
}

// 删除资源
const deleteResource = (resource: Resource) => {
  ElMessageBox.confirm(`确定要删除资源 "${resource.name}" 吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 这里应该调用删除API
      console.log('删除资源:', resource)
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      fetchResourceList()
    })
    .catch(() => {
      // 取消删除
    })
}

// 批量删除
const batchDelete = () => {
  if (selectedResources.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择要删除的资源',
    })
    return
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedResources.value.length} 个资源吗？`,
    '批量删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      // 这里应该调用批量删除API
      console.log('批量删除资源:', selectedResources.value)
      ElMessage({
        type: 'success',
        message: '批量删除成功',
      })
      fetchResourceList()
    })
    .catch(() => {
      // 取消删除
    })
}

// 表格选择变化
const handleSelectionChange = (selection: Resource[]) => {
  selectedResources.value = selection
}

// 页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchResourceList()
}

// 每页条数变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchResourceList()
}

// 获取资源列表
const fetchResourceList = () => {
  loading.value = true

  // 构建查询参数
  const query: ResourceQuery = {
    name: searchForm.name || undefined,
    type: searchForm.type || undefined,
    subject: searchForm.subject || undefined,
    status: searchForm.status,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  }

  // 处理日期范围
  if (searchForm.dateRange && searchForm.dateRange.length === 2) {
    query.startDate = searchForm.dateRange[0]
    query.endDate = searchForm.dateRange[1]
  }

  // 调用API获取数据
  getResourceList(query)
    .then((res) => {
      resourceList.value = res.list
      total.value = res.total
    })
    .catch((error) => {
      console.error('获取资源列表失败:', error)
      ElMessage.error('获取资源列表失败')

      // 模拟数据（开发阶段使用，实际接口完成后删除）
      resourceList.value = [
        {
          id: 1,
          name: '高中物理力学知识点总结',
          type: 'document',
          subject: 'physics',
          status: ResourceStatus.PUBLISHED,
          size: 1024 * 1024 * 2.5, // 2.5MB
          createTime: '2025-06-20 15:30:22',
          updateTime: '2025-06-20 15:30:22',
          description: '本资源包含高中物理力学部分的重要知识点总结',
          content: '',
        },
        {
          id: 2,
          name: '初中数学函数图像教学课件',
          type: 'courseware',
          subject: 'math',
          status: ResourceStatus.PUBLISHED,
          size: 1024 * 1024 * 5.8, // 5.8MB
          createTime: '2025-06-19 10:15:36',
          updateTime: '2025-06-19 14:22:10',
          description: '初中数学函数图像教学课件',
          content: '',
        },
        {
          id: 3,
          name: '英语语法练习题',
          type: 'exercise',
          subject: 'english',
          status: ResourceStatus.DRAFT,
          size: 1024 * 1024 * 1.2, // 1.2MB
          createTime: '2025-06-18 14:22:51',
          updateTime: '2025-06-18 14:22:51',
          description: '英语语法练习题',
          content: '',
        },
        {
          id: 4,
          name: '中国历史朝代演变视频',
          type: 'video',
          subject: 'history',
          status: ResourceStatus.PUBLISHED,
          size: 1024 * 1024 * 150, // 150MB
          createTime: '2025-06-17 09:45:12',
          updateTime: '2025-06-17 09:45:12',
          description: '中国历史朝代演变视频',
          content: '',
        },
        {
          id: 5,
          name: '英语听力训练音频',
          type: 'audio',
          subject: 'english',
          status: ResourceStatus.PUBLISHED,
          size: 1024 * 1024 * 35, // 35MB
          createTime: '2025-06-16 16:08:33',
          updateTime: '2025-06-16 16:08:33',
          description: '英语听力训练音频',
          content: '',
        },
      ]
      total.value = resourceList.value.length
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  fetchResourceList()
})
</script>

<style scoped>
.resource-list-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.page-actions {
  display: flex;
  gap: 10px;
}

.search-card {
  margin-bottom: 20px;
}

.resource-table-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.resource-name {
  display: flex;
  align-items: center;
}

.resource-icon {
  margin-right: 8px;
  color: #409eff;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 表格头部统一样式 */
:deep(.el-table__header-wrapper th),
:deep(.el-table__fixed-header-wrapper th) {
  background-color: #f0f2f5 !important;
  color: #303133;
}

/* 确保固定列的背景色也被覆盖 */
:deep(.el-table__fixed-right .el-table__fixed-header-wrapper th) {
  background-color: #f0f2f5 !important;
}

/* 修正右侧固定列的边角修复元素的背景色 */
:deep(.el-table__fixed-right-patch) {
  background-color: #f0f2f5 !important;
}
</style>
