package com.dea.ecommerce.controller;

import com.dea.ecommerce.entity.Product;
import com.dea.ecommerce.entity.GlobalDiscount;
import com.dea.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return new ResponseEntity<>(productService.createProduct(product), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return new ResponseEntity<>(productService.getAllProducts(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return new ResponseEntity<>(productService.getProductById(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return new ResponseEntity<>("Product successfully deleted", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete product", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 🟢 NEW: Endpoint to edit an existing product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return new ResponseEntity<>(productService.updateProduct(id, product), HttpStatus.OK);
    }

    // 🟢 NEW: Endpoint to get the active global discount
    @GetMapping("/discount")
    public ResponseEntity<GlobalDiscount> getGlobalDiscount() {
        return new ResponseEntity<>(productService.getGlobalDiscount(), HttpStatus.OK);
    }

    // 🟢 NEW: Endpoint for Admin to update/toggle the discount
    @PutMapping("/discount")
    public ResponseEntity<GlobalDiscount> updateGlobalDiscount(@RequestBody GlobalDiscount discount) {
        return new ResponseEntity<>(productService.updateGlobalDiscount(discount), HttpStatus.OK);
    }
}