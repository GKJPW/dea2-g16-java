package com.dea.ecommerce.repository;

import com.dea.ecommerce.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Fetch newest first
    List<Notification> findByRecipientOrderByTimestampDesc(String recipient);

    // Fetch oldest first (used for deleting old messages)
    List<Notification> findByRecipientOrderByTimestampAsc(String recipient);

    @Transactional
    void deleteAllByRecipient(String recipient);
}