package com.dea.ecommerce.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String phone;

    // optional
    private String profileImageUrl;
}