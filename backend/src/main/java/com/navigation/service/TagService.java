package com.navigation.service;

import com.navigation.entity.mysql.Tag;
import com.navigation.repository.mysql.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 标签服务类
 */
@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    public List<Tag> getAllTags(Long userId) {
        return tagRepository.findByUserId(userId);
    }

    public Optional<Tag> getTagById(Long id) {
        return tagRepository.findById(id);
    }

    public Tag createTag(Tag tag) {
        tag.setCreateTime(LocalDateTime.now());
        return tagRepository.save(tag);
    }

    public Tag updateTag(Long id, Tag tag) {
        tag.setId(id);
        return tagRepository.save(tag);
    }

    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
    }

}
