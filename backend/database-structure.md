# 数据库表结构设计文档

## 概述

本项目采用纯MySQL数据库架构：
- **MySQL**：存储所有业务数据（用户、站点、分类、标签）

---

## MySQL 数据库结构

### 1. users 表（用户表）

| 字段名 | 类型 | 长度 | 约束 | 说明 |
|--------|------|------|------|------|
| id | BIGINT | - | PRIMARY KEY, AUTO_INCREMENT | 用户ID |
| username | VARCHAR | 50 | NOT NULL, UNIQUE | 用户名 |
| password_hash | VARCHAR | 255 | NOT NULL | 密码哈希（BCrypt加密） |
| email | VARCHAR | 100 | UNIQUE | 邮箱 |
| register_time | DATETIME | - | NOT NULL | 注册时间 |
| last_login_time | DATETIME | - | | 最后登录时间 |

**索引：**
- PRIMARY KEY: `id`
- UNIQUE KEY: `username`
- UNIQUE KEY: `email`
- INDEX: `register_time`

**SQL 创建语句：**
```sql
CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `register_time` DATETIME NOT NULL COMMENT '注册时间',
  `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  INDEX `idx_register_time` (`register_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2. sites 表（站点表）

| 字段名 | 类型 | 长度 | 约束 | 说明 |
|--------|------|------|------|------|
| id | BIGINT | - | PRIMARY KEY, AUTO_INCREMENT | 站点ID |
| name | VARCHAR | 200 | NOT NULL | 站点名称 |
| url | VARCHAR | 500 | NOT NULL | 站点URL |
| icon_url | VARCHAR | 500 | | 图标URL |
| added_time | DATETIME | - | NOT NULL | 添加时间 |
| visit_count | INT | - | NOT NULL, DEFAULT 0 | 访问次数 |
| category_ids | VARCHAR | 1000 | | 分类ID列表（逗号分隔） |
| tag_ids | VARCHAR | 1000 | | 标签ID列表（逗号分隔） |
| quick_access | TINYINT | 1 | NOT NULL, DEFAULT 0 | 是否快速访问 |
| user_id | BIGINT | - | NOT NULL, FOREIGN KEY | 用户ID |

**索引：**
- PRIMARY KEY: `id`
- INDEX: `user_id`
- INDEX: `name`
- INDEX: `quick_access, user_id`
- INDEX: `visit_count` (降序)
- INDEX: `added_time` (降序)
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

### 3. categories 表（分类表）

| 字段名 | 类型 | 长度 | 约束 | 说明 |
|--------|------|------|------|------|
| id | BIGINT | - | PRIMARY KEY, AUTO_INCREMENT | 分类ID |
| name | VARCHAR | 100 | NOT NULL | 分类名称 |
| icon | VARCHAR | 50 | | 图标 |
| color | VARCHAR | 20 | | 颜色 |
| parent_id | BIGINT | - | FOREIGN KEY | 父分类ID |
| sort_order | INT | - | NOT NULL, DEFAULT 0 | 排序序号 |
| user_id | BIGINT | - | NOT NULL, FOREIGN KEY | 用户ID |

**索引：**
- PRIMARY KEY: `id`
- INDEX: `user_id`
- INDEX: `parent_id, user_id`
- INDEX: `sort_order`
- INDEX: `name, user_id`
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- FOREIGN KEY: `parent_id` REFERENCES `categories(id)` ON DELETE SET NULL

---

### 4. tags 表（标签表）

| 字段名 | 类型 | 长度 | 约束 | 说明 |
|--------|------|------|------|------|
| id | BIGINT | - | PRIMARY KEY, AUTO_INCREMENT | 标签ID |
| name | VARCHAR | 50 | NOT NULL | 标签名称 |
| color | VARCHAR | 20 | | 颜色 |
| create_time | DATETIME | - | NOT NULL | 创建时间 |
| user_id | BIGINT | - | NOT NULL, FOREIGN KEY | 用户ID |

**索引：**
- PRIMARY KEY: `id`
- UNIQUE KEY: `name, user_id`
- INDEX: `user_id`
- INDEX: `create_time` (降序)
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

## 四、实体关系说明

### 关系图
```
users (1) ──────< (N) sites
                     │
                     ├──< (N:M) categories
                     │
                     └──< (N:M) tags

categories (1) ──────< (N) categories (父子关系)
```

### 关系说明

1. **用户 - 站点**：一对多
   - 一个用户可以拥有多个站点
   - 通过 `sites.userId` 关联

2. **站点 - 分类**：多对多
   - 一个站点可以属于多个分类
   - 通过 `sites.categoryIds` 数组存储

3. **站点 - 标签**：多对多
   - 一个站点可以有多个标签
   - 通过 `sites.tagIds` 数组存储

4. **分类 - 分类**：父子层级（一对多）
   - 支持多级分类结构
   - 通过 `categories.parentId` 实现

---

## 五、数据库初始化

### MySQL 初始化
```bash
# 执行 schema.sql
mysql -u root -p < src/main/resources/schema.sql
```

### MongoDB 初始化
```bash
# 执行 mongodb-init.js
mongo < src/main/resources/mongodb-init.js
```

---

## 性能优化

### 索引优化
1. **主键索引**: 所有表都有自增主键
2. **外键索引**: user_id、parent_id 等关联字段建立外键
3. **复合索引**: quick_access + user_id、name + user_id
4. **排序索引**: visit_count、added_time、create_time 降序索引

### 查询优化
1. 使用索引覆盖查询
2. 避免全表扫描
3. 分页查询优化
4. LIKE 查询使用前缀匹配

---

## 数据备份

### 备份命令
```bash
# 备份整个数据库
mysqldump -u root -p daohang > daohang_backup.sql

# 备份指定表
mysqldump -u root -p daohang users sites categories tags > daohang_tables.sql
```

### 恢复命令
```bash
# 恢复数据库
mysql -u root -p daohang < daohang_backup.sql
```
