package com.lifeflow.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // <--- IMPORTS FIXED
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "pages")
@JsonIgnoreProperties(ignoreUnknown = true) // <--- FIX 1: Prevents crash from 'blocks' field
public class Page {

    @Id
    // <--- FIX 2: @GeneratedValue is REMOVED so we accept Frontend IDs
    private String id;

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