package com.dea.ecommerce.repository;

import com.dea.ecommerce.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    // 🟢 THE FIX: 'findFirst' guarantees it will never crash on duplicate records!
    Optional<Inventory> findFirstByProductId(Long productId);
}