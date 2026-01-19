package com.lifeflow.backend.repository;

import com.lifeflow.backend.model.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PageRepository extends JpaRepository<Page, UUID> {
    // Find all pages that are NOT in the trash
    List<Page> findByIsDeletedFalse();

    // Find all pages that ARE in the trash
    List<Page> findByIsDeletedTrue();
}