package com.dea.ecommerce.service;

import com.dea.ecommerce.entity.Review;
import com.dea.ecommerce.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review addReview(Review review) {
        Review saved = reviewRepository.save(review);

        List<Review> productReviews = reviewRepository.findByProductIdOrderByTimestampAsc(review.getProductId());
        if (productReviews.size() > 50) {
            int itemsToRemove = productReviews.size() - 50;
            for (int i = 0; i < itemsToRemove; i++) {
                reviewRepository.delete(productReviews.get(i));
            }
        }
        return saved;
    }

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductIdOrderByTimestampDesc(productId);
    }

    public Review addAdminReply(Long reviewId, String replyText) {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not found"));
        review.setAdminReply(replyText);
        // 🟢 NEW: Automatically stamp the current UTC time for the reply
        review.setAdminReplyTimestamp(LocalDateTime.now());
        return reviewRepository.save(review);
    }
}