# 导航网站后端服务

## 技术栈
- Spring Boot 3.1.5
- Java 17
- Maven
- MySQL (主数据库)
- Spring Security + JWT

## 项目结构
```
backend/
├── src/main/java/com/daohang/
│   ├── config/          # 配置类
│   ├── controller/      # 控制器层
│   ├── dto/            # 数据传输对象
│   ├── entity/         # 实体类
│   │   ├── mongodb/    # MongoDB实体
│   │   └── mysql/      # MySQL实体
│   ├── repository/     # 数据访问层
│   │   ├── mongodb/    # MongoDB Repository
│   │   └── mysql/      # MySQL Repository
│   ├── service/        # 业务逻辑层
│   ├── util/           # 工具类
│   └── DaohangApplication.java
└── src/main/resources/
    └── application.yml  # 配置文件
```

## 启动前准备
1. 安装并启动MySQL
2. 在MySQL中创建数据库：
```sql
mysql -u root -p
source e:\workspace\web\daohang\backend\src\main\resources\schema.sql
```

## 启动命令
```bash
cd backend
mvn spring-boot:run
```

## API接口
服务运行在：http://localhost:8080/api

### 认证接口
- POST /auth/register - 用户注册
- POST /auth/login - 用户登录

### 站点接口
- GET /sites - 获取所有站点
- POST /sites - 创建站点
- PUT /sites/{id} - 更新站点
- DELETE /sites/{id} - 删除站点

### 分类接口
- GET /categories - 获取所有分类
- POST /categories - 创建分类
- PUT /categories/{id} - 更新分类
- DELETE /categories/{id} - 删除分类

### 标签接口
- GET /tags - 获取所有标签
- POST /tags - 创建标签
- PUT /tags/{id} - 更新标签
- DELETE /tags/{id} - 删除标签
