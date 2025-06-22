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
            <el-option label="文档" value="document" />
            <el-option label="课件" value="courseware" />
            <el-option label="习题" value="exercise" />
            <el-option label="视频" value="video" />
            <el-option label="音频" value="audio" />
          </el-select>
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
})

// 获取资源详情
const fetchResourceDetail = () => {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    // 这里应该调用API获取资源详情
    resourceForm.name = '高中物理力学知识点总结'
    resourceForm.type = 'document'
    resourceForm.description = '本资源包含高中物理力学部分的重要知识点总结，适合高中生复习使用。'
    resourceForm.content = '<p>这里是资源内容...</p>'

    loading.value = false
  }, 1000)
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

      // 模拟API调用
      setTimeout(() => {
        // 这里应该调用API保存资源
        ElMessage({
          type: 'success',
          message: '资源更新成功',
        })
        router.push('/resource/list')

        loading.value = false
      }, 1000)
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
