package com.lifeflow.backend.repository;

import com.lifeflow.backend.model.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PageRepository extends JpaRepository<Page, String> {
    List<Page> findByDeletedFalse();
    List<Page> findByDeletedTrue();
    List<Page> findByUserIdAndDeletedFalse(String userId);
    List<Page> findByUserIdAndDeletedTrue(String userId);
}