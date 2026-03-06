package com.dea.ecommerce.service;

import com.dea.ecommerce.dto.SendNotificationRequest;
import com.dea.ecommerce.dto.SendNotificationResponse;

public interface NotificationService {
    SendNotificationResponse sendEmailNotification(SendNotificationRequest request);
}