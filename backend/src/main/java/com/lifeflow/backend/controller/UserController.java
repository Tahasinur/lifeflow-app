package com.lifeflow.backend.controller;

import com.lifeflow.backend.model.FeedItem;
import com.lifeflow.backend.model.User;
import com.lifeflow.backend.repository.CommentRepository;
import com.lifeflow.backend.repository.FeedItemRepository;
import com.lifeflow.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserRepository userRepository;
    private final FeedItemRepository feedItemRepository;
    private final CommentRepository commentRepository;

    public UserController(
            UserRepository userRepository,
            FeedItemRepository feedItemRepository,
            CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.feedItemRepository = feedItemRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<?> getUserProfile(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        List<FeedItem> feedItems = feedItemRepository.findByAuthorIdOrderByCreatedAtDesc(id);
        
        for (FeedItem item : feedItems) {
            item.setCommentCount(commentRepository.countByFeedItemId(item.getId()));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("posts", feedItems);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody Map<String, String> payload) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        if (payload.containsKey("name")) user.setName(payload.get("name"));
        if (payload.containsKey("bio")) user.setBio(payload.get("bio"));
        if (payload.containsKey("avatar")) user.setAvatar(payload.get("avatar"));

        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/by-email")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userOpt.get());
    }
}
