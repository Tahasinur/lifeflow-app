package com.lifeflow.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "feed_items")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class FeedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String type;
    private int likes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    private User author;

    private String sourcePageId;

    @ElementCollection
    private List<String> tags;

    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Transient
    private int commentCount;
}
