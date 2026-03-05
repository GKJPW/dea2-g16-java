package com.dea.ecommerce.repository;

import com.dea.ecommerce.entity.OrderItemRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRecordRepository extends JpaRepository<OrderItemRecord, Long> {
}

