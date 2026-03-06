package com.dea.ecommerce.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "global_discount")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GlobalDiscount {
    @Id
    private Long id = 1L; // We lock this to ID 1 so there is only ever ONE global rule

    private Boolean isActive;
    private Double discountPercentage;
    private String discountMessage;
}