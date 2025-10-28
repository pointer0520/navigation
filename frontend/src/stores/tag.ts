import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Tag } from '@/types'
import * as tagApi from '@/api/tag'

export const useTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>([])
  const loading = ref(false)

  // 从后端加载数据
  const loadFromServer = async () => {
    loading.value = true
    try {
      tags.value = await tagApi.getAllTags()
    } catch (error) {
      console.error('加载标签失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 添加标签
  const addTag = async (tag: Omit<Tag, 'id' | 'createTime' | 'userId'>) => {
    loading.value = true
    try {
      const newTag = await tagApi.createTag(tag)
      tags.value.push(newTag)
      return newTag
    } catch (error) {
      console.error('添加标签失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新标签
  const updateTag = async (id: number, updates: Partial<Tag>) => {
    loading.value = true
    try {
      const updatedTag = await tagApi.updateTag(id, updates)
      const index = tags.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tags.value[index] = updatedTag
      }
    } catch (error) {
      console.error('更新标签失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除标签
  const deleteTag = async (id: number) => {
    loading.value = true
    try {
      await tagApi.deleteTag(id)
      tags.value = tags.value.filter(t => t.id !== id)
    } catch (error) {
      console.error('删除标签失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 兼容旧的 loadFromStorage 方法
  const loadFromStorage = loadFromServer

  return {
    tags,
    loading,
    loadFromStorage,
    loadFromServer,
    addTag,
    updateTag,
    deleteTag
  }
})
