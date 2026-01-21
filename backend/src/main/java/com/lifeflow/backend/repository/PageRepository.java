package com.lifeflow.backend.repository;

import com.lifeflow.backend.model.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PageRepository extends JpaRepository<Page, String> {
    // Corrected method names (findByDeleted instead of findByIsDeleted)
    List<Page> findByDeletedFalse();
    List<Page> findByDeletedTrue();
}