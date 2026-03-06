package com.ecommerce.inventory_service.service;

import com.ecommerce.inventory_service.model.Inventory;
import com.ecommerce.inventory_service.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public Inventory addItem(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public void deleteItem(Long id) {
        inventoryRepository.deleteById(id);
    }

    public Inventory restockItem(Long id, Integer newQuantity) {
        Optional<Inventory> existingInventory = inventoryRepository.findById(id);

        if (existingInventory.isPresent()) {
            Inventory item = existingInventory.get();
            item.setQuantity(newQuantity);
            return inventoryRepository.save(item);
        } else {
            throw new RuntimeException("Inventory item not found with id: " + id);
        }
    }

    public Inventory updateInventory(Long id, Inventory inventoryDetails) {

        return inventoryRepository.findById(id).map(item -> {

            item.setProductId(inventoryDetails.getProductId());
            item.setProductName(inventoryDetails.getProductName());
            item.setQuantity(inventoryDetails.getQuantity());

            return inventoryRepository.save(item);

        }).orElseThrow(() -> new RuntimeException("Inventory item not found with id: " + id));
    }

    public List<Inventory> getAllItems() {
        return inventoryRepository.findAll();
    }
}