package com.dea.ecommerce.controller;

import com.dea.ecommerce.entity.Order;
import com.dea.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        return new ResponseEntity<>(orderService.placeOrder(order), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return new ResponseEntity<>(orderService.getOrderById(id), HttpStatus.OK);
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Order>> getOrderHistory(@PathVariable Long userId) {
        return new ResponseEntity<>(orderService.getOrderHistory(userId), HttpStatus.OK);
    }

    // 🟢 FIXED: Accept the discount percentage as a Request Parameter
    @PostMapping("/checkout/{userId}")
    public ResponseEntity<List<Order>> checkoutCart(
            @PathVariable Long userId,
            @RequestParam(required = false, defaultValue = "0.0") Double discount,
            @RequestBody Map<String, BigDecimal> itemPrices) {
        return new ResponseEntity<>(orderService.checkoutCart(userId, itemPrices, discount), HttpStatus.CREATED);
    }
}