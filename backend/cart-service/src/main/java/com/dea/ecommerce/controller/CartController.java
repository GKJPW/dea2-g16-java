package com.dea.ecommerce.controller;

import com.dea.ecommerce.entity.CartItem;
import com.dea.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItem cartItem) {
        return new ResponseEntity<>(cartService.addToCart(cartItem), HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCartItemsByUserId(@PathVariable Long userId) {
        return new ResponseEntity<>(cartService.getCartItemsByUserId(userId), HttpStatus.OK);
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return new ResponseEntity<>("Cart cleared", HttpStatus.OK);
    }

    // 🟢 NEW: Endpoint to delete a specific item
    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<String> removeCartItem(@PathVariable Long itemId) {
        cartService.removeCartItem(itemId);
        return new ResponseEntity<>("Item removed from cart", HttpStatus.OK);
    }

    // 🟢 NEW: Endpoint to update quantity
    @PutMapping("/item/{itemId}")
    public ResponseEntity<CartItem> updateQuantity(@PathVariable Long itemId, @RequestParam Integer quantity) {
        return new ResponseEntity<>(cartService.updateQuantity(itemId, quantity), HttpStatus.OK);
    }
}