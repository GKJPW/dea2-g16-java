package com.dea.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private Long userId;
    private String userName;

    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(columnDefinition = "TEXT")
    private String adminReply;

    // 🟢 NEW: Store the exact date and time the admin replied
    private LocalDateTime adminReplyTimestamp;

    @Column(updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}