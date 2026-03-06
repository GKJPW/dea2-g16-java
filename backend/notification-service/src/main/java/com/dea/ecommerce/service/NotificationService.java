package com.dea.ecommerce.service;

import com.dea.ecommerce.entity.Notification;
import com.dea.ecommerce.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(Notification notification) {
        Notification saved = notificationRepository.save(notification);

        // 🟢 Max 50 Logic: If we exceed 50, delete the oldest ones
        List<Notification> allForRecipient = notificationRepository
                .findByRecipientOrderByTimestampAsc(notification.getRecipient());
        if (allForRecipient.size() > 50) {
            int itemsToRemove = allForRecipient.size() - 50;
            for (int i = 0; i < itemsToRemove; i++) {
                notificationRepository.delete(allForRecipient.get(i));
            }
        }
        return saved;
    }

    public List<Notification> getNotifications(String recipient) {
        return notificationRepository.findByRecipientOrderByTimestampDesc(recipient);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    public void clearAll(String recipient) {
        notificationRepository.deleteAllByRecipient(recipient);
    }
}