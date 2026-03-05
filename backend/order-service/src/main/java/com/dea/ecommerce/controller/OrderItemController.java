package com.dea.ecommerce.controller;

import com.dea.ecommerce.dto.OrderItemRequest;
import com.dea.ecommerce.service.OrderItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @PostMapping("/{orderId}/items")
    public ResponseEntity<Void> saveOrderItems(
            @PathVariable Long orderId,
            @RequestBody List<OrderItemRequest> items
    ) {
        orderItemService.saveOrderItems(orderId, items);
        return ResponseEntity.ok().build();
    }
}

