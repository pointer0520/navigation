# 🧭 个人导航站系统

个人网站导航管理系统，支持多级分类、智能标签、快速搜索和数据云同步。

[![Vue](https://img.shields.io/badge/Vue-3.3.4-42b983)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.5-brightgreen)](https://spring.io/projects/spring-boot)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## ✨ 功能特性

### 核心功能
- 🗂️ **站点管理** - 添加、编辑、删除网站，支持图标自动获取
- 📁 **多级分类** - 无限层级分类体系，拖拽排序
- 🏷️ **智能标签** - 多维度标签系统，灵活组织站点
- 🔍 **实时搜索** - 关键词搜索、历史记录、智能建议
- ⚡ **快速访问** - 常用站点一键直达，自定义排序
- 💾 **数据备份** - 本地导出/导入，云端同步
- 👤 **用户系统** - 注册登录、权限管理、数据隔离
- 🎨 **主题定制** - 丰富的UI配色方案

### 技术亮点
- 📱 响应式设计，支持桌面端和平板设备
- 🚀 Vite 构建，开发体验极速
- 🎯 TypeScript 全栈类型安全
- 🔐 JWT 身份认证，Spring Security 安全防护
- 💡 防抖搜索，性能优化
- 🎭 渐变动画，视觉效果出众

## 📁 项目结构

```
daohang/
├── frontend/                  # 前端项目（Vue 3 + TypeScript + Vite）
│   ├── src/
│   │   ├── api/              # API 接口层
│   │   ├── assets/           # 静态资源
│   │   ├── components/       # 公共组件
│   │   ├── router/           # 路由配置
│   │   ├── stores/           # Pinia 状态管理
│   │   ├── types/            # TypeScript 类型定义
│   │   ├── utils/            # 工具函数
│   │   ├── views/            # 页面组件
│   │   ├── App.vue           # 根组件
│   │   └── main.ts           # 入口文件
│   ├── public/               # 公共静态资源
│   ├── index.html            # HTML 模板
│   ├── package.json          # 依赖配置
│   ├── tsconfig.json         # TypeScript 配置
│   └── vite.config.ts        # Vite 配置
│
├── backend/                   # 后端项目（Spring Boot + MySQL）
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/navigation/
│   │   │   │   ├── config/           # 配置类
│   │   │   │   ├── controller/       # 控制器层
│   │   │   │   ├── dto/              # 数据传输对象
│   │   │   │   ├── entity/           # 实体类
│   │   │   │   ├── repository/       # 数据访问层
│   │   │   │   ├── service/          # 业务逻辑层
│   │   │   │   ├── security/         # 安全配置
│   │   │   │   └── NavigationApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml   # 应用配置
│   │   │       └── data.sql          # 初始化数据
│   │   └── test/                     # 测试代码
│   ├── pom.xml                       # Maven 配置
│   └── README.md                     # 后端文档
│
├── README.md                  # 项目说明（本文件）
└── 开发指南.md                # 开发指南和技术文档
```

## 🚀 快速开始

### 环境要求

#### 前端
- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0 或 **yarn**: >= 1.22.0
- **浏览器**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

#### 后端
- **Java**: JDK 17+
- **Maven**: 3.8+
- **MySQL**: 8.0+
- **IDE**: IntelliJ IDEA / Eclipse（推荐 IDEA）

### 1️⃣ 克隆项目

```bash
git clone https://github.com/yourusername/daohang.git
cd daohang
```

### 2️⃣ 数据库配置

#### 创建数据库

```sql
CREATE DATABASE navigation DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 配置数据库连接

编辑 `backend/src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/navigation?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root          # 修改为你的数据库用户名
    password: your_password # 修改为你的数据库密码
```

### 3️⃣ 启动后端服务

#### 方式一：使用 Maven 命令行

```bash
# 进入后端目录
cd backend

# 安装依赖并启动
mvn clean install
mvn spring-boot:run
```

#### 方式二：使用 IDE

1. 使用 IntelliJ IDEA 打开 `backend` 目录
2. 等待 Maven 依赖下载完成
3. 找到 `NavigationApplication.java`
4. 右键 → Run 'NavigationApplication'

#### 验证后端启动

后端服务默认运行在 `http://localhost:8080`

访问测试接口：
```bash
curl http://localhost:8080/api/health
```

### 4️⃣ 启动前端服务

#### Windows 系统

```powershell
# 进入前端目录
cd frontend

# 安装依赖（首次运行或依赖更新时）
npm install

# 启动开发服务器（处理 PowerShell 执行策略）
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

#### macOS / Linux 系统

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 访问应用

前端服务默认运行在 `http://localhost:5173`

浏览器打开：http://localhost:5173

### 5️⃣ 首次使用

1. 访问注册页面创建账号
2. 登录系统
3. 开始添加你的导航站点

## 🛠️ 技术栈

### 前端技术

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.3.4 | 渐进式 JavaScript 框架 |
| TypeScript | 5.2.2 | JavaScript 超集，提供类型系统 |
| Vite | 5.0.0 | 下一代前端构建工具 |
| Vue Router | 4.2.5 | Vue 官方路由管理器 |
| Pinia | 2.1.7 | Vue 官方状态管理库 |
| Element Plus | 2.4.2 | 基于 Vue 3 的组件库 |
| Axios | 1.6.0 | HTTP 客户端 |
| Sass | 1.69.5 | CSS 预处理器 |
| VueDraggable | 4.1.0 | 拖拽排序组件 |
| Day.js | 1.11.10 | 轻量级日期处理库 |

### 后端技术

| 技术 | 版本 | 说明 |
|------|------|------|
| Spring Boot | 3.1.5 | Java 应用开发框架 |
| Spring Security | 6.1.5 | 安全框架 |
| Spring Data JPA | 3.1.5 | 数据持久化 |
| MySQL | 8.0+ | 关系型数据库 |
| JWT | 0.11.5 | JSON Web Token |
| Lombok | 1.18.30 | 简化 Java 代码 |
| Maven | 3.8+ | 项目管理工具 |

## 📦 构建部署

### 前端构建

```bash
cd frontend

# 生产环境构建
npm run build

# 构建产物位于 dist/ 目录
```

#### 部署到 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 后端打包

```bash
cd backend

# Maven 打包
mvn clean package -DskipTests

# 生成的 jar 包位于 target/ 目录
```

#### 运行 JAR 包

```bash
# 开发环境运行
java -jar target/daohang-backend-1.0.0.jar

# 生产环境运行（指定配置文件）
java -jar target/daohang-backend-1.0.0.jar --spring.profiles.active=prod

# 后台运行
nohup java -jar target/daohang-backend-1.0.0.jar > app.log 2>&1 &
```

### Docker 部署（可选）

#### 前端 Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 后端 Dockerfile

```dockerfile
# backend/Dockerfile
FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY target/daohang-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: navigation
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/navigation
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: your_password

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql-data:
```

启动服务：
```bash
docker-compose up -d
```

## 🔧 开发指南

### 代码规范

- **前端**：遵循 Vue 3 Composition API 规范
- **后端**：遵循 Alibaba Java 开发手册
- **命名**：使用有意义的变量和函数名
- **注释**：关键逻辑必须添加注释
- **格式**：统一使用 2 空格缩进

### 目录规范

- `components/` - 可复用组件
- `views/` - 页面组件
- `api/` - API 接口定义
- `stores/` - 状态管理
- `types/` - 类型定义
- `utils/` - 工具函数

### API 接口规范

所有接口遵循 RESTful 风格：

```
GET    /api/sites          # 获取站点列表
POST   /api/sites          # 创建站点
PUT    /api/sites/:id      # 更新站点
DELETE /api/sites/:id      # 删除站点
```

### 提交规范

使用语义化提交信息：

```
feat: 添加新功能
fix: 修复 Bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
perf: 性能优化
test: 添加测试
chore: 构建/工具变动
```

## 🐛 常见问题

### 1. PowerShell 执行策略错误

**问题**：Windows 下运行 npm 命令报错

**解决**：
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

### 2. 数据库连接失败

**问题**：后端启动报错 "Cannot connect to database"

**解决**：
1. 检查 MySQL 服务是否启动
2. 确认数据库用户名密码正确
3. 检查数据库是否已创建
4. 确认防火墙未阻止 3306 端口

### 3. 前端跨域问题

**问题**：浏览器控制台报 CORS 错误

**解决**：
1. 确认后端 `application.yml` 中配置了正确的跨域源
2. 检查前端 API 基础路径配置

### 4. JWT Token 过期

**问题**：请求返回 401 未授权

**解决**：
1. 重新登录获取新 Token
2. 调整 `application.yml` 中 `jwt.expiration` 配置

## 📈 性能指标

| 指标 | 目标 | 说明 |
|------|------|------|
| 首次加载 | ≤ 2s | 页面首次加载时间 |
| 二次加载 | ≤ 1s | 有缓存的加载时间 |
| API 响应 | ≤ 300ms | 站点创建/更新响应 |
| 搜索响应 | ≤ 500ms | 关键词搜索响应 |
| 并发支持 | 1000+ | 同时在线用户数 |

## 📝 更新日志

### v1.0.0 (2025-10-28)

**新功能**
- ✨ 完整的站点管理功能
- ✨ 多级分类体系
- ✨ 智能标签系统
- ✨ 实时搜索功能
- ✨ 快速访问面板
- ✨ 用户认证系统
- ✨ 数据导出/导入

**优化**
- 🎨 优化 UI 视觉效果
- ⚡ 搜索防抖优化
- 📱 响应式布局适配
- 🔐 安全性增强

## 🤝 贡献指南

欢迎贡献代码！请遵循以下流程：

1. **Fork** 本仓库
2. **创建**功能分支 (`git checkout -b feature/AmazingFeature`)
3. **提交**更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. **推送**到分支 (`git push origin feature/AmazingFeature`)
5. **提交** Pull Request

### 贡献者

感谢所有贡献者的付出！

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 📧 联系方式

- **项目主页**：https://github.com/pointer0520/navigation
- **问题反馈**：https://github.com/pointer0520/navigation/issues

## 🙏 致谢

感谢以下开源项目：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [Spring Boot](https://spring.io/projects/spring-boot) - Java 应用框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

---

⭐ 如果这个项目对你有帮助，请给一个 Star！

**项目启动日期**：2025-10-28  
**当前版本**：v1.0.0  
