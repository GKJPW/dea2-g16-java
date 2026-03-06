package com.dea.ecommerce.client;

import com.dea.ecommerce.dto.InventoryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "INVENTORY-SERVICE")
public interface InventoryClient {

    @GetMapping("/api/inventory/{productId}")
    InventoryDto getInventoryByProductId(@PathVariable("productId") Long productId);

    @org.springframework.web.bind.annotation.PutMapping("/api/inventory/{productId}/reduce")
    void reduceStock(@PathVariable("productId") Long productId,
            @org.springframework.web.bind.annotation.RequestParam("quantity") Integer quantity);
}
