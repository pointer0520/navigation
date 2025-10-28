import request from './index'
import type { Category } from '@/types'

// 获取当前用户ID
const getCurrentUserId = (): number => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    return userData.userId
  }
  return 1 // 默认用户ID
}

// 获取所有分类
export const getAllCategories = () => {
  const userId = getCurrentUserId()
  return request.get<any, Category[]>(`/categories?userId=${userId}`)
}

// 根据ID获取分类
export const getCategoryById = (id: number) => {
  return request.get<any, Category>(`/categories/${id}`)
}

// 创建分类
export const createCategory = (data: Omit<Category, 'id' | 'userId'>) => {
  const userId = getCurrentUserId()
  return request.post<any, Category>('/categories', {
    ...data,
    userId
  })
}

// 更新分类
export const updateCategory = (id: number, data: Partial<Category>) => {
  return request.put<any, Category>(`/categories/${id}`, data)
}

// 删除分类
export const deleteCategory = (id: number) => {
  return request.delete<any, void>(`/categories/${id}`)
}

// 获取子分类
export const getSubCategories = (parentId: number) => {
  const userId = getCurrentUserId()
  return request.get<any, Category[]>(`/categories/sub/${parentId}?userId=${userId}`)
}
