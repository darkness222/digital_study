import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AppLayout from '../components/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: '登录', requiresAuth: false },
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/dashboard',
      component: AppLayout,
      redirect: '/dashboard/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: HomeView,
          meta: { title: '首页', requiresAuth: true },
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
          meta: { title: '关于', requiresAuth: true },
        },
        {
          path: 'resource',
          name: 'resource',
          redirect: '/dashboard/resource/list',
          meta: { title: '资源管理', requiresAuth: true },
          children: [
            {
              path: 'list',
              name: 'resourceList',
              component: () => import('../views/resource/ListView.vue'),
              meta: { title: '资源列表', requiresAuth: true },
            },
            {
              path: 'create',
              name: 'resourceCreate',
              component: () => import('../views/resource/CreateView.vue'),
              meta: { title: '创建资源', requiresAuth: true },
            },
            {
              path: 'edit/:id',
              name: 'resourceEdit',
              component: () => import('../views/resource/EditView.vue'),
              meta: { title: '编辑资源', requiresAuth: true },
            },
            {
              path: 'view/:id',
              name: 'resourceView',
              component: () => import('../views/resource/DetailView.vue'),
              meta: { title: '资源详情', requiresAuth: true },
            },
            {
              path: 'template',
              name: 'resourceTemplate',
              component: () => import('../views/resource/TemplateView.vue'),
              meta: { title: '模板库', requiresAuth: true },
            },
            {
              path: 'category',
              name: 'resourceCategory',
              component: () => import('../views/resource/CategoryView.vue'),
              meta: { title: '分类管理', requiresAuth: true },
            },
            {
              path: 'upload',
              name: 'resourceUpload',
              component: () => import('../views/resource/UploadView.vue'),
              meta: { title: '上传资源', requiresAuth: true },
            },
            {
              path: 'search',
              name: 'resourceSearch',
              component: () => import('../views/resource/SearchView.vue'),
              meta: { title: '搜索资源', requiresAuth: true },
            },
          ],
        },
        {
          path: 'editor',
          name: 'editor',
          component: () => import('../views/editor/EditorView.vue'),
          meta: { title: '编辑器', requiresAuth: true },
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('../views/user/UserView.vue'),
          meta: { title: '个人中心', requiresAuth: true },
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('../views/admin/AdminView.vue'),
          meta: { title: '系统管理', requiresAuth: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: '404', requiresAuth: false },
    },
  ],
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '数字化教学资源制作系统'}`

  // 判断该路由是否需要登录权限
  if (to.meta.requiresAuth) {
    // 获取token
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      // 未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath }, // 将要跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

export default router
