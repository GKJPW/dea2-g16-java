package com.dea.ecommerce.controller;

import com.dea.ecommerce.dto.SendNotificationRequest;
import com.dea.ecommerce.dto.SendNotificationResponse;
import com.dea.ecommerce.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send-email")
    public ResponseEntity<SendNotificationResponse> sendEmail(@RequestBody SendNotificationRequest request) {
        return ResponseEntity.ok(notificationService.sendEmailNotification(request));
    }
}