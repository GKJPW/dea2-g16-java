package com.dea.reviewservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 1000)
    private String comment;

    private int rating;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}

    public Review(String name, String comment, int rating) {
        this.name = name;
        this.comment = comment;
        this.rating = rating;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getComment() { return comment; }
    public int getRating() { return rating; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setComment(String comment) { this.comment = comment; }
    public void setRating(int rating) { this.rating = rating; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}