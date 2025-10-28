// 站点实体
export interface Site {
  id: number
  name: string
  url: string
  iconUrl?: string
  addedTime: string  // 后端返回 ISO 日期字符串
  visitCount: number
  categoryIds: string  // 后端使用逗号分隔的字符串
  tagIds: string       // 后端使用逗号分隔的字符串
  quickAccess: boolean
  userId: number
}

// 分类实体
export interface Category {
  id: number
  name: string
  icon: string
  color: string
  parentId?: number
  sortOrder: number
  userId: number
}

// 标签实体
export interface Tag {
  id: number
  name: string
  color: string
  createTime: string  // 后端返回 ISO 日期字符串
  userId: number
}

// 用户实体
export interface User {
  id: number
  username: string
  email: string
  registerTime: string
  lastLoginTime: string
}

// 搜索历史
export interface SearchHistory {
  keyword: string
  timestamp: number
}

// 搜索结果
export interface SearchResult {
  sites: Site[]
  total: number
}

// 备份数据
export interface BackupData {
  version: string
  timestamp: number
  sites: Site[]
  categories: Category[]
  tags: Tag[]
  settings: Record<string, any>
}
