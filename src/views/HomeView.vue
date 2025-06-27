<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowDown,
  Document,
  Picture,
  VideoPlay,
  Plus,
  Collection,
  User,
  Setting,
  Bell,
  Refresh,
  DataAnalysis,
  Histogram,
  TrendCharts,
  Calendar,
  Timer,
  Edit,
  StarFilled,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeTab = ref('dashboard')
const showWelcomeAnimation = ref(true)
const notificationCount = ref(3)
const isLoading = ref(false)

// 在组件挂载后执行动画
onMounted(() => {
  setTimeout(() => {
    showWelcomeAnimation.value = false
  }, 2000)
})

// 系统特点
const features = [
  {
    icon: 'Document',
    title: '文本资源生成',
    description: '利用大模型技术，快速生成教案、讲义、习题等文本资源',
  },
  {
    icon: 'Picture',
    title: '图像资源生成',
    description: '通过AI技术，生成教学插图、图表等图像资源',
  },
  {
    icon: 'VideoPlay',
    title: '音视频资源制作',
    description: '支持音频合成、视频生成等多模态教学资源制作',
  },
]

// 定义资源类型接口
interface Resource {
  id: number
  name: string
  type: string
  updateTime: string
}

// 最近使用的资源
const recentResources = ref<Resource[]>([
  {
    id: 1,
    name: '高中物理力学知识点总结',
    type: '文档',
    updateTime: '2025-06-20 15:30:22',
  },
  {
    id: 2,
    name: '初中数学函数图像教学课件',
    type: '课件',
    updateTime: '2025-06-19 10:15:36',
  },
  {
    id: 3,
    name: '英语语法练习题',
    type: '习题',
    updateTime: '2025-06-18 14:22:51',
  },
])

// 统计数据
const statistics = reactive({
  totalResources: 156,
  todayCreated: 12,
  monthlyUsage: 438,
  favoriteCount: 45,
})

// 日历事件
const calendarEvents = ref([
  { date: '2025-06-22', title: '教学资源评审会议' },
  { date: '2025-06-25', title: '新功能培训' },
  { date: '2025-06-28', title: '期末资源整理' },
])

// 收藏数据
const favorites = ref([
  { id: 1, name: '高效教学方法论', type: '文档', createTime: '2025-06-15 09:30:45' },
  { id: 2, name: '互动课堂素材集', type: '图像', createTime: '2025-06-10 14:22:18' },
  { id: 3, name: '学科知识图谱', type: '课件', createTime: '2025-06-05 11:15:36' },
])

// 查看资源
const viewResource = (resource: Resource) => {
  console.log('查看资源', resource)
  // 跳转到资源详情页
  router.push(`/dashboard/resource/view/${resource.id}`)
}

// 编辑资源
const editResource = (resource: Resource) => {
  console.log('编辑资源', resource)
  // 跳转到资源编辑页
  router.push(`/dashboard/resource/edit/${resource.id}`)
}

// 创建新资源
const createResource = () => {
  router.push('/dashboard/resource/create')
}

// 上传资源
const uploadResource = () => {
  router.push('/dashboard/resource/upload')
}

// 浏览模板
const browseTemplates = () => {
  router.push('/dashboard/resource/template')
}

// 搜索资源
const searchResource = () => {
  router.push('/dashboard/resource/search')
}

// 刷新数据
const refreshData = () => {
  isLoading.value = true
  setTimeout(() => {
    ElMessage.success('数据已刷新')
    isLoading.value = false
  }, 800)
}

// 查看通知
const viewNotifications = () => {
  ElMessage.info('查看通知中心')
  notificationCount.value = 0
}

// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab
}
</script>

<template>
  <div class="home-container" :class="{ 'welcome-animation': showWelcomeAnimation }">
    <!-- 顶部操作栏 -->
    <div class="action-bar">
      <div class="tab-navigation">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'dashboard' }"
          @click="switchTab('dashboard')"
        >
          <el-icon><DataAnalysis /></el-icon>
          <span>仪表盘</span>
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'resources' }"
          @click="switchTab('resources')"
        >
          <el-icon><Document /></el-icon>
          <span>资源管理</span>
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'statistics' }"
          @click="switchTab('statistics')"
        >
          <el-icon><TrendCharts /></el-icon>
          <span>数据统计</span>
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'calendar' }"
          @click="switchTab('calendar')"
        >
          <el-icon><Calendar /></el-icon>
          <span>日程安排</span>
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'favorites' }"
          @click="switchTab('favorites')"
        >
          <el-icon><StarFilled /></el-icon>
          <span>我的收藏</span>
        </div>
      </div>
      <div class="action-buttons">
        <el-button
          circle
          type="primary"
          @click="refreshData"
          class="action-icon-button"
          :disabled="isLoading"
        >
          <el-icon :class="{ 'is-loading': isLoading }"><Refresh /></el-icon>
        </el-button>
        <div class="notification-wrapper">
          <el-button circle @click="viewNotifications" class="action-icon-button">
            <el-icon><Bell /></el-icon>
          </el-button>
          <div v-if="notificationCount > 0" class="notification-dot"></div>
        </div>
      </div>
    </div>

    <div class="home-content">
      <div v-if="activeTab === 'dashboard'">
        <!-- 欢迎卡片 -->
        <el-card class="welcome-card">
          <div class="welcome-header">
            <h1>欢迎使用数字化教学资源制作系统</h1>
            <p>基于多模态大模型技术，提高教学资源制作效率和质量</p>
          </div>
          <el-divider />
          <div class="feature-section">
            <el-row :gutter="24">
              <el-col :xs="24" :sm="8" v-for="(feature, index) in features" :key="index">
                <div class="feature-item hover-card">
                  <el-icon :size="40" class="feature-icon">
                    <component :is="feature.icon"></component>
                  </el-icon>
                  <h3>{{ feature.title }}</h3>
                  <p>{{ feature.description }}</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <!-- 主要内容区域 -->
        <div class="main-section">
          <el-row :gutter="24">
            <!-- 左侧：最近使用的资源 -->
            <el-col :xs="24" :md="16">
              <el-card class="recent-resources hover-card">
                <template #header>
                  <div class="card-header">
                    <div class="card-title">
                      <el-icon><Document /></el-icon>
                      <span>最近使用的资源</span>
                    </div>
                    <el-button type="primary" plain size="small">查看全部</el-button>
                  </div>
                </template>
                <el-empty v-if="recentResources.length === 0" description="暂无最近使用的资源" />
                <el-table v-else :data="recentResources" style="width: 100%">
                  <el-table-column prop="name" label="资源名称" min-width="180" />
                  <el-table-column prop="type" label="类型" width="100" />
                  <el-table-column
                    prop="updateTime"
                    label="最后修改时间"
                    width="180"
                    header-align="center"
                  />
                  <el-table-column label="操作" width="180" fixed="right" header-align="center">
                    <template #default="scope">
                      <div class="table-actions">
                        <el-button size="small" @click="viewResource(scope.row)">
                          <el-icon><Document /></el-icon>查看
                        </el-button>
                        <el-button size="small" type="primary" @click="editResource(scope.row)">
                          <el-icon><Edit /></el-icon>编辑
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>

            <!-- 右侧：快捷操作和系统信息 -->
            <el-col :xs="24" :md="8">
              <el-card class="quick-actions hover-card">
                <template #header>
                  <div class="card-header">
                    <div class="card-title">
                      <el-icon><Setting /></el-icon>
                      <span>快捷操作</span>
                    </div>
                  </div>
                </template>
                <div class="action-list">
                  <div class="action-item">
                    <el-button
                      type="primary"
                      class="action-button pulse-animation"
                      @click="createResource"
                    >
                      <el-icon><Plus /></el-icon>
                      创建新资源
                    </el-button>
                  </div>
                  <div class="action-item">
                    <el-button type="success" class="action-button" @click="uploadResource">
                      <el-icon><Plus /></el-icon>
                      上传资源
                    </el-button>
                  </div>
                  <div class="action-item">
                    <el-button type="info" class="action-button" @click="browseTemplates">
                      <el-icon><Collection /></el-icon>
                      浏览模板
                    </el-button>
                  </div>
                  <div class="action-item">
                    <el-button type="warning" class="action-button" @click="searchResource">
                      <el-icon><Plus /></el-icon>
                      搜索资源
                    </el-button>
                  </div>
                </div>
              </el-card>

              <el-card class="system-info hover-card">
                <template #header>
                  <div class="card-header">
                    <div class="card-title">
                      <el-icon><User /></el-icon>
                      <span>系统信息</span>
                    </div>
                  </div>
                </template>
                <div class="info-list">
                  <div class="info-item">
                    <span class="info-label"
                      ><el-icon><User /></el-icon> 用户名</span
                    >
                    <span class="info-value">管理员</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label"
                      ><el-icon><Setting /></el-icon> 角色</span
                    >
                    <span class="info-value">系统管理员</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label"
                      ><el-icon><Timer /></el-icon> 登录时间</span
                    >
                    <span class="info-value">2025-06-21 16:30:45</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label"
                      ><el-icon><Document /></el-icon> 系统版本</span
                    >
                    <span class="info-value">v1.0.0</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 资源管理标签页 -->
      <div v-else-if="activeTab === 'resources'" class="tab-content">
        <el-card class="tab-card hover-card">
          <template #header>
            <div class="card-header">
              <div class="card-title">
                <el-icon><Document /></el-icon>
                <span>资源管理</span>
              </div>
            </div>
          </template>
          <div class="resource-categories">
            <div class="category-item hover-card">
              <el-icon><Document /></el-icon>
              <h3>文档资源</h3>
              <p>教案、讲义、学习资料</p>
              <el-button size="small" type="primary" class="mt-10">浏览</el-button>
            </div>
            <div class="category-item hover-card">
              <el-icon><Picture /></el-icon>
              <h3>图像资源</h3>
              <p>教学插图、图表、展示图</p>
              <el-button size="small" type="primary" class="mt-10">浏览</el-button>
            </div>
            <div class="category-item hover-card">
              <el-icon><VideoPlay /></el-icon>
              <h3>音视频资源</h3>
              <p>教学视频、音频讲解</p>
              <el-button size="small" type="primary" class="mt-10">浏览</el-button>
            </div>
            <div class="category-item hover-card">
              <el-icon><Collection /></el-icon>
              <h3>模板资源</h3>
              <p>各类教学资源模板</p>
              <el-button size="small" type="primary" class="mt-10">浏览</el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 数据统计标签页 -->
      <div v-else-if="activeTab === 'statistics'" class="tab-content">
        <el-card class="tab-card hover-card">
          <template #header>
            <div class="card-header">
              <div class="card-title">
                <el-icon><TrendCharts /></el-icon>
                <span>数据统计</span>
              </div>
            </div>
          </template>
          <div class="statistics-grid">
            <div class="stat-item hover-card">
              <div class="stat-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ statistics.totalResources }}</div>
                <div class="stat-label">总资源数</div>
              </div>
            </div>
            <div class="stat-item hover-card">
              <div class="stat-icon">
                <el-icon><Plus /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ statistics.todayCreated }}</div>
                <div class="stat-label">今日新增</div>
              </div>
            </div>
            <div class="stat-item hover-card">
              <div class="stat-icon">
                <el-icon><Histogram /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ statistics.monthlyUsage }}</div>
                <div class="stat-label">本月使用量</div>
              </div>
            </div>
            <div class="stat-item hover-card">
              <div class="stat-icon">
                <el-icon><Collection /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ statistics.favoriteCount }}</div>
                <div class="stat-label">收藏数量</div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 日程安排标签页 -->
      <div v-else-if="activeTab === 'calendar'" class="tab-content">
        <el-card class="tab-card hover-card">
          <template #header>
            <div class="card-header">
              <div class="card-title">
                <el-icon><Calendar /></el-icon>
                <span>日程安排</span>
              </div>
            </div>
          </template>
          <div class="calendar-events">
            <div
              v-for="(event, index) in calendarEvents"
              :key="index"
              class="event-item hover-card"
            >
              <div class="event-date">
                <el-icon><Calendar /></el-icon>
                {{ event.date }}
              </div>
              <div class="event-title">{{ event.title }}</div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 我的收藏标签页 -->
      <div v-else-if="activeTab === 'favorites'" class="tab-content">
        <el-card class="tab-card hover-card">
          <template #header>
            <div class="card-header">
              <div class="card-title">
                <el-icon><StarFilled /></el-icon>
                <span>我的收藏</span>
              </div>
            </div>
          </template>
          <div class="favorites-content">
            <div class="wave-container">
              <div class="wave"></div>
              <div class="wave wave2"></div>
              <div class="wave wave3"></div>
            </div>

            <el-table :data="favorites" style="width: 100%">
              <el-table-column prop="name" label="资源名称" min-width="180" />
              <el-table-column prop="type" label="类型" width="100" />
              <el-table-column
                prop="createTime"
                label="收藏时间"
                width="180"
                header-align="center"
              />
              <el-table-column label="操作" width="200" fixed="right" header-align="center">
                <template #default="scope">
                  <div class="table-actions">
                    <el-button size="small" @click="viewResource(scope.row)">
                      <el-icon><Document /></el-icon>查看
                    </el-button>
                    <el-button size="small" type="danger" plain>
                      <el-icon><StarFilled /></el-icon>取消收藏
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 上下滑动指示器 -->
    <div class="scroll-indicator">
      <el-icon class="scroll-icon"><ArrowDown /></el-icon>
    </div>
  </div>
</template>

<style scoped>
/* 添加CSS变量 */
:root {
  --primary-color: #3949ab;
  --primary-light: #5c6bc0;
  --primary-dark: #303f9f;
  --hover-bg: #f0f7ff;
}

.home-container {
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
  flex: 1;
  overflow-y: auto;
}

/* 欢迎动画 */
.welcome-animation {
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 顶部操作栏 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-bottom: 20px;
}

.tab-navigation {
  display: flex;
  gap: 10px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item:hover {
  background-color: #f0f2f5;
}

.tab-item.active {
  background-color: var(--primary-color);
  color: white;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-icon-button {
  transition: transform 0.3s ease;
}

.action-icon-button:hover {
  transform: scale(1.1);
}

.notification-wrapper {
  position: relative;
}

.notification-dot {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #f56c6c;
  box-shadow: 0 0 0 1px #fff;
}

.home-content {
  width: 100%;
  max-width: 100%;
  padding: 0 20px 20px;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 标签页内容 */
.tab-content {
  animation: fadeIn 0.5s ease-in-out;
}

.tab-card {
  margin-bottom: 20px;
}

/* 资源分类 */
.resource-categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
  transition: all 0.3s;
}

/* 统计数据 */
.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: all 0.3s;
}

.stat-icon {
  font-size: 36px;
  color: var(--primary-color);
  margin-right: 20px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

/* 日程安排 */
.calendar-events {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: all 0.3s;
}

.event-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
}

.event-title {
  font-weight: 500;
  color: #303133;
}

.welcome-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: visible;
}

.welcome-header {
  text-align: center;
  padding: 24px 0;
}

.welcome-header h1 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 16px;
  font-weight: 600;
}

.welcome-header p {
  font-size: 16px;
  color: #606266;
  max-width: 100%;
  margin: 0 auto;
}

.feature-section {
  padding: 24px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.feature-item {
  text-align: center;
  padding: 24px;
  transition: all 0.3s;
  border-radius: 8px;
  height: 100%;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hover-card {
  transition: all 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  color: var(--primary-color);
  margin-bottom: 16px;
}

.feature-item h3 {
  font-size: 18px;
  margin-bottom: 12px;
  font-weight: 600;
}

.feature-item p {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.main-section {
  margin-top: 0;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.recent-resources {
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  width: 100%;
  margin-bottom: 20px;
}

.quick-actions {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  width: 100%;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-item {
  width: 100%;
  display: flex;
}

.action-button {
  width: 100%;
  justify-content: flex-start;
  padding: 12px 20px;
  font-size: 15px;
  text-align: left;
  transition: all 0.3s;
}

.action-button:hover {
  transform: translateX(5px);
}

.pulse-animation {
  animation: pulse-button 2s infinite;
}

@keyframes pulse-button {
  0% {
    box-shadow: 0 0 0 0 rgba(57, 73, 171, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(57, 73, 171, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(57, 73, 171, 0);
  }
}

.system-info {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  width: 100%;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #606266;
  display: flex;
  align-items: center;
  gap: 5px;
}

.info-value {
  color: #303133;
  font-weight: 500;
}

/* 上下滑动指示器 */
.scroll-indicator {
  position: fixed;
  right: 20px;
  bottom: 70px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3949ab;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  box-shadow: 0 2px 12px 0 rgba(57, 73, 171, 0.3);
  cursor: pointer;
  animation: bounce 2s infinite;
  z-index: 100;
  transition: all 0.3s ease;
}

.scroll-indicator:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.2);
}

.scroll-icon {
  font-size: 20px;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 改进响应式布局 */
@media (max-width: 768px) {
  .home-content {
    padding: 0 10px 10px;
  }

  .welcome-header h1 {
    font-size: 22px;
  }

  .feature-section .el-row {
    margin: 0 !important;
  }

  .feature-item {
    margin-bottom: 16px;
    height: auto;
    padding: 15px;
  }

  .main-section .el-col {
    margin-bottom: 16px;
  }

  .scroll-indicator {
    right: 10px;
    bottom: 60px;
    width: 36px;
    height: 36px;
  }

  .tab-navigation {
    overflow-x: auto;
    padding-bottom: 5px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
  }

  .tab-navigation::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }

  .tab-item {
    white-space: nowrap;
    padding: 6px 12px;
    font-size: 13px;
  }

  .tab-item .el-icon {
    margin-right: 4px;
  }

  .statistics-grid,
  .resource-categories {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .action-bar {
    padding: 8px 10px;
    margin-bottom: 15px;
  }

  .action-buttons {
    gap: 5px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .card-header .el-button {
    align-self: flex-end;
  }

  .table-actions {
    flex-direction: column;
    gap: 5px;
  }

  .table-actions .el-button {
    width: 100%;
  }
}

/* 增加中等屏幕的响应式调整 */
@media (min-width: 769px) and (max-width: 1200px) {
  .statistics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .resource-categories {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 调整表格宽度 */
:deep(.el-table) {
  width: 100% !important;
  min-width: 100% !important;
  overflow-x: auto;
}

:deep(.el-table__inner-wrapper) {
  width: 100% !important;
}

:deep(.el-card__body) {
  padding: 20px;
  width: 100%;
}

:deep(.el-row) {
  width: 100%;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

:deep(.el-col) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

:deep(.el-card) {
  border-radius: 8px;
  margin: 0;
  border: none;
  width: 100%;
  overflow: visible;
  transition: all 0.3s ease;
}

/* 表格操作按钮对齐 */
.table-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

/* 波浪效果 */
.favorites-content {
  position: relative;
  overflow: visible;
  padding-top: 50px;
  z-index: 2;
}

.wave-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  overflow: hidden;
  z-index: 1;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg"><path d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18.17 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" opacity=".25" fill="%233949ab"/><path d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z" opacity=".5" fill="%233949ab"/><path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" fill="%233949ab"/></svg>')
    no-repeat;
  background-size: 1200px 120px;
  animation: wave 10s linear infinite;
}

.wave2 {
  animation: wave2 7s linear infinite;
  opacity: 0.5;
  animation-delay: 0.1s;
}

.wave3 {
  animation: wave3 5s linear infinite;
  opacity: 0.2;
  animation-delay: 0.2s;
}

@keyframes wave {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes wave2 {
  0% {
    transform: translateX(0) scaleY(1.2) rotate(1deg);
  }
  100% {
    transform: translateX(-50%) scaleY(1.2) rotate(1deg);
  }
}

@keyframes wave3 {
  0% {
    transform: translateX(0) scaleY(0.8) rotate(-1deg);
  }
  100% {
    transform: translateX(-50%) scaleY(0.8) rotate(-1deg);
  }
}

.mt-10 {
  margin-top: 10px;
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
