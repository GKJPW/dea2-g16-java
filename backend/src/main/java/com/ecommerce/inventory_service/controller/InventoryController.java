package com.ecommerce.inventory_service.controller;

import com.ecommerce.inventory_service.model.Inventory;
import com.ecommerce.inventory_service.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/add")
    public ResponseEntity<Inventory> addItem(@RequestBody Inventory inventory) {
        Inventory savedItem = inventoryService.addItem(inventory);
        return ResponseEntity.ok(savedItem);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.ok("Item deleted successfully");
    }

    @PutMapping("/restock/{id}")
    public ResponseEntity<Inventory> restockItem(
            @PathVariable Long id,
            @RequestParam Integer newQuantity) {
        Inventory updatedItem = inventoryService.restockItem(id, newQuantity);
        return ResponseEntity.ok(updatedItem);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Inventory> updateInventory(
            @PathVariable Long id,
            @RequestBody Inventory inventoryDetails) {
        Inventory updatedItem = inventoryService.updateInventory(id, inventoryDetails);
        return ResponseEntity.ok(updatedItem);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Inventory>> getAllItems() {
        List<Inventory> items = inventoryService.getAllItems();
        return ResponseEntity.ok(items);
    }
}