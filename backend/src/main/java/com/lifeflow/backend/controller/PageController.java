package com.lifeflow.backend.controller;

import com.lifeflow.backend.model.Page;
import com.lifeflow.backend.repository.PageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pages")
@CrossOrigin(origins = "http://localhost:3000")
public class PageController {

    private final PageRepository repository;

    public PageController(PageRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Page> getAllPages() {
        // Use the new method name
        return repository.findByDeletedFalse();
    }

    @PostMapping
    public Page savePage(@RequestBody Page page) {
        return repository.save(page);
    }

    @DeleteMapping("/{id}")
    public void deletePage(@PathVariable String id) {
        repository.findById(id).ifPresent(page -> {
            // Update the field and save
            page.setDeleted(true);
            repository.save(page);
        });
    }
}