import request from './index'
import type { Site } from '@/types'

// 获取当前用户ID
const getCurrentUserId = (): number => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    return userData.userId
  }
  return 1 // 默认用户ID
}

// 获取所有站点
export const getAllSites = () => {
  const userId = getCurrentUserId()
  return request.get<any, Site[]>(`/sites?userId=${userId}`)
}

// 根据ID获取站点
export const getSiteById = (id: number) => {
  return request.get<any, Site>(`/sites/${id}`)
}

// 创建站点
export const createSite = (data: Omit<Site, 'id' | 'addedTime' | 'visitCount' | 'userId'>) => {
  const userId = getCurrentUserId()
  return request.post<any, Site>('/sites', {
    ...data,
    userId
  })
}

// 更新站点
export const updateSite = (id: number, data: Partial<Site>) => {
  return request.put<any, Site>(`/sites/${id}`, data)
}

// 删除站点
export const deleteSite = (id: number) => {
  return request.delete<any, void>(`/sites/${id}`)
}

// 按分类获取站点
export const getSitesByCategory = (categoryId: number) => {
  const userId = getCurrentUserId()
  return request.get<any, Site[]>(`/sites/category/${categoryId}?userId=${userId}`)
}

// 按标签获取站点
export const getSitesByTag = (tagId: number) => {
  const userId = getCurrentUserId()
  return request.get<any, Site[]>(`/sites/tag/${tagId}?userId=${userId}`)
}

// 获取快速访问站点
export const getQuickAccessSites = () => {
  const userId = getCurrentUserId()
  return request.get<any, Site[]>(`/sites/quick-access?userId=${userId}`)
}

// 搜索站点
export const searchSites = (keyword: string) => {
  const userId = getCurrentUserId()
  return request.get<any, Site[]>(`/sites/search?keyword=${keyword}&userId=${userId}`)
}

// 增加访问次数
export const incrementVisitCount = (id: number) => {
  return request.post<any, Site>(`/sites/${id}/visit`)
}
