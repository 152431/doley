import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, getUserInfo, logout as apiLogout } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!token.value)
  
  const avatar = computed(() => userInfo.value?.avatar || '')
  
  const nickname = computed(() => userInfo.value?.nickname || '')

  async function login(username, password) {
    loading.value = true
    try {
      const res = await apiLogin(username, password)
      token.value = res.token
      userInfo.value = res.user || res.data?.user
      localStorage.setItem('token', res.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || '登录失败' }
    } finally {
      loading.value = false
    }
  }

  async function register(form) {
    loading.value = true
    try {
      const res = await apiRegister(form)
      return { success: true, data: res }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || '注册失败' }
    } finally {
      loading.value = false
    }
  }

  async function fetchUserInfo() {
    if (!token.value) return
    try {
      const res = await getUserInfo()
      userInfo.value = res.user || res
    } catch (err) {
      if (err.response?.status === 401) {
        logout()
      }
    }
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    loading,
    isLoggedIn,
    avatar,
    nickname,
    login,
    register,
    fetchUserInfo,
    logout
  }
})
