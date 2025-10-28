/**
 * 数据格式转换工具
 * 用于前后端数据格式转换
 */

// 将逗号分隔的字符串转换为数字数组
export const stringToNumberArray = (str: string | undefined | null): number[] => {
  if (!str) return []
  return str.split(',').filter(Boolean).map(Number)
}

// 将数字数组转换为逗号分隔的字符串
export const numberArrayToString = (arr: number[]): string => {
  return arr.join(',')
}

// 将 ISO 日期字符串转换为时间戳
export const isoToTimestamp = (isoString: string): number => {
  return new Date(isoString).getTime()
}

// 将时间戳转换为 ISO 日期字符串
export const timestampToIso = (timestamp: number): string => {
  return new Date(timestamp).toISOString()
}

// 格式化日期显示
export const formatDate = (dateString: string, format: 'date' | 'datetime' | 'time' = 'datetime'): string => {
  const date = new Date(dateString)
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  switch (format) {
    case 'date':
      return `${year}-${month}-${day}`
    case 'time':
      return `${hours}:${minutes}:${seconds}`
    case 'datetime':
    default:
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
}

// 相对时间显示（例如：刚刚、1小时前、2天前）
export const relativeTime = (dateString: string): string => {
  const now = Date.now()
  const date = new Date(dateString).getTime()
  const diff = now - date
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  if (months < 12) return `${months}个月前`
  return `${years}年前`
}

// 验证 URL 格式
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 获取网站图标 URL
export const getFaviconUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return `${urlObj.protocol}//${urlObj.host}/favicon.ico`
  } catch {
    return ''
  }
}

// 从 URL 提取域名
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return url
  }
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0
  
  return function(...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func(...args)
    }
  }
}
