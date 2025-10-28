-- =============================================
-- 导航网站数据库表结构 - MySQL
-- =============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `daohang` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `daohang`;

-- =============================================
-- 用户表
-- =============================================
CREATE TABLE IF NOT EXISTS `users` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =============================================
-- 站点表
-- =============================================
CREATE TABLE IF NOT EXISTS `sites` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '站点ID',
  `name` VARCHAR(200) NOT NULL COMMENT '站点名称',
  `url` VARCHAR(500) NOT NULL COMMENT '站点URL',
  `icon_url` VARCHAR(500) DEFAULT NULL COMMENT '图标URL',
  `added_time` DATETIME NOT NULL COMMENT '添加时间',
  `visit_count` INT NOT NULL DEFAULT 0 COMMENT '访问次数',
  `category_ids` VARCHAR(1000) DEFAULT NULL COMMENT '分类ID列表（逗号分隔）',
  `tag_ids` VARCHAR(1000) DEFAULT NULL COMMENT '标签ID列表（逗号分隔）',
  `quick_access` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否快速访问',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_name` (`name`),
  INDEX `idx_quick_access` (`quick_access`, `user_id`),
  INDEX `idx_visit_count` (`visit_count` DESC),
  INDEX `idx_added_time` (`added_time` DESC),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='站点表';

-- =============================================
-- 分类表
-- =============================================
CREATE TABLE IF NOT EXISTS `categories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(100) NOT NULL COMMENT '分类名称',
  `icon` VARCHAR(50) DEFAULT NULL COMMENT '图标',
  `color` VARCHAR(20) DEFAULT NULL COMMENT '颜色',
  `parent_id` BIGINT DEFAULT NULL COMMENT '父分类ID',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序序号',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_parent_id` (`parent_id`, `user_id`),
  INDEX `idx_sort_order` (`sort_order`),
  INDEX `idx_name` (`name`, `user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- =============================================
-- 标签表
-- =============================================
CREATE TABLE IF NOT EXISTS `tags` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `name` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `color` VARCHAR(20) DEFAULT NULL COMMENT '颜色',
  `create_time` DATETIME NOT NULL COMMENT '创建时间',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name_user` (`name`, `user_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_create_time` (`create_time` DESC),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- =============================================
-- 插入测试数据（可选）
-- =============================================
-- INSERT INTO `users` (`username`, `password_hash`, `email`, `register_time`) 
-- VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iYVPJsge', 'admin@example.com', NOW());
-- 注：密码是 'admin123' 的 BCrypt 加密
