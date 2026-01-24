package com.lifeflow.backend.repository;

import com.lifeflow.backend.model.FeedItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedItemRepository extends JpaRepository<FeedItem, String> {
    List<FeedItem> findAllByOrderByCreatedAtDesc();
    List<FeedItem> findByAuthorIdOrderByCreatedAtDesc(String authorId);
}