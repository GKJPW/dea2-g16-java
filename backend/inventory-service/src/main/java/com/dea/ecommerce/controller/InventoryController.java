package com.dea.ecommerce.controller;

import com.dea.ecommerce.entity.Inventory;
import com.dea.ecommerce.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<Inventory> addInventory(@RequestBody Inventory inventory) {
        return new ResponseEntity<>(inventoryService.addInventory(inventory), HttpStatus.CREATED);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Inventory> getInventoryByProductId(@PathVariable Long productId) {
        Inventory inventory = inventoryService.getInventoryByProductId(productId);
        if (inventory != null) {
            return new ResponseEntity<>(inventory, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{productId}/reduce")
    public ResponseEntity<String> reduceStock(@PathVariable Long productId, @RequestParam Integer quantity) {
        try {
            inventoryService.reduceStock(productId, quantity);
            return new ResponseEntity<>("Stock reduced successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            System.err.println("❌ INVENTORY REJECTED: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 🟢 NEW: Endpoint for Admins to add stock
    @PutMapping("/{productId}/restock")
    public ResponseEntity<String> restockProduct(@PathVariable Long productId, @RequestParam Integer quantity) {
        try {
            inventoryService.restockProduct(productId, quantity);
            return new ResponseEntity<>("Stock successfully replenished", HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ RESTOCK FAILED: " + e.getMessage());
            return new ResponseEntity<>("Failed to restock", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}