package com.lifeflow.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String email;
    private String avatar;
    
    @Column(columnDefinition = "TEXT")
    private String bio;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
