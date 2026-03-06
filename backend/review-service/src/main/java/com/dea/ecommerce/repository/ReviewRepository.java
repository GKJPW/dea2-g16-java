package com.dea.ecommerce.repository;

import com.dea.ecommerce.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // 🟢 Fetch reviews for a specific product, newest first
    List<Review> findByProductIdOrderByTimestampDesc(Long productId);
    
    // 🟢 Fetch oldest first (used for the Max 50 pruning logic)
    List<Review> findByProductIdOrderByTimestampAsc(Long productId);
}