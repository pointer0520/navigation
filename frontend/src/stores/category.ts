import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category } from '@/types'
import * as categoryApi from '@/api/category'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)

  // 从后端加载数据
  const loadFromServer = async () => {
    loading.value = true
    try {
      categories.value = await categoryApi.getAllCategories()
    } catch (error) {
      console.error('加载分类失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 添加分类
  const addCategory = async (category: Omit<Category, 'id' | 'userId'>) => {
    loading.value = true
    try {
      const newCategory = await categoryApi.createCategory(category)
      categories.value.push(newCategory)
      return newCategory
    } catch (error) {
      console.error('添加分类失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新分类
  const updateCategory = async (id: number, updates: Partial<Category>) => {
    loading.value = true
    try {
      const updatedCategory = await categoryApi.updateCategory(id, updates)
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = updatedCategory
      }
    } catch (error) {
      console.error('更新分类失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除分类
  const deleteCategory = async (id: number) => {
    loading.value = true
    try {
      await categoryApi.deleteCategory(id)
      categories.value = categories.value.filter(c => c.id !== id)
    } catch (error) {
      console.error('删除分类失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新排序
  const updateOrder = async (newOrder: Category[]) => {
    const updates = newOrder.map((cat, index) => ({
      ...cat,
      sortOrder: index + 1
    }))
    
    try {
      // 批量更新排序
      for (const cat of updates) {
        await categoryApi.updateCategory(cat.id, { sortOrder: cat.sortOrder })
      }
      categories.value = updates
    } catch (error) {
      console.error('更新排序失败:', error)
      throw error
    }
  }

  // 获取子分类
  const getChildCategories = async (parentId: number) => {
    try {
      return await categoryApi.getSubCategories(parentId)
    } catch (error) {
      console.error('获取子分类失败:', error)
      return []
    }
  }

  // 获取根分类计算属性
  const getRootCategories = computed(() => {
    return categories.value.filter(c => !c.parentId)
  })

  // 兼容旧的 loadFromStorage 方法
  const loadFromStorage = loadFromServer

  return {
    categories,
    loading,
    loadFromStorage,
    loadFromServer,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrder,
    getChildCategories,
    getRootCategories
  }
})
