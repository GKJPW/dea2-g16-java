package com.dea.ecommerce.dto;

import lombok.Data;

@Data
public class SendNotificationRequest {
    private String message;
    private String eventType;
    private String toEmail;
}