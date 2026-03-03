package com.dea.ecommerce;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository repository;

    public List<CartItem> getAllItems() {
        return repository.findAll();
    }

    public CartItem addToCart(CartItem item) {
        return repository.save(item);
    }

    public void clearCart() {
        repository.deleteAll();
    }

    public void deleteItem(Long id) {
        repository.deleteById(id);
    }
    public List<CartItem> saveAllItems(List<CartItem> items) {
        return repository.saveAll(items);
    }
}