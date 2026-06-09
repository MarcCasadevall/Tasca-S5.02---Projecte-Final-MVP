package com.bakery.product.dto;

import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class UpdateProductRequest {

    private String name;

    private String description;

    @Positive
    private BigDecimal price;

    private String category;

    private String imageUrl;
}