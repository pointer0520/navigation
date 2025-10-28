package com.navigation.entity.mysql;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 标签实体（MySQL）
 */
@Data
@Entity
@Table(name = "tags")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 20)
    private String color;

    @Column(nullable = false)
    private LocalDateTime createTime;

    @Column(nullable = false)
    private Long userId;

}
