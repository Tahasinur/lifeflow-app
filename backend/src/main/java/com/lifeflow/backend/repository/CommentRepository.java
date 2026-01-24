package com.lifeflow.backend.repository;

import com.lifeflow.backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByFeedItemIdOrderByCreatedAtDesc(String feedItemId);
    int countByFeedItemId(String feedItemId);
}
