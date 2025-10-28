package com.navigation.repository.mysql;

import com.navigation.entity.mysql.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 标签Repository
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findByUserId(Long userId);

    Optional<Tag> findByNameAndUserId(String name, Long userId);

    Boolean existsByNameAndUserId(String name, Long userId);

}
