package com.lifeflow.backend.controller;

import com.lifeflow.backend.model.FeedItem;
import com.lifeflow.backend.repository.FeedItemRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feed")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedController {

    private final FeedItemRepository repository;

    public FeedController(FeedItemRepository repository) {
        this.repository = repository;
    }

    // GET /api/feed - Load all posts
    @GetMapping
    public List<FeedItem> getAllPosts() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    // POST /api/feed - Create a new post
    @PostMapping
    public FeedItem createPost(@RequestBody FeedItem item) {
        return repository.save(item);
    }

    // POST /api/feed/{id}/like - Like a post
    @PostMapping("/{id}/like")
    public void likePost(@PathVariable String id) {
        repository.findById(id).ifPresent(post -> {
            post.setLikes(post.getLikes() + 1);
            repository.save(post);
        });
    }
}