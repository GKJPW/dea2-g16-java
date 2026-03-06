package com.dea.ecommerce.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/carts")
public class HelloController {

    @GetMapping("/status")
    public String status() {
        return "Cart Service is running on port 8082";
    }
}
