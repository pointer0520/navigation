package com.navigation.service;

import com.navigation.entity.mysql.Site;
import com.navigation.repository.mysql.SiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 站点服务类
 */
@Service
@RequiredArgsConstructor
public class SiteService {

    private final SiteRepository siteRepository;

    public List<Site> getAllSites(Long userId) {
        return siteRepository.findByUserId(userId);
    }

    public Optional<Site> getSiteById(Long id) {
        return siteRepository.findById(id);
    }

    public Site createSite(Site site) {
        site.setAddedTime(LocalDateTime.now());
        site.setVisitCount(0);
        return siteRepository.save(site);
    }

    public Site updateSite(Long id, Site site) {
        site.setId(id);
        return siteRepository.save(site);
    }

    public void deleteSite(Long id) {
        siteRepository.deleteById(id);
    }

    public List<Site> getSitesByCategory(Long categoryId, Long userId) {
        return siteRepository.findByCategoryId(categoryId, userId);
    }

    public List<Site> getSitesByTag(Long tagId, Long userId) {
        return siteRepository.findByTagId(tagId, userId);
    }

    public List<Site> getQuickAccessSites(Long userId) {
        return siteRepository.findByQuickAccessAndUserId(true, userId);
    }

    public List<Site> searchSites(String keyword, Long userId) {
        return siteRepository.findByNameContainingIgnoreCaseAndUserId(keyword, userId);
    }

    public Site incrementVisitCount(Long id) {
        Optional<Site> siteOpt = siteRepository.findById(id);
        if (siteOpt.isPresent()) {
            Site site = siteOpt.get();
            site.setVisitCount(site.getVisitCount() + 1);
            return siteRepository.save(site);
        }
        return null;
    }

}
