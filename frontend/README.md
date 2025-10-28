# 个人导航站 - 前端项目

基于 Vue 3 + TypeScript + Vite 构建的个人导航站Web应用。

## 技术栈

- **框架**: Vue 3.3+
- **语言**: TypeScript
- **构建工具**: Vite 5.0
- **UI组件库**: Element Plus 2.4+
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **拖拽排序**: VueDraggable
- **样式**: SCSS

## 功能特性

### ✅ 第一阶段 - 核心基础功能
- [x] 站点分类管理（创建、编辑、删除、拖拽排序）
- [x] 基础搜索功能（关键词搜索、结果高亮）
- [x] 首页布局（搜索栏、分类导航、站点列表、快速访问区）

### 🚧 第二阶段 - 扩展功能
- [x] 标签体系（标签创建、管理、多标签关联）
- [x] 快速访问功能（快速访问区展示）
- [x] 用户账号系统（登录/注册界面）

### 📋 第三阶段 - 高级功能
- [x] 数据备份与同步（本地导出/导入JSON）
- [ ] 云端同步（需后端API支持）
- [ ] 性能优化

### 🧪 第四阶段 - 测试优化
- [ ] 兼容性测试
- [ ] 用户体验优化

## 项目结构

```
frontend/
├── src/
│   ├── components/        # 公共组件
│   │   ├── SiteDialog.vue      # 站点添加/编辑对话框
│   │   └── CategoryDialog.vue  # 分类管理对话框
│   ├── views/            # 页面视图
│   │   ├── Home.vue           # 首页
│   │   ├── Search.vue         # 搜索页
│   │   ├── CategoryDetail.vue # 分类详情页
│   │   ├── Settings.vue       # 设置页
│   │   ├── Login.vue          # 登录页
│   │   └── Register.vue       # 注册页
│   ├── stores/           # 状态管理
│   │   ├── site.ts            # 站点数据
│   │   ├── category.ts        # 分类数据
│   │   └── tag.ts             # 标签数据
│   ├── router/           # 路由配置
│   ├── types/            # TypeScript类型定义
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── index.html
├── vite.config.ts        # Vite配置
├── tsconfig.json         # TypeScript配置
└── package.json          # 依赖配置
```

## 开始使用

### 安装依赖

```bash
cd frontend
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 数据存储

当前版本使用浏览器本地存储：

- **LocalStorage**: 存储站点、分类、标签等核心数据
- **IndexedDB**: （待实现）存储大量历史记录数据

## 核心功能说明

### 1. 站点管理
- 添加站点：输入URL自动获取网站图标
- 多分类/标签关联：一个站点可属于多个分类和标签
- 快速访问：标记常用站点，在首页快速访问区展示

### 2. 分类管理
- 多级分类：支持父子层级关系
- 拖拽排序：通过拖拽调整分类顺序
- 图标颜色：自定义分类的视觉标识

### 3. 搜索功能
- 全文搜索：搜索站点名称、URL
- 过滤器：按分类/标签筛选
- 排序：按相关性、时间、访问次数排序
- 搜索历史：记录最近10次搜索

### 4. 数据备份
- 导出：一键导出所有数据为JSON文件
- 导入：从JSON文件恢复数据
- 云端同步：（需后端支持，暂未实现）

## 待实现功能

- [ ] 云端账号系统与API对接
- [ ] 数据加密存储
- [ ] 访问统计与报表
- [ ] 主题切换（暗色模式）
- [ ] 浏览器插件集成
- [ ] PWA支持
- [ ] 性能优化（代码分割、懒加载）

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## 响应式设计

支持以下设备：
- 桌面端：1920px - 1200px
- 平板端：1200px - 768px
- 移动端：768px - 320px

## 性能目标

- 页面首次加载：≤ 2秒
- 二次加载：≤ 1秒
- 操作响应：≤ 300ms
- 搜索响应：≤ 500ms

## 开发规范

- 组件命名：PascalCase
- 文件命名：PascalCase（.vue）、camelCase（.ts）
- 样式：使用scoped CSS，采用SCSS预处理器
- TypeScript：严格类型检查
- 提交：遵循Conventional Commits规范

## 许可证

MIT

## 贡献指南

欢迎提交Issue和Pull Request！

## 联系方式

项目维护者：[您的名字]
