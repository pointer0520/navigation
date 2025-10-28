package com.navigation.repository.mysql;

import com.navigation.entity.mysql.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 分类Repository
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUserId(Long userId);

    List<Category> findByParentIdAndUserId(Long parentId, Long userId);

    List<Category> findByUserIdOrderBySortOrder(Long userId);

    List<Category> findByParentIdIsNullAndUserId(Long userId);

}
