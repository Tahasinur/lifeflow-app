package com.lifeflow.backend.controller;

import com.lifeflow.backend.model.FeedItem;
import com.lifeflow.backend.repository.FeedRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/feed")
@CrossOrigin(origins = "*")
public class FeedController {

    private final FeedRepository repository;

    public FeedController(FeedRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<FeedItem> getAllItems() {
        return repository.findAll();
    }

    @PostMapping
    public FeedItem createItem(@RequestBody FeedItem item) {
        return repository.save(item);
    }

    @PostMapping("/{id}/like")
    public FeedItem likeItem(@PathVariable UUID id) {
        return repository.findById(id).map(item -> {
            item.setLikes(item.getLikes() + 1);
            return repository.save(item);
        }).orElseThrow(() -> new RuntimeException("Item not found"));
    }
}