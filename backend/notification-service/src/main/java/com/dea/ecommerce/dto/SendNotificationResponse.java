package com.dea.ecommerce.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SendNotificationResponse {
    private Long logId;
    private String status;
}