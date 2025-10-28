package com.navigation.entity.mysql;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 站点实体（MySQL）
 */
@Data
@Entity
@Table(name = "sites")
public class Site {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(length = 500)
    private String iconUrl;

    @Column(nullable = false)
    private LocalDateTime addedTime;

    @Column(nullable = false)
    private Integer visitCount;

    @Column(length = 1000)
    private String categoryIds;  // 以逗号分隔的ID列表

    @Column(length = 1000)
    private String tagIds;  // 以逗号分隔的ID列表

    @Column(nullable = false)
    private Boolean quickAccess;

    @Column(nullable = false)
    private Long userId;

}
