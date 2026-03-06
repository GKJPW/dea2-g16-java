package com.dea.ecommerce.controller;

import com.dea.ecommerce.dto.PaymentRequest;
import com.dea.ecommerce.entity.Payment;
import com.dea.ecommerce.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping(value = { "", "/process" })
    public ResponseEntity<String> processPayment(@RequestBody PaymentRequest request) {
        return new ResponseEntity<>(paymentService.processPayment(request), HttpStatus.OK);
    }

    // 🟢 Changed to use {id} instead of {orderId}
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
                .map(payment -> new ResponseEntity<>(payment, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}