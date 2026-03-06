package com.dea.ecommerce.repository;

import com.dea.ecommerce.entity.GlobalDiscount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GlobalDiscountRepository extends JpaRepository<GlobalDiscount, Long> {
}