package com.navigation.controller;

import com.navigation.entity.mysql.Site;
import com.navigation.service.SiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 站点控制器
 */
@RestController
@RequestMapping("/sites")
@RequiredArgsConstructor
@CrossOrigin
public class SiteController {

    private final SiteService siteService;

    @GetMapping
    public ResponseEntity<List<Site>> getAllSites(@RequestParam Long userId) {
        return ResponseEntity.ok(siteService.getAllSites(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Site> getSiteById(@PathVariable Long id) {
        return siteService.getSiteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Site> createSite(@RequestBody Site site) {
        return ResponseEntity.ok(siteService.createSite(site));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Site> updateSite(@PathVariable Long id, @RequestBody Site site) {
        return ResponseEntity.ok(siteService.updateSite(id, site));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSite(@PathVariable Long id) {
        siteService.deleteSite(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Site>> getSitesByCategory(
            @PathVariable Long categoryId,
            @RequestParam Long userId) {
        return ResponseEntity.ok(siteService.getSitesByCategory(categoryId, userId));
    }

    @GetMapping("/tag/{tagId}")
    public ResponseEntity<List<Site>> getSitesByTag(
            @PathVariable Long tagId,
            @RequestParam Long userId) {
        return ResponseEntity.ok(siteService.getSitesByTag(tagId, userId));
    }

    @GetMapping("/quick-access")
    public ResponseEntity<List<Site>> getQuickAccessSites(@RequestParam Long userId) {
        return ResponseEntity.ok(siteService.getQuickAccessSites(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Site>> searchSites(
            @RequestParam String keyword,
            @RequestParam Long userId) {
        return ResponseEntity.ok(siteService.searchSites(keyword, userId));
    }

    @PostMapping("/{id}/visit")
    public ResponseEntity<Site> incrementVisitCount(@PathVariable Long id) {
        Site site = siteService.incrementVisitCount(id);
        if (site != null) {
            return ResponseEntity.ok(site);
        }
        return ResponseEntity.notFound().build();
    }

}
