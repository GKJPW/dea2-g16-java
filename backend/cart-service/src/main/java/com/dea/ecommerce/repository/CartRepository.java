package com.dea.ecommerce.repository;

import com.dea.ecommerce.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);

    @Modifying
    @Transactional
    void deleteByUserId(Long userId);

    // 🟢 NEW: Delete a specific item using its unique ID
    @Modifying
    @Transactional
    void deleteById(Long id);
}