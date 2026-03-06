package com.dea.ecommerce.repository;

import com.dea.ecommerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // 🟢 NEW: Automatically fetches the latest 200 orders for a specific user
    List<Order> findTop200ByUserIdOrderByOrderDateDesc(Long userId);
}