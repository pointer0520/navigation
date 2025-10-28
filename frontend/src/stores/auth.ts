import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as authApi from '@/api/auth'
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>('')
  const user = ref<AuthResponse | null>(null)
  const loading = ref(false)

  // 从 localStorage 加载认证信息
  const loadFromStorage = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  // 保存到 localStorage
  const saveToStorage = (authData: AuthResponse) => {
    token.value = authData.token
    user.value = authData
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(authData))
  }

  // 清除存储
  const clearStorage = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 用户注册
  const register = async (data: RegisterRequest) => {
    loading.value = true
    try {
      const response = await authApi.register(data)
      saveToStorage(response)
      return response
    } catch (error) {
      console.error('注册失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 用户登录
  const login = async (data: LoginRequest) => {
    loading.value = true
    try {
      const response = await authApi.login(data)
      saveToStorage(response)
      return response
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 用户登出
  const logout = () => {
    clearStorage()
  }

  // 检查是否已登录
  const isAuthenticated = () => {
    return !!token.value && !!user.value
  }

  return {
    token,
    user,
    loading,
    loadFromStorage,
    register,
    login,
    logout,
    isAuthenticated
  }
})
