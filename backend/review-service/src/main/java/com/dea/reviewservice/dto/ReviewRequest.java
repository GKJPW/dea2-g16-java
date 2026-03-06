package com.dea.reviewservice.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ReviewRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Comment is required")
    private String comment;

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private int rating;

    public String getName() { return name; }
    public String getComment() { return comment; }
    public int getRating() { return rating; }

    public void setName(String name) { this.name = name; }
    public void setComment(String comment) { this.comment = comment; }
    public void setRating(int rating) { this.rating = rating; }
}