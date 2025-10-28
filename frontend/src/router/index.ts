import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: () => import('@/views/CategoryDetail.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
 router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 公开页面，不需要登录
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  
  // 加载认证信息
  if (!authStore.user) {
    authStore.loadFromStorage()
  }
  
  // 需要登录但未登录
  if (authRequired && !authStore.isAuthenticated()) {
    next('/login')
  } 
  // 已登录访问登录页，跳转到首页
  else if (to.path === '/login' && authStore.isAuthenticated()) {
    next('/')
  } 
  else {
    next()
  }
})

export default router
