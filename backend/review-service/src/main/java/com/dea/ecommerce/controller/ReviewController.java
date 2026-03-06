package com.dea.ecommerce.controller;

import com.dea.ecommerce.entity.Review;
import com.dea.ecommerce.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        return new ResponseEntity<>(reviewService.addReview(review), HttpStatus.CREATED);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProductId(@PathVariable Long productId) {
        return new ResponseEntity<>(reviewService.getReviewsByProductId(productId), HttpStatus.OK);
    }

    // 🟢 NEW: Endpoint for Admins to submit a reply
    @PutMapping("/{reviewId}/reply")
    public ResponseEntity<Review> addAdminReply(@PathVariable Long reviewId, @RequestBody Map<String, String> payload) {
        String replyText = payload.get("reply");
        return new ResponseEntity<>(reviewService.addAdminReply(reviewId, replyText), HttpStatus.OK);
    }
}