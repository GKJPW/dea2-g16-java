package com.dea.ecommerce.service;

import com.dea.ecommerce.dto.SendNotificationRequest;
import com.dea.ecommerce.dto.SendNotificationResponse;
import com.dea.ecommerce.entity.NotificationLog;
import com.dea.ecommerce.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationLogRepository logRepository;

    @Override
    public SendNotificationResponse sendEmailNotification(SendNotificationRequest request) {

        System.out.println("=== EMAIL SIMULATION ===");
        System.out.println("To: " + (request.getToEmail() == null ? "not-provided@example.com" : request.getToEmail()));
        System.out.println("Event: " + request.getEventType());
        System.out.println("Message: " + request.getMessage());
        System.out.println("========================");

        NotificationLog saved = logRepository.save(
                NotificationLog.builder()
                        .message(request.getMessage())
                        .eventType(request.getEventType())
                        .channel("EMAIL")
                        .status("SENT")
                        .build()
        );

        return SendNotificationResponse.builder()
                .logId(saved.getId())
                .status(saved.getStatus())
                .build();
    }
}