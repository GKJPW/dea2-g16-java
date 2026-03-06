package com.dea.ecommerce.service;

import com.dea.ecommerce.client.CartClient;
import com.dea.ecommerce.client.InventoryClient;
import com.dea.ecommerce.client.NotificationClient;
import com.dea.ecommerce.client.PaymentClient;
import com.dea.ecommerce.client.UserClient;
import com.dea.ecommerce.dto.CartItemDto;
import com.dea.ecommerce.dto.InventoryDto;
import com.dea.ecommerce.dto.NotificationRequest;
import com.dea.ecommerce.dto.PaymentRequest;
import com.dea.ecommerce.dto.UserDto;
import com.dea.ecommerce.entity.Order;
import com.dea.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserClient userClient;
    @Autowired
    private InventoryClient inventoryClient;
    @Autowired
    private CartClient cartClient;
    @Autowired
    private NotificationClient notificationClient;
    @Autowired
    private PaymentClient paymentClient;

    public Order placeOrder(Order order) {
        UserDto user = userClient.getUserById(order.getUserId());
        if (user == null) {
            throw new IllegalArgumentException("Cannot place order: User ID " + order.getUserId() + " does not exist!");
        }

        InventoryDto inventory = inventoryClient.getInventoryByProductId(order.getProductId());
        if (inventory == null || inventory.getStockQuantity() < order.getQuantity()) {
            throw new RuntimeException("Product is out of stock or does not exist!");
        }

        String paymentStatus = paymentClient
                .processPayment(new PaymentRequest(order.getUserId(), order.getTotalAmount()));
        if (!"PAYMENT_SUCCESS".equals(paymentStatus)) {
            throw new RuntimeException("Payment failed!");
        }

        order.setOrderDate(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);
        inventoryClient.reduceStock(savedOrder.getProductId(), savedOrder.getQuantity());
        sendOrderNotification(savedOrder);

        return savedOrder;
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> getOrderHistory(Long userId) {
        return orderRepository.findTop200ByUserIdOrderByOrderDateDesc(userId);
    }

    // 🟢 FIXED: Accept the discount Double and save it to the Order!
    public List<Order> checkoutCart(Long userId, Map<String, BigDecimal> itemPrices, Double discount) {
        List<CartItemDto> cartItems = cartClient.getCartItemsByUserId(userId);

        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        List<Order> savedOrders = new ArrayList<>();

        for (CartItemDto item : cartItems) {
            Order order = new Order();
            order.setOrderNumber(UUID.randomUUID().toString());
            order.setUserId(item.getUserId());
            order.setProductId(item.getProductId());
            order.setQuantity(item.getQuantity());
            order.setStatus("CONFIRMED");

            BigDecimal unitPrice = itemPrices.getOrDefault(String.valueOf(item.getProductId()), BigDecimal.ZERO);

            BigDecimal finalLineTotal = unitPrice.multiply(new BigDecimal(item.getQuantity()));
            order.setTotalAmount(finalLineTotal);

            order.setOrderDate(LocalDateTime.now());

            // 🟢 Freeze the discount percentage into the receipt!
            order.setAppliedDiscount(discount);

            inventoryClient.reduceStock(item.getProductId(), item.getQuantity());

            String paymentStatus = paymentClient
                    .processPayment(new PaymentRequest(item.getUserId(), order.getTotalAmount()));
            if (!"PAYMENT_SUCCESS".equals(paymentStatus)) {
                throw new RuntimeException("Payment failed!");
            }

            Order savedOrder = orderRepository.save(order);
            savedOrders.add(savedOrder);
            sendOrderNotification(savedOrder);
        }

        cartClient.clearCart(userId);
        return savedOrders;
    }

    private void sendOrderNotification(Order order) {
        NotificationRequest request = new NotificationRequest(
                order.getUserId(),
                "Your order " + order.getOrderNumber() + " has been successfully placed!",
                false);
        notificationClient.sendNotification(request);
    }
}