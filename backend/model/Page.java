package com.lifeflow.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // <--- 1. NEW IMPORT
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "pages")
@JsonIgnoreProperties(ignoreUnknown = true) // <--- 2. NEW ANNOTATION (Fixes the error)
public class Page {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    private String icon;

    @Column(columnDefinition = "TEXT")
    private String coverImage;

    @Column(columnDefinition = "TEXT")
    private String blocksJson;

    private UUID parentId;
    private boolean isFavorite = false;
    private boolean isDeleted = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}