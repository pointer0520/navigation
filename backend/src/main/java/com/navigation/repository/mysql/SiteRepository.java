package com.navigation.repository.mysql;

import com.navigation.entity.mysql.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 站点Repository
 */
@Repository
public interface SiteRepository extends JpaRepository<Site, Long> {

    List<Site> findByUserId(Long userId);

    @Query("SELECT s FROM Site s WHERE s.categoryIds LIKE CONCAT('%', :categoryId, '%') AND s.userId = :userId")
    List<Site> findByCategoryId(@Param("categoryId") Long categoryId, @Param("userId") Long userId);

    @Query("SELECT s FROM Site s WHERE s.tagIds LIKE CONCAT('%', :tagId, '%') AND s.userId = :userId")
    List<Site> findByTagId(@Param("tagId") Long tagId, @Param("userId") Long userId);

    List<Site> findByQuickAccessAndUserId(Boolean quickAccess, Long userId);

    List<Site> findByNameContainingIgnoreCaseAndUserId(String name, Long userId);

    List<Site> findByUserIdOrderByVisitCountDesc(Long userId);

    List<Site> findByUserIdOrderByAddedTimeDesc(Long userId);

}
