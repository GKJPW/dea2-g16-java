package com.dea.ecommerce.repository;

import com.dea.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 🟢 NEW: Find user by email for login validation
    Optional<User> findByEmail(String email);
}