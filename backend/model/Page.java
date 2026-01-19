package com.lifeflow.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "pages")
public class Page {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    private String icon;

    @Column(columnDefinition = "TEXT")
    private String coverImage;

    // We store the blocks (text, headings) as a big JSON string for now.
    @Column(columnDefinition = "TEXT")
    private String blocksJson;

    private UUID parentId; // For nesting pages inside each other
    private boolean isFavorite = false;
    private boolean isDeleted = false; // "Soft delete" (Move to trash)

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}