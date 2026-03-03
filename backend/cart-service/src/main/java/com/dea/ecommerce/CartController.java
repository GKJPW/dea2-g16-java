package com.dea.ecommerce;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService service;

    @GetMapping
    public List<CartItem> getCart() {
        return service.getAllItems();
    }


    @PostMapping
    public CartItem addItem(@RequestBody CartItem item) {
        return service.addToCart(item); // Ensure this method exists in CartService
    }


    @PostMapping("/bulk")
    public List<CartItem> addMultipleItems(@RequestBody List<CartItem> items) {
        return service.saveAllItems(items);
    }

    @DeleteMapping("/{id}")
    public String removeItem(@PathVariable Long id) {
        service.deleteItem(id);
        return "Item removed";
    }
    @GetMapping("/bulk")
    public List<CartItem> getCartFromBulk() {
        return service.getAllItems();
    }
}