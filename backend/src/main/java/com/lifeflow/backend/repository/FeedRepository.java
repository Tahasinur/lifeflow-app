package com.lifeflow.backend.repository;

import com.lifeflow.backend.model.FeedItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface FeedRepository extends JpaRepository<FeedItem, UUID> {
    // Add custom queries here if needed later (e.g., findByType)
}