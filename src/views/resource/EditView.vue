<template>
  <div class="edit-resource-container">
    <div class="page-header">
      <h2 class="page-title">编辑资源</h2>
      <div class="page-actions">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="saveResource">保存</el-button>
      </div>
    </div>

    <el-card v-loading="loading" class="resource-form-card">
      <el-form :model="resourceForm" label-width="100px" :rules="rules" ref="resourceFormRef">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="resourceForm.name" placeholder="请输入资源名称" />
        </el-form-item>

        <el-form-item label="资源类型" prop="type">
          <el-select
            v-model="resourceForm.type"
            placeholder="请选择资源类型"
            style="width: 100%"
            disabled
          >
            <el-option
              v-for="(label, value) in ResourceTypeLabels"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="学科" prop="subject">
          <el-select v-model="resourceForm.subject" placeholder="请选择学科" style="width: 100%">
            <el-option
              v-for="(label, value) in SubjectLabels"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="resourceForm.status">
            <el-radio :label="ResourceStatus.DRAFT">{{
              ResourceStatusLabels[ResourceStatus.DRAFT]
            }}</el-radio>
            <el-radio :label="ResourceStatus.PUBLISHED">{{
              ResourceStatusLabels[ResourceStatus.PUBLISHED]
            }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="资源描述" prop="description">
          <el-input
            v-model="resourceForm.description"
            type="textarea"
            rows="4"
            placeholder="请输入资源描述"
          />
        </el-form-item>

        <!-- 根据资源类型显示不同的编辑区域 -->
        <template v-if="resourceForm.type === 'document'">
          <el-form-item label="文档内容" prop="content">
            <div class="editor-placeholder">
              <p>此处将集成富文本编辑器</p>
            </div>
          </el-form-item>
        </template>

        <template v-else-if="resourceForm.type === 'courseware'">
          <el-form-item label="课件内容" prop="content">
            <div class="editor-placeholder">
              <p>此处将集成课件编辑器</p>
            </div>
          </el-form-item>
        </template>

        <template v-else-if="resourceForm.type === 'exercise'">
          <el-form-item label="习题内容" prop="content">
            <div class="editor-placeholder">
              <p>此处将集成习题编辑器</p>
            </div>
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="内容" prop="content">
            <div class="editor-placeholder">
              <p>此处将根据资源类型集成对应的编辑器</p>
            </div>
          </el-form-item>
        </template>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getResourceDetail, updateResource } from '@/api/resource'
import {
  ResourceTypeLabels,
  SubjectLabels,
  ResourceStatus,
  ResourceStatusLabels,
} from '@/types/resource'

const router = useRouter()
const route = useRoute()
const resourceFormRef = ref<FormInstance>()
const loading = ref(false)

// 获取资源ID
const resourceId = route.params.id as string

// 表单数据
const resourceForm = reactive({
  name: '',
  type: '',
  subject: '',
  status: ResourceStatus.DRAFT,
  description: '',
  content: '',
})

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入资源名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  type: [{ required: true, message: '请选择资源类型', trigger: 'change' }],
  subject: [{ required: true, message: '请选择学科', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
})

// 获取资源详情
const fetchResourceDetail = () => {
  loading.value = true

  // 调用API获取资源详情
  getResourceDetail(resourceId)
    .then((data) => {
      // 更新表单数据
      Object.assign(resourceForm, data)
    })
    .catch((error) => {
      console.error('获取资源详情失败:', error)
      ElMessage.error('获取资源详情失败')

      // 模拟数据（开发阶段使用，接口完成后删除）
      resourceForm.name = '高中物理力学知识点总结'
      resourceForm.type = 'document'
      resourceForm.subject = 'physics'
      resourceForm.status = ResourceStatus.PUBLISHED
      resourceForm.description = '本资源包含高中物理力学部分的重要知识点总结，适合高中生复习使用。'
      resourceForm.content = '<p>这里是资源内容...</p>'
    })
    .finally(() => {
      loading.value = false
    })
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 保存资源
const saveResource = async () => {
  if (!resourceFormRef.value) return

  await resourceFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      // 调用API更新资源
      updateResource(resourceId, {
        name: resourceForm.name,
        subject: resourceForm.subject,
        status: resourceForm.status,
        description: resourceForm.description,
        content: resourceForm.content,
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: '资源更新成功',
          })
          router.push('/dashboard/resource/list')
        })
        .catch((error) => {
          console.error('更新资源失败:', error)
          ElMessage.error('更新资源失败')

          // 模拟成功（开发阶段使用，接口完成后删除）
          ElMessage({
            type: 'success',
            message: '资源更新成功',
          })
          router.push('/dashboard/resource/list')
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

onMounted(() => {
  fetchResourceDetail()
})
</script>

<style scoped>
.edit-resource-container {
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

.resource-form-card {
  margin-bottom: 20px;
}

.editor-placeholder {
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  color: #909399;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
