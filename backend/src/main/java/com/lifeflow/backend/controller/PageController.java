package com.lifeflow.backend.controller;

import com.lifeflow.backend.model.Page;
import com.lifeflow.backend.repository.PageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/pages")
@CrossOrigin(origins = "http://localhost:3000")
public class PageController {

    private final PageRepository repository;

    public PageController(PageRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<?> getAllPages(
            @RequestParam(required = false) String userId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        
        String requestingUserId = headerUserId != null ? headerUserId : userId;
        
        if (requestingUserId == null || requestingUserId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "User ID is required to access pages"));
        }
        
        return ResponseEntity.ok(repository.findByUserIdAndDeletedFalse(requestingUserId));
    }

    @PostMapping
    public ResponseEntity<?> savePage(@RequestBody Page page, 
                         @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        if (headerUserId == null || headerUserId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "User ID is required to create pages"));
        }
        
        page.setUserId(headerUserId);
        return ResponseEntity.ok(repository.save(page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPage(@PathVariable String id,
                                     @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        Optional<Page> pageOpt = repository.findById(id);
        if (pageOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Page page = pageOpt.get();
        
        if (page.getUserId() != null) {
            if (headerUserId == null || !page.getUserId().equals(headerUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to access this page"));
            }
        }
        
        return ResponseEntity.ok(page);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePage(@PathVariable String id, 
                                        @RequestBody Page updatedPage,
                                        @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        Optional<Page> pageOpt = repository.findById(id);
        if (pageOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Page existingPage = pageOpt.get();
        
        if (existingPage.getUserId() != null) {
            if (headerUserId == null || !existingPage.getUserId().equals(headerUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to modify this page"));
            }
        }
        
        updatedPage.setId(id);
        updatedPage.setUserId(existingPage.getUserId());
        return ResponseEntity.ok(repository.save(updatedPage));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePage(@PathVariable String id,
                                        @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        Optional<Page> pageOpt = repository.findById(id);
        if (pageOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Page page = pageOpt.get();
        
        if (page.getUserId() != null) {
            if (headerUserId == null || !page.getUserId().equals(headerUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to delete this page"));
            }
        }
        
        page.setDeleted(true);
        repository.save(page);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/trash")
    public ResponseEntity<?> getTrash(
            @RequestParam(required = false) String userId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        
        String requestingUserId = headerUserId != null ? headerUserId : userId;
        
        if (requestingUserId == null || requestingUserId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "User ID is required to access trash"));
        }
        
        return ResponseEntity.ok(repository.findByUserIdAndDeletedTrue(requestingUserId));
    }
}
