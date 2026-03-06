package com.dea.ecommerce.service;

import com.dea.ecommerce.entity.CartItem;
import com.dea.ecommerce.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public CartItem addToCart(CartItem cartItem) {
        return cartRepository.save(cartItem);
    }

    public List<CartItem> getCartItemsByUserId(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }

    // 🟢 NEW: Remove a specific item from the cart
    public void removeCartItem(Long itemId) {
        cartRepository.deleteById(itemId);
    }

    // 🟢 NEW: Update the quantity of a specific item
    public CartItem updateQuantity(Long itemId, Integer newQuantity) {
        Optional<CartItem> optionalItem = cartRepository.findById(itemId);
        if (optionalItem.isPresent()) {
            CartItem item = optionalItem.get();
            item.setQuantity(newQuantity);
            return cartRepository.save(item);
        }
        throw new RuntimeException("Cart item not found");
    }
}