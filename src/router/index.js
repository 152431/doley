import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/wallpapers',
    name: 'Wallpapers',
    component: () => import('@/views/wallpaper/index.vue')
  },
  {
    path: '/wallpaper/:id',
    name: 'WallpaperDetail',
    component: () => import('@/views/wallpaper/detail.vue')
  },
  {
    path: '/rank',
    name: 'Rank',
    component: () => import('@/views/rank/index.vue')
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('@/views/upload/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/login.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/register.vue'),
    meta: { guest: true }
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: () => import('@/views/user/profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/collections',
    name: 'UserCollections',
    component: () => import('@/views/user/collections.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/uploads',
    name: 'UserUploads',
    component: () => import('@/views/user/uploads.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && userStore.isLoggedIn) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
