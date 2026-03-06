package com.dea.ecommerce.client;

import com.dea.ecommerce.dto.PaymentRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "PAYMENT-SERVICE")
public interface PaymentClient {

    @PostMapping("/api/payments/process")
    String processPayment(@RequestBody PaymentRequest request);
}
