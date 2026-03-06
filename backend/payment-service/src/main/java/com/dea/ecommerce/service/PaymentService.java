package com.dea.ecommerce.service;

import com.dea.ecommerce.dto.PaymentRequest;
import com.dea.ecommerce.entity.Payment;
import com.dea.ecommerce.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public String processPayment(PaymentRequest request) {
        Payment payment = new Payment();
        payment.setUserId(request.getUserId());
        payment.setAmount(request.getAmount());
        payment.setPaymentStatus("PAYMENT_SUCCESS");

        paymentRepository.save(payment);

        return payment.getPaymentStatus();
    }

    // 🟢 Changed to use the built-in findById instead of getPaymentByOrderId
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }
}