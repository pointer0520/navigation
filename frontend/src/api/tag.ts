import request from './index'
import type { Tag } from '@/types'

// 获取当前用户ID
const getCurrentUserId = (): number => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    return userData.userId
  }
  return 1 // 默认用户ID
}

// 获取所有标签
export const getAllTags = () => {
  const userId = getCurrentUserId()
  return request.get<any, Tag[]>(`/tags?userId=${userId}`)
}

// 根据ID获取标签
export const getTagById = (id: number) => {
  return request.get<any, Tag>(`/tags/${id}`)
}

// 创建标签
export const createTag = (data: Omit<Tag, 'id' | 'createTime' | 'userId'>) => {
  const userId = getCurrentUserId()
  return request.post<any, Tag>('/tags', {
    ...data,
    userId
  })
}

// 更新标签
export const updateTag = (id: number, data: Partial<Tag>) => {
  return request.put<any, Tag>(`/tags/${id}`, data)
}

// 删除标签
export const deleteTag = (id: number) => {
  return request.delete<any, void>(`/tags/${id}`)
}
