package com.dea.reviewservice.service;

import com.dea.reviewservice.dto.ReviewRequest;
import com.dea.reviewservice.entity.Review;
import com.dea.reviewservice.repository.ReviewRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository repo;

    public ReviewService(ReviewRepository repo) {
        this.repo = repo;
    }

    public List<Review> getAll() {
        return repo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public Review create(ReviewRequest request) {
        Review review = new Review(request.getName(), request.getComment(), request.getRating());
        return repo.save(review);
    }

    public Review update(Long id, ReviewRequest request) {
        Review review = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found: " + id));

        review.setName(request.getName());
        review.setComment(request.getComment());
        review.setRating(request.getRating());

        return repo.save(review);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Review not found: " + id);
        }
        repo.deleteById(id);
    }
}