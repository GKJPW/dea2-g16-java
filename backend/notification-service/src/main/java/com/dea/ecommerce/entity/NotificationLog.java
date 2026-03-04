package com.dea.ecommerce.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g., "Order #101 Placed"
    @Column(nullable = false, length = 255)
    private String message;

    // e.g., ORDER_PLACED, ORDER_CANCELLED
    @Column(nullable = false, length = 50)
    private String eventType;

    // EMAIL (for now)
    @Column(nullable = false, length = 30)
    private String channel;

    // SENT / FAILED
    @Column(nullable = false, length = 20)
    private String status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}