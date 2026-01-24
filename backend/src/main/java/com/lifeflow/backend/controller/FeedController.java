package com.lifeflow.backend.controller;

import com.lifeflow.backend.model.Comment;
import com.lifeflow.backend.model.FeedItem;
import com.lifeflow.backend.model.Page;
import com.lifeflow.backend.model.User;
import com.lifeflow.backend.repository.CommentRepository;
import com.lifeflow.backend.repository.FeedItemRepository;
import com.lifeflow.backend.repository.PageRepository;
import com.lifeflow.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/feed")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedController {

    private final FeedItemRepository feedRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final PageRepository pageRepository;

    public FeedController(
            FeedItemRepository feedRepository,
            UserRepository userRepository,
            CommentRepository commentRepository,
            PageRepository pageRepository) {
        this.feedRepository = feedRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.pageRepository = pageRepository;
    }

    @GetMapping
    public List<FeedItem> getAllPosts() {
        List<FeedItem> items = feedRepository.findAllByOrderByCreatedAtDesc();
        for (FeedItem item : items) {
            item.setCommentCount(commentRepository.countByFeedItemId(item.getId()));
        }
        return items;
    }

    @PostMapping
    public FeedItem createPost(@RequestBody Map<String, Object> payload) {
        FeedItem item = new FeedItem();
        item.setTitle((String) payload.get("title"));
        item.setDescription((String) payload.get("description"));
        item.setType((String) payload.get("type"));
        item.setSourcePageId((String) payload.get("sourcePageId"));
        
        @SuppressWarnings("unchecked")
        List<String> tags = (List<String>) payload.get("tags");
        item.setTags(tags);

        String userId = (String) payload.get("userId");
        if (userId != null) {
            userRepository.findById(userId).ifPresent(item::setAuthor);
        } else {
            String authorName = (String) payload.getOrDefault("authorName", "Anonymous");
            String authorEmail = (String) payload.getOrDefault("authorEmail", "anonymous@example.com");
            User user = userRepository.findByEmail(authorEmail).orElseGet(() -> {
                User newUser = new User();
                newUser.setName(authorName);
                newUser.setEmail(authorEmail);
                newUser.setAvatar(authorName.substring(0, Math.min(2, authorName.length())).toUpperCase());
                return userRepository.save(newUser);
            });
            item.setAuthor(user);
        }

        return feedRepository.save(item);
    }

    @PostMapping("/{id}/like")
    public void likePost(@PathVariable String id) {
        feedRepository.findById(id).ifPresent(post -> {
            post.setLikes(post.getLikes() + 1);
            feedRepository.save(post);
        });
    }

    @GetMapping("/{id}/comments")
    public List<Comment> getComments(@PathVariable String id) {
        return commentRepository.findByFeedItemIdOrderByCreatedAtDesc(id);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable String id, @RequestBody Map<String, String> payload) {
        Optional<FeedItem> feedItemOpt = feedRepository.findById(id);
        if (feedItemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String text = payload.get("text");
        String authorName = payload.getOrDefault("authorName", "Anonymous");
        String authorEmail = payload.getOrDefault("authorEmail", "anonymous@example.com");

        User author = userRepository.findByEmail(authorEmail).orElseGet(() -> {
            User newUser = new User();
            newUser.setName(authorName);
            newUser.setEmail(authorEmail);
            newUser.setAvatar(authorName.substring(0, Math.min(2, authorName.length())).toUpperCase());
            return userRepository.save(newUser);
        });

        Comment comment = new Comment();
        comment.setText(text);
        comment.setAuthor(author);
        comment.setFeedItem(feedItemOpt.get());

        return ResponseEntity.ok(commentRepository.save(comment));
    }

    @PostMapping("/{id}/clone")
    public ResponseEntity<?> cloneTemplate(@PathVariable String id, @RequestBody Map<String, String> payload) {
        Optional<FeedItem> feedItemOpt = feedRepository.findById(id);
        if (feedItemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        FeedItem feedItem = feedItemOpt.get();
        if (!"template".equals(feedItem.getType())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only templates can be cloned"));
        }

        String sourcePageId = feedItem.getSourcePageId();
        if (sourcePageId == null || sourcePageId.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No source page linked to this template"));
        }

        Optional<Page> sourcePageOpt = pageRepository.findById(sourcePageId);
        if (sourcePageOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Source page not found"));
        }

        Page sourcePage = sourcePageOpt.get();

        Page newPage = new Page();
        newPage.setId(UUID.randomUUID().toString());
        newPage.setTitle(sourcePage.getTitle() + " (Cloned)");
        newPage.setIcon(sourcePage.getIcon());
        newPage.setCoverImage(sourcePage.getCoverImage());
        newPage.setBlocksJson(sourcePage.getBlocksJson());
        newPage.setParentId(null);
        newPage.setFavorite(false);
        newPage.setDeleted(false);

        Page savedPage = pageRepository.save(newPage);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "pageId", savedPage.getId(),
            "message", "Template cloned successfully!"
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id,
                                        @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        Optional<FeedItem> feedItemOpt = feedRepository.findById(id);
        if (feedItemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        FeedItem feedItem = feedItemOpt.get();
        
        if (headerUserId != null && feedItem.getAuthor() != null && 
            !feedItem.getAuthor().getId().equals(headerUserId)) {
            return ResponseEntity.status(403).body(Map.of("error", "You can only delete your own posts"));
        }

        commentRepository.deleteAll(commentRepository.findByFeedItemIdOrderByCreatedAtDesc(id));
        feedRepository.delete(feedItem);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/{feedId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String feedId,
                                           @PathVariable String commentId,
                                           @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Comment comment = commentOpt.get();
        
        if (headerUserId != null && comment.getAuthor() != null && 
            !comment.getAuthor().getId().equals(headerUserId)) {
            return ResponseEntity.status(403).body(Map.of("error", "You can only delete your own comments"));
        }

        commentRepository.delete(comment);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
