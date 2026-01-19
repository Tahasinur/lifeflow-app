package com.lifeflow.backend.controller;

import com.lifeflow.backend.model.Page;
import com.lifeflow.backend.repository.PageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pages")
@CrossOrigin(origins = "http://localhost:3000") // Allow Frontend to access this
public class PageController {

    private final PageRepository repository;

    public PageController(PageRepository repository) {
        this.repository = repository;
    }

    // Get all active pages
    @GetMapping
    public List<Page> getAllPages() {
        return repository.findByIsDeletedFalse();
    }

    // Create or Update a page
    @PostMapping
    public Page savePage(@RequestBody Page page) {
        return repository.save(page);
    }

    // Move to Trash (Soft Delete)
    @DeleteMapping("/{id}")
    public void deletePage(@PathVariable UUID id) {
        repository.findById(id).ifPresent(page -> {
            page.setDeleted(true);
            repository.save(page);
        });
    }
}