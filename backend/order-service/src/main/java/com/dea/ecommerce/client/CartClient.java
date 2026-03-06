package com.dea.ecommerce.client;

import com.dea.ecommerce.dto.CartItemDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "CART-SERVICE")
public interface CartClient {

    @GetMapping("/api/carts/{userId}")
    List<CartItemDto> getCartItemsByUserId(@PathVariable("userId") Long userId);

    @DeleteMapping("/api/carts/user/{userId}")
    void clearCart(@PathVariable("userId") Long userId);
}
