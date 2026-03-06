package com.dea.ecommerce.repository;

import com.dea.ecommerce.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // 🟢 We completely removed findByOrderId to prevent the Spring Boot crash!
}