package com.lifeflow.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pages")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Page {

    @Id
    private String id;

    private String title;
    private String icon;

    @Column(columnDefinition = "TEXT")
    private String coverImage;

    @Column(columnDefinition = "TEXT")
    private String blocksJson;

    private String parentId;

    // --- ADD THIS MISSING FIELD ---
    private String userId;
    // -----------------------------

    private boolean favorite = false;
    private boolean deleted = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}