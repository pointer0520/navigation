# 前后端对接文档

## API 基础配置

### 后端服务地址
- **开发环境**: `http://localhost:8080/api`
- **生产环境**: 需要配置

### 认证方式
- JWT Token
- 请求头: `Authorization: Bearer {token}`

---

## 数据类型变更说明

### 原本地存储 → 后端 API

| 字段 | 原类型 | 新类型 | 说明 |
|------|--------|--------|------|
| id | `string` | `number` | 使用数据库自增 Long ID |
| addTime | `number` (时间戳) | `string` (ISO日期) | 后端返回 ISO 格式日期字符串 |
| createTime | `number` (时间戳) | `string` (ISO日期) | 后端返回 ISO 格式日期字符串 |
| categoryIds | `string[]` | `string` | 逗号分隔的ID字符串，如 "1,2,3" |
| tagIds | `string[]` | `string` | 逗号分隔的ID字符串，如 "1,2,3" |
| isQuickAccess | `boolean` | `quickAccess` | 字段名改为 quickAccess |

---

## API 接口列表

### 认证接口

#### 用户注册
```typescript
POST /auth/register
Request: {
  username: string
  password: string
  email: string
}
Response: {
  token: string
  userId: number
  username: string
  email: string
}
```

#### 用户登录
```typescript
POST /auth/login
Request: {
  username: string
  password: string
}
Response: {
  token: string
  userId: number
  username: string
  email: string
}
```

---

### 站点接口

#### 获取所有站点
```typescript
GET /sites?userId={userId}
Response: Site[]
```

#### 获取单个站点
```typescript
GET /sites/{id}
Response: Site
```

#### 创建站点
```typescript
POST /sites
Request: {
  name: string
  url: string
  iconUrl?: string
  categoryIds: string  // "1,2,3"
  tagIds: string       // "1,2"
  quickAccess: boolean
  userId: number
}
Response: Site
```

#### 更新站点
```typescript
PUT /sites/{id}
Request: Partial<Site>
Response: Site
```

#### 删除站点
```typescript
DELETE /sites/{id}
Response: void
```

#### 按分类获取站点
```typescript
GET /sites/category/{categoryId}?userId={userId}
Response: Site[]
```

#### 按标签获取站点
```typescript
GET /sites/tag/{tagId}?userId={userId}
Response: Site[]
```

#### 获取快速访问站点
```typescript
GET /sites/quick-access?userId={userId}
Response: Site[]
```

#### 搜索站点
```typescript
GET /sites/search?keyword={keyword}&userId={userId}
Response: Site[]
```

#### 增加访问次数
```typescript
POST /sites/{id}/visit
Response: Site
```

---

### 分类接口

#### 获取所有分类
```typescript
GET /categories?userId={userId}
Response: Category[]
```

#### 获取单个分类
```typescript
GET /categories/{id}
Response: Category
```

#### 创建分类
```typescript
POST /categories
Request: {
  name: string
  icon: string
  color: string
  parentId?: number
  sortOrder: number
  userId: number
}
Response: Category
```

#### 更新分类
```typescript
PUT /categories/{id}
Request: Partial<Category>
Response: Category
```

#### 删除分类
```typescript
DELETE /categories/{id}
Response: void
```

#### 获取子分类
```typescript
GET /categories/sub/{parentId}?userId={userId}
Response: Category[]
```

---

### 标签接口

#### 获取所有标签
```typescript
GET /tags?userId={userId}
Response: Tag[]
```

#### 获取单个标签
```typescript
GET /tags/{id}
Response: Tag
```

#### 创建标签
```typescript
POST /tags
Request: {
  name: string
  color: string
  userId: number
}
Response: Tag
```

#### 更新标签
```typescript
PUT /tags/{id}
Request: Partial<Tag>
Response: Tag
```

#### 删除标签
```typescript
DELETE /tags/{id}
Response: void
```

---

## Store 使用说明

### SiteStore
```typescript
import { useSiteStore } from '@/stores/site'

const siteStore = useSiteStore()

// 加载数据（从后端）
await siteStore.loadFromServer()

// 添加站点
await siteStore.addSite({
  name: 'GitHub',
  url: 'https://github.com',
  iconUrl: 'https://github.com/favicon.ico',
  categoryIds: '1,2',
  tagIds: '1',
  quickAccess: true
})

// 更新站点
await siteStore.updateSite(1, { name: 'New Name' })

// 删除站点
await siteStore.deleteSite(1)

// 搜索站点
const results = await siteStore.searchSites('keyword')
```

### CategoryStore
```typescript
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()

// 加载数据
await categoryStore.loadFromServer()

// 添加分类
await categoryStore.addCategory({
  name: '开发工具',
  icon: 'Tools',
  color: '#409EFF',
  sortOrder: 1
})
```

### TagStore
```typescript
import { useTagStore } from '@/stores/tag'

const tagStore = useTagStore()

// 加载数据
await tagStore.loadFromServer()

// 添加标签
await tagStore.addTag({
  name: '前端',
  color: '#409EFF'
})
```

### AuthStore
```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 用户注册
await authStore.register({
  username: 'test',
  password: '123456',
  email: 'test@example.com'
})

// 用户登录
await authStore.login({
  username: 'test',
  password: '123456'
})

// 检查登录状态
if (authStore.isAuthenticated()) {
  // 已登录
}

// 登出
authStore.logout()
```

---

## 迁移指南

### 1. ID 类型转换
原本使用 `string` 类型的 ID，现在使用 `number` 类型：

```typescript
// 旧代码
const site = sites.find(s => s.id === '123')

// 新代码
const site = sites.find(s => s.id === 123)
```

### 2. 日期类型转换
原本使用时间戳，现在使用 ISO 日期字符串：

```typescript
// 旧代码
const timestamp = site.addTime // number

// 新代码
const dateString = site.addedTime // "2024-01-01T08:00:00Z"
const date = new Date(site.addedTime)
```

### 3. 数组字段转换
`categoryIds` 和 `tagIds` 从数组变为逗号分隔字符串：

```typescript
// 后端返回
site.categoryIds = "1,2,3"
site.tagIds = "1,2"

// 转换为数组
const categoryIdArray = site.categoryIds.split(',').filter(Boolean).map(Number)
const tagIdArray = site.tagIds.split(',').filter(Boolean).map(Number)

// 数组转换为字符串（提交到后端）
const categoryIdsString = [1, 2, 3].join(',')
```

### 4. 异步操作
所有数据操作都变为异步：

```typescript
// 旧代码（同步）
siteStore.addSite(newSite)

// 新代码（异步）
await siteStore.addSite(newSite)
```

---

## 错误处理

### 401 未授权
- 自动清除 token 和用户信息
- 跳转到登录页

### 其他错误
- 在控制台输出错误信息
- Store 方法抛出异常，由调用方处理

---

## 开发注意事项

1. **启动后端服务**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **配置跨域**
   后端已配置允许 `http://localhost:5173` 访问

3. **Token 管理**
   - Token 存储在 localStorage
   - 每次请求自动携带 token
   - Token 过期需重新登录

4. **用户 ID**
   - 登录后从 `user.userId` 获取
   - 大部分接口需要传递 userId 参数

---

## 测试建议

1. 先测试认证接口（注册/登录）
2. 登录成功后测试数据接口
3. 检查浏览器控制台的网络请求
4. 查看后端日志确认请求到达

---

## 未来优化建议

1. **错误提示优化**
   - 使用 Element Plus 的 Message 组件显示错误
   - 统一错误处理机制

2. **加载状态**
   - 在请求期间显示 Loading 动画
   - 禁用重复提交

3. **数据缓存**
   - 考虑使用 IndexedDB 离线缓存
   - 实现数据同步机制

4. **请求优化**
   - 实现请求去重
   - 添加请求重试机制
   - 使用 AbortController 取消请求
