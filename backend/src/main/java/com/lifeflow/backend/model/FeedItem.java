package com.lifeflow.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "feed_items")
public class FeedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    private String description;
    private String authorName;
    private String authorAvatar;
    private String type; // 'template', 'blog', 'workspace_update'
    private int likes;

    @ElementCollection // Stores the tags list properly
    private List<String> tags;

    @CreationTimestamp
    private LocalDateTime createdAt;
}