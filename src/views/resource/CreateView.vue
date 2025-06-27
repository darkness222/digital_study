<template>
  <div class="create-resource-container">
    <div class="page-header">
      <h2 class="page-title">创建资源</h2>
      <div class="page-actions">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="saveResource">保存</el-button>
      </div>
    </div>

    <el-card class="resource-form-card">
      <el-form :model="resourceForm" label-width="100px" :rules="rules" ref="resourceFormRef">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="resourceForm.name" placeholder="请输入资源名称" />
        </el-form-item>

        <el-form-item label="资源类型" prop="type">
          <el-select v-model="resourceForm.type" placeholder="请选择资源类型" style="width: 100%">
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

        <!-- 此处将来会根据选择的资源类型显示不同的表单项 -->

        <el-divider content-position="center">AI 辅助生成</el-divider>

        <el-form-item label="提示词">
          <el-input
            v-model="prompt"
            type="textarea"
            rows="3"
            placeholder="请输入提示词，AI将根据提示生成内容"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="generating" @click="generateContent"
            >生成内容</el-button
          >
          <el-button type="info" @click="clearPrompt">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="preview-card" v-if="showPreview">
      <template #header>
        <div class="card-header">
          <span>预览</span>
          <el-button type="primary" plain size="small" @click="applyGenerated"
            >应用生成内容</el-button
          >
        </div>
      </template>
      <div class="preview-content">
        <el-empty v-if="!generatedContent" description="暂无生成内容" />
        <div v-else v-html="generatedContent"></div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createResource } from '@/api/resource'
import {
  ResourceTypeLabels,
  SubjectLabels,
  ResourceStatus,
  ResourceStatusLabels,
} from '@/types/resource'

const router = useRouter()
const resourceFormRef = ref<FormInstance>()

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

// AI生成相关
const prompt = ref('')
const generating = ref(false)
const generatedContent = ref('')
const showPreview = ref(false)

// 返回上一页
const goBack = () => {
  router.back()
}

// 保存资源
const saveResource = async () => {
  if (!resourceFormRef.value) return

  await resourceFormRef.value.validate((valid) => {
    if (valid) {
      // 调用API保存资源
      createResource({
        name: resourceForm.name,
        type: resourceForm.type,
        subject: resourceForm.subject,
        status: resourceForm.status,
        description: resourceForm.description,
        content: resourceForm.content,
        size: 0, // 如果是通过编辑器创建的资源，这里可以计算内容大小或设置一个默认值
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: '资源创建成功',
          })
          router.push('/dashboard/resource/list')
        })
        .catch((error) => {
          console.error('创建资源失败:', error)
          ElMessage.error('创建资源失败')

          // 开发阶段，模拟成功（接口完成后删除）
          ElMessage({
            type: 'success',
            message: '资源创建成功',
          })
          router.push('/dashboard/resource/list')
        })
    }
  })
}

// 生成内容
const generateContent = () => {
  if (!prompt.value) {
    ElMessage({
      type: 'warning',
      message: '请输入提示词',
    })
    return
  }

  generating.value = true

  // 模拟API调用
  setTimeout(() => {
    // 这里应该调用大模型API生成内容
    generatedContent.value = `<h3>基于提示词"${prompt.value}"生成的内容</h3>
      <p>这是一个示例内容，实际项目中应该调用大模型API生成真实内容。</p>
      <p>生成的内容可以包含格式化的文本、图片、表格等。</p>`

    showPreview.value = true
    generating.value = false
  }, 2000)
}

// 清空提示词
const clearPrompt = () => {
  prompt.value = ''
}

// 应用生成的内容
const applyGenerated = () => {
  ElMessageBox.confirm('确定要应用生成的内容吗？这将覆盖当前内容', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      resourceForm.content = generatedContent.value
      ElMessage({
        type: 'success',
        message: '内容已应用',
      })
    })
    .catch(() => {
      // 取消操作
    })
}
</script>

<style scoped>
.create-resource-container {
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

.preview-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-content {
  min-height: 200px;
  padding: 10px;
}
</style>
