<template>
  <div class="app-container">
    <el-container class="layout-container">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '240px'" class="sidebar">
        <div class="logo">
          <div class="logo-container">
            <img src="@/assets/logo.svg" alt="Logo" class="logo-img" />
          </div>
          <h1 class="logo-title" v-show="!isCollapse">
            <span class="title-text">数字化教学资源制作系统</span>
          </h1>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          :collapse="isCollapse"
          background-color="#ffffff"
          text-color="#333333"
          active-text-color="#3949ab"
          router
        >
          <el-sub-menu index="/dashboard/resource/create">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>资源制作</span>
            </template>
            <el-menu-item index="/dashboard/resource/create">创建资源</el-menu-item>
            <el-menu-item index="/dashboard/resource/template">模板库</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="/dashboard/resource/list">
            <template #title>
              <el-icon><FolderOpened /></el-icon>
              <span>资源管理</span>
            </template>
            <el-menu-item index="/dashboard/resource/list">资源列表</el-menu-item>
            <el-menu-item index="/dashboard/resource/category">分类管理</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/dashboard/editor">
            <el-icon><Edit /></el-icon>
            <span>编辑器</span>
          </el-menu-item>

          <el-menu-item index="/dashboard/user">
            <el-icon><User /></el-icon>
            <span>个人中心</span>
          </el-menu-item>

          <el-menu-item index="/dashboard/admin" v-if="isAdmin">
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container class="main-container">
        <!-- 头部 -->
        <el-header class="header">
          <div class="header-left">
            <!-- 添加侧边栏切换按钮 -->
            <el-tooltip :content="isCollapse ? '展开菜单' : '收起菜单'" placement="bottom">
              <div class="toggle-sidebar" @click="toggleSidebar">
                <el-icon><Fold v-if="!isCollapse" /><Expand v-else /></el-icon>
              </div>
            </el-tooltip>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/dashboard/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
                {{ item }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown trigger="click">
              <div class="user-info">
                <el-avatar
                  :size="30"
                  src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                />
                <span class="username">管理员</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goToUserCenter">个人中心</el-dropdown-item>
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 内容区 -->
        <el-main class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>

        <!-- 页脚 -->
        <el-footer class="footer" height="40px">
          <div class="footer-content">
            <span class="copyright">数字化教学资源制作系统 &copy; 2025</span>
            <div class="footer-links">
              <a href="#" class="footer-link">关于我们</a>
              <a href="#" class="footer-link">帮助中心</a>
              <a href="#" class="footer-link">联系我们</a>
            </div>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Document, FolderOpened, Edit, User, Setting, Fold, Expand } from '@element-plus/icons-vue'

// 侧边栏折叠状态
const isCollapse = ref(false)
// 面包屑导航
const breadcrumbs = ref(['资源管理', '资源列表'])
// 是否为管理员
const isAdmin = ref(true)

const router = useRouter()
const route = useRoute()

// 当前激活的菜单
const activeMenu = computed(() => {
  return router.currentRoute.value.path
})

// 根据路由更新面包屑
const updateBreadcrumbs = () => {
  const path = route.path
  breadcrumbs.value = []

  if (path === '/dashboard' || path === '/dashboard/home') {
    return
  }

  // 根据路径生成面包屑
  const pathSegments = path.split('/').filter((segment) => segment)

  // 特殊路径处理
  if (pathSegments.includes('resource')) {
    const resourceIndex = pathSegments.indexOf('resource')
    if (resourceIndex + 1 < pathSegments.length) {
      const resourceType = pathSegments[resourceIndex + 1]
      if (resourceType === 'create') {
        breadcrumbs.value = ['资源制作', '创建资源']
        return
      } else if (resourceType === 'template') {
        breadcrumbs.value = ['资源制作', '模板库']
        return
      }
    }
  }

  // 映射路径段到更友好的名称
  const nameMap: Record<string, string> = {
    dashboard: '仪表盘',
    resource: '资源管理',
    create: '创建资源',
    template: '模板库',
    list: '资源列表',
    category: '分类管理',
    editor: '编辑器',
    user: '个人中心',
    admin: '系统管理',
    view: '资源详情',
    edit: '编辑资源',
    search: '搜索资源',
    upload: '上传资源',
    favorites: '我的收藏',
    statistics: '数据统计',
    calendar: '日程安排',
    home: '首页',
  }

  // 构建面包屑
  pathSegments.forEach((segment) => {
    if (nameMap[segment]) {
      breadcrumbs.value.push(nameMap[segment])
    } else if (!isNaN(Number(segment))) {
      // 如果是数字ID，不添加到面包屑
    } else {
      breadcrumbs.value.push(segment)
    }
  })
}

// 监听路由变化，更新面包屑
watch(() => route.path, updateBreadcrumbs)

// 初始化时更新面包屑
onMounted(() => {
  updateBreadcrumbs()
})

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 跳转到个人中心
const goToUserCenter = () => {
  router.push('/dashboard/user')
}

// 退出登录
const logout = () => {
  // 清除token等登录信息
  localStorage.removeItem('token')
  // 跳转到登录页
  router.push('/login')
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.layout-container {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
}

.sidebar {
  background-color: #ffffff;
  transition: width 0.3s;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  height: 100%;
  flex-shrink: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: v-bind('isCollapse ? "64px" : "240px"');
  transition: margin-left 0.3s;
  width: calc(100% - v-bind('isCollapse ? "64px" : "240px"'));
  min-width: 0;
  padding: 0;
  position: relative;
  overflow: hidden; /* 确保不会出现双滚动条 */
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #ffffff;
  padding: 0 10px 0 16px;
  overflow: hidden;
  border-bottom: 1px solid #f0f0f0;
}

.logo-container {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  background: transparent;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;
}

.logo-container:hover {
  transform: rotate(5deg) scale(1.1);
}

.logo-img {
  width: 30px;
  height: 30px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: all 0.3s;
}

.logo-container:hover .logo-img {
  transform: scale(1.05);
}

.logo-shine {
  display: none;
}

.logo-title {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100% - 10px); /* 使用calc计算宽度 */
  max-width: 210px; /* 进一步增加最大宽度 */
  letter-spacing: 0.2px; /* 减小字母间距 */
  text-shadow: none;
  transition: all 0.3s;
  line-height: 1.2;
  display: flex;
  align-items: center;
  flex: 1; /* 允许标题区域占据剩余空间 */
}

.title-text {
  font-size: 15px;
  font-weight: 500;
  opacity: 1;
  position: relative;
  transition: all 0.3s;
  color: #333333;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block; /* 确保文本能够正确应用ellipsis */
}

.logo:hover .title-text {
  transform: translateY(-1px);
  text-shadow: none;
  color: #3949ab;
}

.sidebar-menu {
  border-right: none;
  width: 100%;
  height: calc(100% - 60px); /* 只减去顶部logo高度 */
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 999;
  width: 100%;
  box-sizing: border-box;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.toggle-sidebar {
  font-size: 20px;
  margin-right: 20px;
  cursor: pointer;
  color: #606266;
  transition: all 0.3s;
}

.toggle-sidebar:hover {
  color: #3949ab;
  transform: scale(1.1);
}

.header-right {
  display: flex;
  align-items: center;
  padding-right: 20px;
  margin-left: auto;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s;
  background-color: #f5f7fa;
  border: 1px solid #f0f0f0;
}

.user-info:hover {
  background-color: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(57, 73, 171, 0.1);
  border-color: #e6effd;
}

.username {
  margin-left: 10px;
  color: #333;
  font-weight: 500;
  position: relative;
}

.username::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #3949ab;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 0 5px rgba(57, 73, 171, 0.5);
}

.main-content {
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto; /* 允许内容区域垂直滚动 */
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  position: relative;
  height: calc(100vh - 110px); /* 减去头部和页脚的高度 */
}

/* 添加卡片容器样式 */
:deep(.el-card) {
  border-radius: 8px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  transition: all 0.3s;
}

:deep(.el-card:hover) {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 500;
  color: #333;
  font-size: 16px;
}

:deep(.el-card__body) {
  padding: 20px;
}

/* 美化按钮样式 */
:deep(.el-button--primary) {
  background-color: #3949ab;
  border-color: #3949ab;
}

:deep(.el-button--primary:hover),
:deep(.el-button--primary:focus) {
  background-color: #5c6bc0;
  border-color: #5c6bc0;
}

:deep(.el-button--primary.is-plain) {
  color: #3949ab;
  background-color: #f0f7ff;
  border-color: #c5cae9;
}

:deep(.el-button--primary.is-plain:hover),
:deep(.el-button--primary.is-plain:focus) {
  background-color: #3949ab;
  border-color: #3949ab;
}

/* 美化表格样式 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #333;
  font-weight: 500;
  padding: 12px 0;
}

:deep(.el-table__row:hover td) {
  background-color: #f0f7ff !important;
}

.footer {
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  height: 50px;
  padding: 0 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
  z-index: 10;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.copyright {
  font-weight: 500;
  color: #606266;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 0;
}

.copyright::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  background: linear-gradient(135deg, #3949ab, #5c6bc0);
  border-radius: 2px;
  margin-right: 10px;
  box-shadow: 0 0 5px rgba(57, 73, 171, 0.3);
}

.footer-links {
  display: flex;
  align-items: center;
}

.footer-link {
  color: #606266;
  text-decoration: none;
  margin-left: 20px;
  position: relative;
  transition: all 0.3s;
  font-size: 13px;
}

.footer-link:hover {
  color: #3949ab;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(to right, #3949ab, #5c6bc0);
  transition: width 0.3s;
}

.footer-link:hover::after {
  width: 100%;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sidebar {
    width: 64px !important;
  }

  .main-container {
    margin-left: 64px;
    width: calc(100% - 64px);
  }

  .logo-title {
    display: none;
  }

  .main-content {
    padding: 15px 10px;
  }
}

/* 美化面包屑 */
:deep(.el-breadcrumb__item) {
  display: flex;
  align-items: center;
}

:deep(.el-breadcrumb__inner) {
  color: #606266;
  font-weight: normal;
  transition: all 0.3s;
}

:deep(.el-breadcrumb__inner:hover) {
  color: #3949ab;
}

:deep(.el-breadcrumb__separator) {
  margin: 0 8px;
  color: #c0c4cc;
}

/* 美化菜单样式 */
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
  transition: all 0.3s;
  color: #333333;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: #f5f7fa !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #f0f7ff !important;
  border-right: 3px solid #3949ab;
  color: #3949ab;
}

:deep(.el-menu--collapse) .el-sub-menu__title span,
:deep(.el-menu--collapse) .el-menu-item span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-sub-menu__title) {
  padding-left: 20px !important;
}

:deep(.el-menu-item) {
  padding-left: 20px !important;
}

:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  color: #606266;
}

:deep(.el-menu-item.is-active .el-icon) {
  color: #3949ab;
}

:deep(.el-avatar) {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #fff;
}

/* 头部区域样式 */
.header-container {
  height: 60px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  position: relative;
  z-index: 10;
}

/* 切换侧边栏按钮样式 */
.toggle-sidebar {
  font-size: 20px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-sidebar:hover {
  color: #3949ab;
  transform: scale(1.1);
}

/* 美化面包屑样式 */
.breadcrumb-container {
  margin-left: 15px;
  display: inline-block;
}

:deep(.el-breadcrumb__inner) {
  color: #606266;
  font-weight: normal;
  transition: color 0.3s;
}

:deep(.el-breadcrumb__inner:hover) {
  color: #3949ab;
}

:deep(.el-breadcrumb__separator) {
  margin: 0 8px;
  color: #c0c4cc;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #303133;
  font-weight: 500;
}

/* 页脚样式 */
.app-footer {
  padding: 20px 0;
  text-align: center;
  color: #606266;
  font-size: 14px;
}

.footer-link {
  color: #606266;
  text-decoration: none;
  position: relative;
  transition: all 0.3s;
}

.footer-link:hover {
  color: #3949ab;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, #3949ab, #5c6bc0);
  transition: width 0.3s;
}

.footer-link:hover::after {
  width: 100%;
}

.copyright {
  margin-top: 10px;
  position: relative;
  padding-left: 20px;
}

.copyright::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 14px;
  background: linear-gradient(to bottom, #3949ab, #5c6bc0);
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(57, 73, 171, 0.5);
}

:deep(.el-dropdown-menu) {
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  padding: 6px 0;
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 16px;
  font-size: 14px;
  color: #333;
  transition: all 0.3s;
  line-height: 1.5;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #f0f7ff;
  color: #3949ab;
}

:deep(.el-dropdown-menu__item:focus) {
  background-color: #f0f7ff;
  color: #3949ab;
}
</style>
