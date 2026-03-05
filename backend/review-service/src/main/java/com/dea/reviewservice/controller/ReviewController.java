package com.dea.reviewservice.controller;

import com.dea.reviewservice.dto.ReviewRequest;
import com.dea.reviewservice.entity.Review;
import com.dea.reviewservice.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService service;

    public ReviewController(ReviewService service) {
        this.service = service;
    }

    @GetMapping
    public List<Review> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Review create(@Valid @RequestBody ReviewRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public Review update(@PathVariable Long id, @Valid @RequestBody ReviewRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}