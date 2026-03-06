package com.dea.ecommerce.service;

import com.dea.ecommerce.entity.Product;
import com.dea.ecommerce.entity.GlobalDiscount;
import com.dea.ecommerce.repository.ProductRepository;
import com.dea.ecommerce.repository.GlobalDiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private GlobalDiscountRepository discountRepository;

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // 🟢 NEW: Update an existing product's details
    public Product updateProduct(Long id, Product updatedDetails) {
        Product existing = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setName(updatedDetails.getName());
        existing.setDescription(updatedDetails.getDescription());
        existing.setPrice(updatedDetails.getPrice());
        existing.setCategory(updatedDetails.getCategory());
        existing.setImageUrl(updatedDetails.getImageUrl());
        // Note: We don't update stock here because the Inventory Service manages stock!
        return productRepository.save(existing);
    }

    // 🟢 NEW: Get the current global discount (Returns default 0% inactive if
    // empty)
    public GlobalDiscount getGlobalDiscount() {
        return discountRepository.findById(1L).orElse(new GlobalDiscount(1L, false, 0.0, ""));
    }

    // 🟢 NEW: Update or Turn On/Off the global discount
    public GlobalDiscount updateGlobalDiscount(GlobalDiscount discount) {
        discount.setId(1L); // Force it to always overwrite row 1
        return discountRepository.save(discount);
    }
}