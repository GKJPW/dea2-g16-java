package com.dea.ecommerce.service;

import com.dea.ecommerce.dto.OrderItemRequest;
import com.dea.ecommerce.entity.OrderItemRecord;
import com.dea.ecommerce.repository.OrderItemRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderItemService {

    private final OrderItemRecordRepository orderItemRecordRepository;

    public OrderItemService(OrderItemRecordRepository orderItemRecordRepository) {
        this.orderItemRecordRepository = orderItemRecordRepository;
    }

    public void saveOrderItems(Long orderId, List<OrderItemRequest> items) {
        List<OrderItemRecord> records = items.stream()
                .map(item -> {
                    OrderItemRecord record = new OrderItemRecord();
                    record.setOrderId(orderId);
                    record.setProductId(item.getProductId());
                    record.setProductName(item.getProductName());
                    record.setQuantity(item.getQuantity());
                    record.setTotalPrice(item.getTotalPrice());
                    record.setDate(item.getDate());
                    return record;
                })
                .collect(Collectors.toList());

        orderItemRecordRepository.saveAll(records);
    }
}

