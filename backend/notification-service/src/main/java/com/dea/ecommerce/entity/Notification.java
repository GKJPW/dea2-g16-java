package com.dea.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // e.g., ADDED, DELETED, LOW_STOCK, OUT_OF_STOCK, SOLD, PURCHASED
    private String message;
    private String recipient; // "ADMIN" or "USER"

    @Column(updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}