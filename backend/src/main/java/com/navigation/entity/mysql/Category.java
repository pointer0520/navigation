package com.navigation.entity.mysql;

import jakarta.persistence.*;
import lombok.Data;

/**
 * 分类实体（MySQL）
 */
@Data
@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String icon;

    @Column(length = 20)
    private String color;

    private Long parentId;

    @Column(nullable = false)
    private Integer sortOrder;

    @Column(nullable = false)
    private Long userId;

}
