import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Site } from '@/types'
import * as siteApi from '@/api/site'

export const useSiteStore = defineStore('site', () => {
  const sites = ref<Site[]>([])
  const loading = ref(false)

  // 从后端加载数据
  const loadFromServer = async () => {
    loading.value = true
    try {
      sites.value = await siteApi.getAllSites()
    } catch (error) {
      console.error('加载站点失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 添加站点
  const addSite = async (site: Omit<Site, 'id' | 'addedTime' | 'visitCount' | 'userId'>) => {
    loading.value = true
    try {
      const newSite = await siteApi.createSite(site)
      sites.value.push(newSite)
      return newSite
    } catch (error) {
      console.error('添加站点失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新站点
  const updateSite = async (id: number, updates: Partial<Site>) => {
    loading.value = true
    try {
      const updatedSite = await siteApi.updateSite(id, updates)
      const index = sites.value.findIndex(s => s.id === id)
      if (index !== -1) {
        sites.value[index] = updatedSite
      }
    } catch (error) {
      console.error('更新站点失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除站点
  const deleteSite = async (id: number) => {
    loading.value = true
    try {
      await siteApi.deleteSite(id)
      sites.value = sites.value.filter(s => s.id !== id)
    } catch (error) {
      console.error('删除站点失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 增加访问次数
  const incrementVisit = async (id: number) => {
    try {
      const updatedSite = await siteApi.incrementVisitCount(id)
      const index = sites.value.findIndex(s => s.id === id)
      if (index !== -1) {
        sites.value[index] = updatedSite
      }
    } catch (error) {
      console.error('更新访问次数失败:', error)
    }
  }

  // 按分类获取站点
  const getSitesByCategory = async (categoryId: number) => {
    loading.value = true
    try {
      return await siteApi.getSitesByCategory(categoryId)
    } catch (error) {
      console.error('获取分类站点失败:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  // 按标签获取站点
  const getSitesByTag = async (tagId: number) => {
    loading.value = true
    try {
      return await siteApi.getSitesByTag(tagId)
    } catch (error) {
      console.error('获取标签站点失败:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  // 获取快速访问站点
  const loadQuickAccessSites = async () => {
    loading.value = true
    try {
      return await siteApi.getQuickAccessSites()
    } catch (error) {
      console.error('获取快速访问站点失败:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  // 快速访问站点计算属性
  const quickAccessSites = computed(() => {
    return sites.value.filter(s => s.quickAccess)
  })

  // 搜索站点
  const searchSites = async (keyword: string) => {
    loading.value = true
    try {
      return await siteApi.searchSites(keyword)
    } catch (error) {
      console.error('搜索站点失败:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  // 兼容旧的 loadFromStorage 方法（移除本地存储逻辑）
  const loadFromStorage = loadFromServer

  return {
    sites,
    loading,
    loadFromStorage,
    loadFromServer,
    addSite,
    updateSite,
    deleteSite,
    incrementVisit,
    getSitesByCategory,
    getSitesByTag,
    quickAccessSites,
    loadQuickAccessSites,
    searchSites
  }
})
