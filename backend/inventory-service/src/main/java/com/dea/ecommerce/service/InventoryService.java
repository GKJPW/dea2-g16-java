package com.dea.ecommerce.service;

import com.dea.ecommerce.entity.Inventory;
import com.dea.ecommerce.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public Inventory addInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public Inventory getInventoryByProductId(Long productId) {
        Optional<Inventory> inventory = inventoryRepository.findFirstByProductId(productId);
        return inventory.orElse(null);
    }

    @Transactional
    public void reduceStock(Long productId, Integer quantity) {
        Inventory inventory = inventoryRepository.findFirstByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Inventory not found for product: " + productId));

        if (inventory.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + productId);
        }

        inventory.setStockQuantity(inventory.getStockQuantity() - quantity);
        inventoryRepository.saveAndFlush(inventory);
    }

    // 🟢 NEW: Smart Restock Method
    @Transactional
    public void restockProduct(Long productId, Integer quantity) {
        Inventory inventory = inventoryRepository.findFirstByProductId(productId).orElse(null);

        if (inventory == null) {
            // Product has never had stock before, create a new record
            inventory = new Inventory();
            inventory.setProductId(productId);
            inventory.setStockQuantity(quantity);
        } else {
            // Product exists, add the new items to the existing count
            inventory.setStockQuantity(inventory.getStockQuantity() + quantity);
        }

        inventoryRepository.saveAndFlush(inventory);
    }
}